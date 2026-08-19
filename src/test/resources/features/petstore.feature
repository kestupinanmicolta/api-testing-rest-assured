# language: es
Característica: API de mascotas - Petstore

  Antecedentes:
    Dado que la API base está configurada en "https://petstore.swagger.io/v2"

  # ==================== CRUD DE MASCOTAS ====================

  Escenario: Crear una mascota nueva
    Cuando creo una mascota con nombre "Firulais", status "available" y nombre de categoría "Dog"
    Entonces la mascota es creada exitosamente con id
    Y el status code es 200

  Escenario: Consultar mascota por ID
    Dado que tengo una mascota creada con nombre "Max"
    Cuando consulto la mascota por su ID
    Entonces la mascota tiene nombre "Max"
    Y el status code es 200

  Escenario: Actualizar mascota existente
    Dado que tengo una mascota creada con nombre "Buddy"
    Cuando actualizo la mascota con nombre "Buddy Updated" y status "sold"
    Entonces la mascota tiene nombre "Buddy Updated"
    Y el status code es 200

  Escenario: Eliminar mascota
    Dado que tengo una mascota creada con nombre "Rocky"
    Cuando elimino la mascota por su ID
    Entonces el status code es 200

  # ==================== CONSULTAS ====================

  Escenario: Consultar mascotas por status available
    Dado que consulto mascotas por status "available"
    Entonces la respuesta contiene al menos 1 mascota
    Y cada mascota tiene status "available"

  Escenario: Consultar mascotas por status sold
    Dado que consulto mascotas por status "sold"
    Entonces la respuesta contiene al menos 1 mascota
    Y cada mascota tiene status "sold"

  # ==================== TESTS NEGATIVOS ====================

  Escenario: Consultar mascota inexistente
    Dado que consulto la mascota con ID 999999
    Entonces el status code es 404

  Escenario: Crear mascota sin nombre
    Cuando creo una mascota con nombre "" y status "available"
    Entonces el status code es 200

  # ==================== VALIDACIÓN DE SCHEMA ====================

  Escenario: Validar estructura de respuesta de mascota
    Dado que tengo una mascota creada con nombre "Luna"
    Cuando consulto la mascota por su ID
    Entonces la respuesta contiene los campos: id, name, status
    Y el campo name no está vacío

  # ==================== INVENTARIO ====================

  Escenario: Consultar inventario de mascotas
    Dado que consulto el inventario de mascotas
    Entonces la respuesta contiene conteo por status
    Y el status code es 200
