package com.demoapp.demo.usecases;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;
import com.demoapp.demo.service.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PostService — testes unitários")
public class PostsTest {

    @Mock
    UserPostReactionRepository reactionRepository;

    @Mock
    RestTemplate restTemplate;

    PostService postService;

    @BeforeEach
    void setup() throws Exception {
        postService = new PostService(reactionRepository);

        Field rtField = PostService.class.getDeclaredField("restTemplate");
        rtField.setAccessible(true);
        rtField.set(postService, restTemplate);
    }

    @Nested
    @DisplayName("Listagem de posts")
    class ListagemDePosts {

        @Test
        @DisplayName("Listagem de posts deve respeitar parâmetros limit e skip e retornar estrutura paginada")
        void listagemDePostsDeveSerPaginada() {
            int limit = 2;
            int skip = 0;

            String jsonDaApi = """
                    {
                      "posts": [
                        {"id": 1, "title": "Post Um", "body": "Corpo do post um"},
                        {"id": 2, "title": "Post Dois", "body": "Corpo do post dois"}
                      ],
                      "total": 150,
                      "skip": 0,
                      "limit": 2
                    }
                    """;

            when(restTemplate.getForObject(anyString(), eq(String.class))).thenReturn(jsonDaApi);

            Map<String, Object> resultado = postService.getPosts(limit, skip, null);

            assertThat(resultado).containsKeys("posts", "total", "skip", "limit");
            assertThat(resultado.get("total")).isEqualTo(150);
            assertThat(resultado.get("skip")).isEqualTo(0);
            assertThat(resultado.get("limit")).isEqualTo(2);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> posts = (List<Map<String, Object>>) resultado.get("posts");
            assertThat(posts).hasSize(2);
            assertThat(posts.get(0).get("id")).isEqualTo(1L);
            assertThat(posts.get(0)).containsKey("liked");
            assertThat(posts.get(0).get("liked")).isEqualTo(false); // userId null → nenhuma curtida

            verify(restTemplate, times(1))
                    .getForObject(
                            argThat((String url) -> url.contains("limit=2") && url.contains("skip=0")),
                            eq(String.class));
        }
    }

    @Nested
    @DisplayName("Curtidas")
    class Curtidas {

        @Test
        @DisplayName("Curtir post deve persistir a reação e retornar liked=true — BUG: sem validação de autenticação do userId")
        void curtirPostsApenasComUsuarioCriado() {
            Long postId = 42L;
            Long userId = 999L;

            UserPostReaction reactionSalva = new UserPostReaction();
            reactionSalva.setId(1L);
            reactionSalva.setUserId(userId);
            reactionSalva.setPostId(postId);

            when(reactionRepository.findByUserIdAndPostId(userId, postId))
                    .thenReturn(Optional.empty());
            when(reactionRepository.save(any(UserPostReaction.class)))
                    .thenReturn(reactionSalva);

            Map<String, Object> resultado = postService.toggleLike(postId, userId);

            assertThat(resultado.get("postId")).isEqualTo(postId);
            assertThat(resultado.get("liked")).isEqualTo(true);

            ArgumentCaptor<UserPostReaction> captor = ArgumentCaptor.forClass(UserPostReaction.class);
            verify(reactionRepository, times(1)).save(captor.capture());
            assertThat(captor.getValue().getUserId()).isEqualTo(userId);
            assertThat(captor.getValue().getPostId()).isEqualTo(postId);
        }

        @Test
        @DisplayName("Curtida existente deve ser removida ao curtir novamente (comportamento toggle)")
        void descurtirPostJaCurtidoDeveLikedFalso() {
            Long postId = 42L;
            Long userId = 1L;

            UserPostReaction reactionExistente = new UserPostReaction();
            reactionExistente.setId(10L);
            reactionExistente.setUserId(userId);
            reactionExistente.setPostId(postId);

            when(reactionRepository.findByUserIdAndPostId(userId, postId))
                    .thenReturn(Optional.of(reactionExistente));

            Map<String, Object> resultado = postService.toggleLike(postId, userId);

            assertThat(resultado.get("liked")).isEqualTo(false);
            verify(reactionRepository, times(1)).delete(reactionExistente);
            verify(reactionRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Posts curtidos por usuário")
    class PostsCurtidos {

        @Test
        @DisplayName("Usuário deve ver apenas seus próprios posts curtidos, sem vazamento de curtidas alheias")
        void usuarioDeveVerApenasSeusPostsCurtidos() {
            Long userId = 1L;

            UserPostReaction reaction1 = new UserPostReaction();
            reaction1.setUserId(userId);
            reaction1.setPostId(10L);

            UserPostReaction reaction2 = new UserPostReaction();
            reaction2.setUserId(userId);
            reaction2.setPostId(20L);

            when(reactionRepository.findByUserId(userId))
                    .thenReturn(List.of(reaction1, reaction2));

            when(restTemplate.getForObject(eq("https://dummyjson.com/posts/10"), eq(String.class)))
                    .thenReturn("{\"id\": 10, \"title\": \"Post Curtido 1\", \"body\": \"Body 1\"}");
            when(restTemplate.getForObject(eq("https://dummyjson.com/posts/20"), eq(String.class)))
                    .thenReturn("{\"id\": 20, \"title\": \"Post Curtido 2\", \"body\": \"Body 2\"}");

            Map<String, Object> resultado = postService.getLikedPosts(userId, 10, 0);

            assertThat(resultado.get("total")).isEqualTo(2);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> posts = (List<Map<String, Object>>) resultado.get("posts");
            assertThat(posts).hasSize(2);

            List<Long> idsRetornados = posts.stream()
                    .map(p -> (Long) p.get("id"))
                    .toList();
            assertThat(idsRetornados).containsExactlyInAnyOrder(10L, 20L);

            assertThat(posts).allMatch(p -> Boolean.TRUE.equals(p.get("liked")));

            verify(reactionRepository, times(1)).findByUserId(userId);
            verify(reactionRepository, never()).findByUserId(argThat(id -> !id.equals(userId)));
        }
    }
}