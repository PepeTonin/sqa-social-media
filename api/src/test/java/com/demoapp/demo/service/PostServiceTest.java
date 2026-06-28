package com.demoapp.demo.service;

import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PostServiceTest {

    @Mock
    private UserPostReactionRepository reactionRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    @Autowired
    private PostService postService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should get posts with liked status for a user")
    void getPostsSuccess() throws Exception {

        String json = """
                    {
                    "posts": [
                        {
                        "id": 1,
                        "title": "Post 1",
                        "body": "Texto"
                        }
                    ],
                    "total": 251,
                    "skip": 0,
                    "limit": 1
                    }
                    """;
                    
        when(restTemplate.getForObject("https://dummyjson.com/posts?limit=1&skip=0", String.class)).thenReturn(json);
        when(objectMapper.readTree(json)).thenReturn(new ObjectMapper().readTree(json));

        UserPostReaction reaction = new UserPostReaction();
        reaction.setPostId(1L);
        reaction.setUserId(1L);
        when(reactionRepository.findByUserId(1L)).thenReturn(List.of(reaction));

        Map<String, Object> result = postService.getPosts(1, 0, 1L);
        List<Map<String, Object>> posts = (List<Map<String, Object>>) result.get("posts");

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).get("id")).isEqualTo(1L);
        assertThat(posts.get(0).get("liked")).isEqualTo(true);
    }

    @Test
    @DisplayName("Should get posts with not liked status for a user")
    void getPostsFailure() throws Exception {

        String json = """
                    {
                    "posts": [
                        {
                        "id": 1,
                        "title": "Post 1",
                        "body": "Texto"
                        }
                    ],
                    "total": 251,
                    "skip": 0,
                    "limit": 1
                    }
                    """;
                    
        when(restTemplate.getForObject("https://dummyjson.com/posts?limit=1&skip=0", String.class)).thenReturn(json);
        when(objectMapper.readTree(json)).thenReturn(new ObjectMapper().readTree(json));

        UserPostReaction reaction = new UserPostReaction();
        reaction.setPostId(1L);
        reaction.setUserId(1L);
        when(reactionRepository.findByUserId(1L)).thenReturn(List.of(reaction));

        Map<String, Object> result = postService.getPosts(1, 0, 2L);
        List<Map<String, Object>> posts = (List<Map<String, Object>>) result.get("posts");

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).get("id")).isEqualTo(1L);
        assertThat(posts.get(0).get("liked")).isEqualTo(false);
    }
}
