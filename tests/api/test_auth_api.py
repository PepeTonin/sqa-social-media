"""
Testes de API da atividade.

Todos os testes sao de caixa-preta:
- fazem requisicoes HTTP reais;
- validam apenas entrada e saida;
- nao acessam implementacao interna.
"""

from conftest import DEFAULT_PASSWORD, api_get, api_post, create_user_by_api


def test_signup_com_sucesso(unique_email):
    """
    Valida o cadastro de um novo usuario.
    """
    response = api_post(
        "/auth/signup",
        {
            "email": unique_email,
            "password": DEFAULT_PASSWORD,
        },
    )

    # O cadastro correto deve retornar 200.
    assert response.status_code == 200

    data = response.json()

    # A API devolve pelo menos o id e o email do usuario criado.
    assert data["id"] > 0
    assert data["email"] == unique_email


def test_signup_com_email_duplicado(unique_email):
    """
    Valida a tentativa de cadastrar o mesmo e-mail duas vezes.
    """
    first_response = create_user_by_api(unique_email)
    second_response = create_user_by_api(unique_email)

    # A primeira criacao precisa funcionar para o cenario fazer sentido.
    assert first_response.status_code == 200

    # A segunda deve falhar com conflito.
    assert second_response.status_code == 409

    # Evito comparar a frase inteira para nao depender de acentuacao no ambiente.
    assert "uso" in second_response.json()["message"].lower()


def test_signin_com_sucesso(unique_email):
    """
    Valida login com credenciais validas.
    """
    create_response = create_user_by_api(unique_email)
    assert create_response.status_code == 200

    response = api_post(
        "/auth/signin",
        {
            "email": unique_email,
            "password": DEFAULT_PASSWORD,
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["email"] == unique_email
    assert data["id"] > 0


def test_reset_password_com_usuario_inexistente(unique_email):
    """
    Valida o comportamento quando o e-mail nao existe.
    """
    response = api_post(
        "/auth/reset-password",
        {
            "email": unique_email,
        },
    )

    assert response.status_code == 404

    # O importante aqui e validar que a API informa ausencia do usuario.
    assert "encontrado" in response.json()["message"].lower()


def test_posts_devem_expor_likes_e_dislikes():
    """
    Valida o novo contrato dos posts exibidos na home.
    """
    response = api_get("/posts", {"limit": 1, "skip": 0})

    assert response.status_code == 200

    data = response.json()
    assert len(data["posts"]) == 1

    first_post = data["posts"][0]
    assert "reactions" in first_post
    assert "likes" in first_post["reactions"]
    assert "dislikes" in first_post["reactions"]
