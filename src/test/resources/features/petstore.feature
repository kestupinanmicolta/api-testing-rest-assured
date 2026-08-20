Feature: API REST - JSONPlaceholder

  Background:
    Given que la API base está configurada en "https://jsonplaceholder.typicode.com"

  # ==================== CRUD DE POSTS ====================

  Scenario: Crear un nuevo post
    Cuando creo un post con title "Test Title" y body "Test Body" y userId 1
    Entonces el post es creado exitosamente
    Y el status code es 201

  Scenario: Consultar un post por ID
    Cuando consulto el post con ID 1
    Entonces el post tiene title no vacío
    Y el status code es 200

  Scenario: Actualizar un post existente
    Dado que existe un post con ID 1
    Cuando actualizo el post con title "Updated Title" y body "Updated Body"
    Entonces el post tiene title "Updated Title"
    Y el status code es 200

  Scenario: Eliminar un post
    Dado que existe un post con ID 1
    Cuando elimino el post por ID 1
    Entonces el status code es 200

  # ==================== CONSULTAS ====================

  Scenario: Consultar todos los posts
    Cuando consulto todos los posts
    Entonces la respuesta contiene al menos 1 post
    Y cada post tiene campos válidos

  Scenario: Consultar posts por usuario
    Cuando consulto posts del usuario 1
    Entonces la respuesta contiene al menos 1 post
    Y cada post tiene userId 1

  # ==================== TESTS NEGATIVOS ====================

  Scenario: Consultar post inexistente
    Cuando consulto el post con ID 99999
    Entonces el status code es 404

  # ==================== VALIDACIÓN DE SCHEMA ====================

  Scenario: Validar estructura de respuesta de post
    Cuando consulto el post con ID 1
    Entonces el post contiene los campos: userId, id, title, body
    Y el campo title no está vacío

  # ==================== COMMENTS ====================

  Scenario: Consultar comentarios de un post
    Cuando consulto comentarios del post 1
    Entonces la respuesta contiene al menos 1 comentario
    Y el status code es 200

  # ==================== USERS ====================

  Scenario: Consultar usuario específico
    Cuando consulto el usuario con ID 1
    Entonces el usuario tiene name no vacío
    Y el status code es 200
