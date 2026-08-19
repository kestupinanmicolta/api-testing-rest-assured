package com.karen.api.tasks;

import io.restassured.http.ContentType;
import io.restassured.response.Response;

import java.util.Map;

import static io.restassured.RestAssured.given;

public class PetstoreApi {

    private static final String BASE_URL = "https://petstore.swagger.io/v2";
    private int lastCreatedPetId;

    public Response crearMascota(String name, String status, String categoryName) {
        Map<String, Object> category = Map.of("id", 1, "name", categoryName);
        Map<String, Object> body = Map.of(
                "id", 0,
                "name", name,
                "status", status,
                "category", category
        );

        Response response = given()
                .baseUri(BASE_URL)
                .contentType(ContentType.JSON)
                .body(body)
            .when()
                .post("/pet")
            .then()
                .extract().response();

        lastCreatedPetId = response.jsonPath().getInt("id");
        return response;
    }

    public Response consultarMascota(int petId) {
        return given()
                .baseUri(BASE_URL)
            .when()
                .get("/pet/{petId}", petId)
            .then()
                .extract().response();
    }

    public Response actualizarMascota(int petId, String name, String status) {
        Map<String, Object> body = Map.of(
                "id", petId,
                "name", name,
                "status", status
        );

        return given()
                .baseUri(BASE_URL)
                .contentType(ContentType.JSON)
                .body(body)
            .when()
                .put("/pet")
            .then()
                .extract().response();
    }

    public Response eliminarMascota(int petId) {
        return given()
                .baseUri(BASE_URL)
            .when()
                .delete("/pet/{petId}", petId)
            .then()
                .extract().response();
    }

    public Response consultarPorStatus(String status) {
        return given()
                .baseUri(BASE_URL)
                .queryParam("status", status)
            .when()
                .get("/pet/findByStatus")
            .then()
                .extract().response();
    }

    public Response consultarInventario() {
        return given()
                .baseUri(BASE_URL)
            .when()
                .get("/pet/inventory")
            .then()
                .extract().response();
    }

    public int getLastCreatedPetId() {
        return lastCreatedPetId;
    }
}
