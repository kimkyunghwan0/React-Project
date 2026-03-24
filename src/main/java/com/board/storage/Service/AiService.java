package com.board.storage.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestClient restClient = RestClient.create();

    // OpenAI API 호출 공통 메서드
    private String callOpenAi(String prompt) {
        Map<String, Object> body = Map.of(
            "model", "gpt-4o-mini",
            "messages", List.of(
                Map.of("role", "user", "content", prompt)
            ),
            "response_format", Map.of("type", "json_object")
        );

        String response = restClient.post()
            .uri("https://api.openai.com/v1/chat/completions")
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .body(body)
            .retrieve()
            .body(String.class);

        try {
            JsonNode root = objectMapper.readTree(response);
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("OpenAI 응답 파싱 실패", e);
        }
    }

    // 목표 제안 (5가지)
    public List<Map<String, String>> suggestGoals(String description, String startDt, String endDt) {
        String prompt = String.format("""
            사용자가 "%s"을(를) 하고 싶어합니다. 기간은 %s ~ %s 입니다.
            이를 구체적인 목표로 5가지 제안해주세요.
            반드시 아래 JSON 형식으로만 응답하세요:
            {"goals": [{"title": "목표 제목", "content": "목표 내용 설명"}]}
            """, description, startDt, endDt);

        try {
            String content = callOpenAi(prompt);
            JsonNode goals = objectMapper.readTree(content).path("goals");
            List<Map<String, String>> result = new ArrayList<>();
            for (JsonNode g : goals) {
                result.add(Map.of(
                    "title", g.path("title").asText(),
                    "content", g.path("content").asText()
                ));
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException("목표 제안 파싱 실패", e);
        }
    }

    // 할일 제안 (7가지)
    public List<Map<String, String>> suggestTasks(String goalTitle, String goalContent, String startDt, String endDt, int taskCount) {
        String prompt = String.format("""
            다음 목표에 맞는 구체적인 할일을 %d가지 제안해주세요.
            목표: "%s"
            내용: "%s"
            기간: %s ~ %s
            반드시 아래 JSON 형식으로만 응답하세요:
            {"tasks": [{"schedule": "할일 내용", "dueDate": "YYYY-MM-DD"}]}
            dueDate는 위 기간 내에서 순차적으로 균등하게 분산하여 설정해주세요.
            """, taskCount, goalTitle, goalContent, startDt, endDt);

        try {
            String content = callOpenAi(prompt);
            JsonNode tasks = objectMapper.readTree(content).path("tasks");
            List<Map<String, String>> result = new ArrayList<>();
            for (JsonNode t : tasks) {
                result.add(Map.of(
                    "schedule", t.path("schedule").asText(),
                    "dueDate", t.path("dueDate").asText()
                ));
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException("할일 제안 파싱 실패", e);
        }
    }
}
