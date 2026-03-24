package com.board.storage.Service;

import com.board.storage.Entity.Task;
import com.board.storage.Repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    // 특정 목표의 할 일 목록 조회
    public List<Task> getByGoalSeq(Long goalSeq) {
        return taskRepository.findByGoalGoalSeq(goalSeq);
    }

    // 할 일 생성
    public Task create(Task task) {
        return taskRepository.save(task);
    }

    // 완료 여부 토글 (N → Y, Y → N)
    public Task toggleStatus(Long taskSeq) {
        Task task = taskRepository.findById(taskSeq).orElseThrow();
        task.setStatus(task.getStatus().equals("Y") ? "N" : "Y");
        return taskRepository.save(task);
    }

    // 할 일 수정
    public Task update(Long taskSeq, Task updated) {
        Task task = taskRepository.findById(taskSeq).orElseThrow();
        task.setSchedule(updated.getSchedule());
        task.setDueDate(updated.getDueDate());
        return taskRepository.save(task);
    }

    // 할 일 삭제
    public void delete(Long taskSeq) {
        taskRepository.deleteById(taskSeq);
    }
}
