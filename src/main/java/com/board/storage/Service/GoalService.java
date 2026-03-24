package com.board.storage.Service;

import com.board.storage.Entity.Goal;
import com.board.storage.Entity.Member;
import com.board.storage.Repository.GoalRepository;
import com.board.storage.Repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final MemberRepository memberRepository;

    // 특정 멤버의 목표 목록 조회
    public List<Goal> getByUserId(String userId) {
        return goalRepository.findByMemberUserId(userId);
    }

    // 목표 생성
    public Goal create(Goal goal, String userId) {
        Member member = memberRepository.findById(userId).orElseThrow();
        goal.setMember(member);
        return goalRepository.save(goal);
    }

    // 목표 수정
    public Goal update(Long goalSeq, Goal updated) {
        Goal goal = goalRepository.findById(goalSeq).orElseThrow();
        goal.setTitle(updated.getTitle());
        goal.setContent(updated.getContent());
        goal.setStartDt(updated.getStartDt());
        goal.setEndDt(updated.getEndDt());
        return goalRepository.save(goal);
    }

    // 목표 삭제
    public void delete(Long goalSeq) {
        goalRepository.deleteById(goalSeq);
    }
}
