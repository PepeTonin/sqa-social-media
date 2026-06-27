"""
Testes End-to-End da atividade.

Aqui a ideia e simular o uso real no navegador,
passando pela interface da aplicacao.
"""

from conftest import APP_BASE_URL, DEFAULT_PASSWORD, create_user_by_api


def test_fluxo_de_cadastro(page, unique_email):
    """
    Fluxo completo:
    1. abrir a tela de cadastro;
    2. preencher os campos;
    3. enviar o formulario;
    4. validar que o usuario ficou autenticado.
    """
    page.goto(f"{APP_BASE_URL}/signup")

    # O formulario e simples, entao usei seletores diretos.
    page.locator("input[type='email']").fill(unique_email)
    page.locator("input[type='password']").nth(0).fill(DEFAULT_PASSWORD)
    page.locator("input[type='password']").nth(1).fill(DEFAULT_PASSWORD)

    # Limito a busca ao formulario principal para evitar conflito com o botao do cabecalho.
    page.locator("main").get_by_role("button", name="Criar Conta").click()

    # Depois do cadastro a tela volta para a home.
    page.wait_for_url(f"{APP_BASE_URL}/")

    # Esses botoes aparecem apenas quando o usuario esta logado.
    assert page.get_by_role("button", name="Posts Curtidos").is_visible()
    assert page.get_by_role("button", name="Sair").is_visible()


def test_fluxo_de_login(page, unique_email):
    """
    Fluxo completo:
    1. criar o usuario pela API para preparar o cenario;
    2. abrir a tela de login;
    3. preencher credenciais validas;
    4. validar autenticacao na interface.
    """
    create_response = create_user_by_api(unique_email)
    assert create_response.status_code == 200

    page.goto(f"{APP_BASE_URL}/signin")

    page.locator("input[type='email']").fill(unique_email)
    page.locator("input[type='password']").fill(DEFAULT_PASSWORD)

    # Limito a busca ao formulario principal para evitar conflito com o botao do cabecalho.
    page.locator("main").get_by_role("button", name="Entrar").click()

    page.wait_for_url(f"{APP_BASE_URL}/")

    assert page.get_by_role("button", name="Posts Curtidos").is_visible()
    assert page.get_by_role("button", name="Sair").is_visible()
