package com.board.storage.Repository;

import com.board.storage.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // → SELECT * FROM task WHERE goal_seq = ?
    List<Task> findByGoalGoalSeq(Long goalSeq);
}
