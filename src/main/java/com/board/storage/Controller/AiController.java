package com.board.storage.Controller;

import com.board.storage.Service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    // 목표 제안 - POST /ai/suggest-goals
    @PostMapping("/suggest-goals")
    public List<Map<String, String>> suggestGoals(@RequestBody Map<String, String> body) {
        return aiService.suggestGoals(
            body.get("description"),
            body.get("startDt"),
            body.get("endDt")
        );
    }

    // 할일 제안 - POST /ai/suggest-tasks
    @PostMapping("/suggest-tasks")
    public List<Map<String, String>> suggestTasks(@RequestBody Map<String, String> body) {
        int taskCount = Integer.parseInt(body.getOrDefault("taskCount", "7"));
        return aiService.suggestTasks(
            body.get("goalTitle"),
            body.get("goalContent"),
            body.get("startDt"),
            body.get("endDt"),
            taskCount
        );
    }
}
