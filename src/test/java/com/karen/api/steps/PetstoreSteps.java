package com.karen.api.steps;

import com.karen.api.tasks.JsonPlaceholderApi;
import io.cucumber.java.en.*;
import io.restassured.response.Response;

import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class PetstoreSteps {

    private final JsonPlaceholderApi api = new JsonPlaceholderApi();
    private Response response;

    @Given("que la API base está configurada en {string}")
    public void configurarApi(String baseUrl) {
    }

    @When("creo un post con title {string} y body {string} y userId {int}")
    public void crearPost(String title, String body, int userId) {
        response = api.crearPost(title, body, userId);
    }

    @When("consulto el post con ID {int}")
    public void consultarPost(int postId) {
        response = api.consultarPost(postId);
    }

    @Given("que existe un post con ID {int}")
    public void existePost(int postId) {
        response = api.consultarPost(postId);
    }

    @When("actualizo el post con title {string} y body {string}")
    public void actualizarPost(String title, String body) {
        response = api.actualizarPost(1, title, body);
    }

    @When("elimino el post por ID {int}")
    public void eliminarPost(int postId) {
        response = api.eliminarPost(postId);
    }

    @When("consulto todos los posts")
    public void consultarTodosPosts() {
        response = api.consultarTodosPosts();
    }

    @When("consulto posts del usuario {int}")
    public void consultarPostsPorUsuario(int userId) {
        response = api.consultarPostsPorUsuario(userId);
    }

    @When("consulto comentarios del post {int}")
    public void consultarComentarios(int postId) {
        response = api.consultarComentarios(postId);
    }

    @When("consulto el usuario con ID {int}")
    public void consultarUsuario(int userId) {
        response = api.consultarUsuario(userId);
    }

    @Then("el post es creado exitosamente")
    public void validarCreacion() {
        assertThat(response.statusCode(), is(201));
        assertThat(response.jsonPath().getInt("id"), is(greaterThan(0)));
    }

    @Then("el post tiene title no vacío")
    public void validarTitleNoVacio() {
        assertThat(response.jsonPath().getString("title"), is(not(emptyOrNullString())));
    }

    @Then("el post tiene title {string}")
    public void validarTitle(String expectedTitle) {
        assertThat(response.jsonPath().getString("title"), is(expectedTitle));
    }

    @Then("el status code es {int}")
    public void validarStatusCode(int expectedStatus) {
        assertThat(response.statusCode(), is(expectedStatus));
    }

    @Then("la respuesta contiene al menos {int} post")
    public void validarMinimoPosts(int minCount) {
        List<?> posts = response.jsonPath().getList("$");
        assertThat(posts.size(), is(greaterThanOrEqualTo(minCount)));
    }

    @Then("cada post tiene campos válidos")
    public void validarCamposPosts() {
        List<Map<String, Object>> posts = response.jsonPath().getList("$");
        for (Map<String, Object> post : posts) {
            assertThat(post.containsKey("id"), is(true));
            assertThat(post.containsKey("title"), is(true));
            assertThat(post.containsKey("body"), is(true));
            assertThat(post.containsKey("userId"), is(true));
        }
    }

    @Then("cada post tiene userId {int}")
    public void validarUserId(int expectedUserId) {
        List<Map<String, Object>> posts = response.jsonPath().getList("$");
        for (Map<String, Object> post : posts) {
            assertThat(post.get("userId"), is(expectedUserId));
        }
    }

    @Then("el post contiene los campos: {word}, {word}, {word}, {word}")
    public void validarCampos(String f1, String f2, String f3, String f4) {
        Map<String, Object> post = response.jsonPath().getMap("$");
        assertThat(post.containsKey(f1), is(true));
        assertThat(post.containsKey(f2), is(true));
        assertThat(post.containsKey(f3), is(true));
        assertThat(post.containsKey(f4), is(true));
    }

    @Then("el campo title no está vacío")
    public void validarCampoTitle() {
        assertThat(response.jsonPath().getString("title"), is(not(emptyOrNullString())));
    }

    @Then("la respuesta contiene al menos {int} comentario")
    public void validarMinimoComentarios(int minCount) {
        List<?> comments = response.jsonPath().getList("$");
        assertThat(comments.size(), is(greaterThanOrEqualTo(minCount)));
    }

    @Then("el usuario tiene name no vacío")
    public void validarUserName() {
        assertThat(response.jsonPath().getString("name"), is(not(emptyOrNullString())));
    }
}
