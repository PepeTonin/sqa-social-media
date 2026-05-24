package com.demoapp.demo.repositories;

import com.demoapp.demo.repository.UserRepository;

public class InMemoryUserRepository {
    // Sem o Mockito eh necessário implementar do zero um repository. Nesse caso ele deve implementar o "UserRepository", então implementa tudo do JPA também!

    // O mockito serve pra implementar classes e interfaces de forma falsa em tempo de execução

    // Nesse caso estou usando para implementar a "UserRepository" que também tem os métodos do JPA
}
