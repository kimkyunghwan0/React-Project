package com.board.storage.Controller;

import com.board.storage.Entity.Task;
import com.board.storage.Service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // 특정 목표의 할 일 목록 조회 - GET /task/{goalSeq}
    @GetMapping("/{goalSeq}")
    public List<Task> getByGoalSeq(@PathVariable Long goalSeq) {
        return taskService.getByGoalSeq(goalSeq);
    }

    // 할 일 생성 - POST /task
    @PostMapping
    public Task create(@RequestBody Task task) {
        return taskService.create(task);
    }

    // 완료 여부 토글 - PATCH /task/{taskSeq}/toggle
    @PatchMapping("/{taskSeq}/toggle")
    public Task toggleStatus(@PathVariable Long taskSeq) {
        return taskService.toggleStatus(taskSeq);
    }

    // 할 일 수정 - PUT /task/{taskSeq}
    @PutMapping("/{taskSeq}")
    public Task update(@PathVariable Long taskSeq, @RequestBody Task task) {
        return taskService.update(taskSeq, task);
    }

    // 할 일 삭제 - DELETE /task/{taskSeq}
    @DeleteMapping("/{taskSeq}")
    public void delete(@PathVariable Long taskSeq) {
        taskService.delete(taskSeq);
    }
}
