# API Testing con Rest Assured

Suite completa de testing API con Rest Assured y Cucumber contra Petstore API. Incluye CRUD completo, validación de schema, y tests negativos.

## Características

- **Rest Assured**: API testing con Java
- **Cucumber BDD**: Gherkin en español
- **Petstore API**: API REST real para testing
- **CRUD Completo**: Create, Read, Update, Delete
- **Allure Reports**: Reportes visuales detallados
- **Models**: POJOs para data transfer

## Requisitos

- JDK 21
- Maven

## Ejecución

```bash
# Ejecutar todos los tests
mvn clean test

# Generar reporte Allure
mvn allure:serve
```

## Estructura

```
src/test/java/com/karen/api/
├── RunCucumberTests.java
├── tasks/
│   └── PetstoreApi.java
├── steps/
│   └── PetstoreSteps.java
└── models/
    ├── Pet.java
    └── Category.java

src/test/resources/features/
└── petstore.feature
```

## Endpoints probados

| Endpoint | Métodos | Descripción |
|----------|---------|-------------|
| `/pet` | POST, PUT | Crear/actualizar mascota |
| `/pet/{id}` | GET, DELETE | Consultar/eliminar mascota |
| `/pet/findByStatus` | GET | Buscar por status |
| `/pet/inventory` | GET | Inventario |
