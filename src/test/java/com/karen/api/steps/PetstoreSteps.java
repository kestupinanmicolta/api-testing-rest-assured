package com.karen.api.steps;

import com.karen.api.tasks.PetstoreApi;
import io.cucumber.java.es.*;
import io.restassured.response.Response;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class PetstoreSteps {

    private final PetstoreApi api = new PetstoreApi();
    private Response response;
    private int createdPetId;

    @Dado("que la API base está configurada en {string}")
    public void configurarApi(String baseUrl) {
        // La URL base ya está configurada en PetstoreApi
    }

    @Cuando(/^creo una mascota con nombre "([^"]*)", status "([^"]*)" y nombre de categoría "([^"]*)"$/)
    public void crearMascota(String name, String status, String categoryName) {
        response = api.crearMascota(name, status, categoryName);
        createdPetId = api.getLastCreatedPetId();
    }

    @Cuando(/^creo una mascota con nombre "([^"]*)" y status "([^"]*)"$/)
    public void crearMascotaSimple(String name, String status) {
        response = api.crearMascota(name, status, "Default");
        createdPetId = api.getLastCreatedPetId();
    }

    @Dado(/^que tengo una mascota creada con nombre "([^"]*)"$/)
    public void tenerMascotaCreada(String name) {
        response = api.crearMascota(name, "available", "Test");
        createdPetId = api.getLastCreatedPetId();
    }

    @Cuando(/^consulto la mascota por su ID$/)
    public void consultarMascotaPorId() {
        response = api.consultarMascota(createdPetId);
    }

    @Cuando(/^actualizo la mascota con nombre "([^"]*)" y status "([^"]*)"$/)
    public void actualizarMascota(String name, String status) {
        response = api.actualizarMascota(createdPetId, name, status);
    }

    @Cuando(/^elimino la mascota por su ID$/)
    public void eliminarMascota() {
        response = api.eliminarMascota(createdPetId);
    }

    @Dado(/^que consulto mascotas por status "([^"]*)"$/)
    public void consultarPorStatus(String status) {
        response = api.consultarPorStatus(status);
    }

    @Dado(/^que consulto la mascota con ID (\d+)$/)
    public void consultarMascotaPorIdEspecifico(int petId) {
        response = api.consultarMascota(petId);
    }

    @Dado(/^que consulto el inventario de mascotas$/)
    public void consultarInventario() {
        response = api.consultarInventario();
    }

    @Entonces(/^la mascota es creada exitosamente con id$/)
    public void validarCreacion() {
        assertThat(response.statusCode(), is(200));
        assertThat(response.jsonPath().getInt("id"), is(greaterThan(0)));
    }

    @Entonces(/^la mascota tiene nombre "([^"]*)"$/)
    public void validarNombre(String expectedName) {
        assertThat(response.jsonPath().getString("name"), is(expectedName));
    }

    @Entonces(/^el status code es (\d+)$/)
    public void validarStatusCode(int expectedStatus) {
        assertThat(response.statusCode(), is(expectedStatus));
    }

    @Entonces(/^la respuesta contiene al menos (\d+) mascota$/)
    public void validarCantidadMinima(int minCount) {
        assertThat(response.jsonPath().getList("$").size(), is(greaterThanOrEqualTo(minCount)));
    }

    @Entonces(/^cada mascota tiene status "([^"]*)"$/)
    public void validarStatusMascotas(String expectedStatus) {
        response.jsonPath().getList("$", Map.class).forEach(pet -> {
            assertThat(pet.get("status"), is(expectedStatus));
        });
    }

    @Entonces(/^la respuesta contiene los campos: (.*)$/)
    public void validarCampos(String fields) {
        String[] fieldList = fields.split(", ");
        for (String field : fieldList) {
            assertThat(response.jsonPath().getMap("$").containsKey(field), is(true));
        }
    }

    @Entonces(/^el campo name no está vacío$/)
    public void validarCampoName() {
        assertThat(response.jsonPath().getString("name"), is(not(emptyOrNullString())));
    }

    @Entonces(/^la respuesta contiene conteo por status$/)
    public void validarInventario() {
        assertThat(response.jsonPath().getMap("$").size(), is(greaterThan(0)));
    }
}
