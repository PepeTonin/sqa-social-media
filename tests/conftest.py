"""
Arquivo de apoio dos testes.

Ele concentra:
- URLs base do sistema;
- dados padrao usados nos cenarios;
- funcoes utilitarias simples para evitar repeticao.
"""

import os
import time
from typing import Any

import pytest
import requests


# Mantive as URLs em variaveis de ambiente para o aluno poder trocar
# sem alterar o codigo. Se nada for informado, usamos o padrao do projeto.
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:3000")
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8080")

# Senha fixa e valida para deixar os exemplos previsiveis e faceis de entender.
DEFAULT_PASSWORD = "Senha@123"


def build_unique_email(prefix: str = "teste") -> str:
    """
    Gera um e-mail unico usando timestamp.

    Isso foi feito para evitar conflito com usuarios ja cadastrados
    no banco durante execucoes repetidas.
    """
    timestamp = int(time.time() * 1000)
    return f"{prefix}_{timestamp}@mail.com"


def api_post(path: str, payload: dict[str, Any]) -> requests.Response:
    """
    Faz um POST simples para a API.

    A funcao existe para deixar os testes menores e mais diretos.
    """
    return requests.post(
        f"{API_BASE_URL}{path}",
        json=payload,
        timeout=15,
    )


def api_get(path: str, params: dict[str, Any] | None = None) -> requests.Response:
    """
    Faz um GET simples para a API.
    """
    return requests.get(
        f"{API_BASE_URL}{path}",
        params=params,
        timeout=15,
    )


def create_user_by_api(
    email: str, password: str = DEFAULT_PASSWORD
) -> requests.Response:
    """
    Cria um usuario pela propria API da aplicacao.

    Esse helper e util para preparar cenarios de login
    sem depender da interface visual.
    """
    return api_post(
        "/auth/signup",
        {
            "email": email,
            "password": password,
        },
    )


@pytest.fixture
def unique_email() -> str:
    """
    Entrega um e-mail novo para cada teste.
    """
    return build_unique_email()
