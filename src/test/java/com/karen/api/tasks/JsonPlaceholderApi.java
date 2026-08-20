package com.karen.api.tasks;

import io.restassured.http.ContentType;
import io.restassured.response.Response;

import static io.restassured.RestAssured.given;

public class JsonPlaceholderApi {

    private static final String BASE_URL = "https://jsonplaceholder.typicode.com";

    public Response crearPost(String title, String body, int userId) {
        String jsonBody = String.format(
            "{\"title\":\"%s\",\"body\":\"%s\",\"userId\":%d}",
            title, body, userId
        );
        return given()
                .baseUri(BASE_URL)
                .contentType(ContentType.JSON)
                .body(jsonBody)
            .when()
                .post("/posts")
            .then()
                .extract().response();
    }

    public Response consultarPost(int postId) {
        return given()
                .baseUri(BASE_URL)
            .when()
                .get("/posts/{id}", postId)
            .then()
                .extract().response();
    }

    public Response actualizarPost(int postId, String title, String body) {
        String jsonBody = String.format(
            "{\"title\":\"%s\",\"body\":\"%s\"}",
            title, body
        );
        return given()
                .baseUri(BASE_URL)
                .contentType(ContentType.JSON)
                .body(jsonBody)
            .when()
                .put("/posts/{id}", postId)
            .then()
                .extract().response();
    }

    public Response eliminarPost(int postId) {
        return given()
                .baseUri(BASE_URL)
            .when()
                .delete("/posts/{id}", postId)
            .then()
                .extract().response();
    }

    public Response consultarTodosPosts() {
        return given()
                .baseUri(BASE_URL)
            .when()
                .get("/posts")
            .then()
                .extract().response();
    }

    public Response consultarPostsPorUsuario(int userId) {
        return given()
                .baseUri(BASE_URL)
            .when()
                .get("/posts?userId={userId}", userId)
            .then()
                .extract().response();
    }

    public Response consultarComentarios(int postId) {
        return given()
                .baseUri(BASE_URL)
            .when()
                .get("/posts/{id}/comments", postId)
            .then()
                .extract().response();
    }

    public Response consultarUsuario(int userId) {
        return given()
                .baseUri(BASE_URL)
            .when()
                .get("/users/{id}", userId)
            .then()
                .extract().response();
    }
}
