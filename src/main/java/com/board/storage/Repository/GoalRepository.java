package com.board.storage.Repository;

import com.board.storage.Entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    // → SELECT * FROM goal WHERE user_id = ?
    List<Goal> findByMemberUserId(String userId);
}
