package com.board.storage.Controller;

import com.board.storage.Entity.Goal;
import com.board.storage.Service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/goal")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    // 특정 멤버의 목표 목록 조회 - GET /goal/member/{userId}
    @GetMapping("/member/{userId}")
    public List<Goal> getByMember(@PathVariable String userId) {
        return goalService.getByUserId(userId);
    }

    // 목표 생성 - POST /goal/member/{userId}
    @PostMapping("/member/{userId}")
    public Goal create(@PathVariable String userId, @RequestBody Goal goal) {
        return goalService.create(goal, userId);
    }

    // 목표 수정 - PUT /goal/{goalSeq}
    @PutMapping("/{goalSeq}")
    public Goal update(@PathVariable Long goalSeq, @RequestBody Goal goal) {
        return goalService.update(goalSeq, goal);
    }

    // 목표 삭제 - DELETE /goal/{goalSeq}
    @DeleteMapping("/{goalSeq}")
    public void delete(@PathVariable Long goalSeq) {
        goalService.delete(goalSeq);
    }
}
