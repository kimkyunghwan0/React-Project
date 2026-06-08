package com.board.storage.Entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Formula;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "goal")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_GOAL")
    @SequenceGenerator(name = "SEQ_GOAL", sequenceName = "SEQ_GOAL", allocationSize = 1)
    @Column(name = "GOAL_SEQ")
    private Long goalSeq;

    // 여러 목표가 한 명의 멤버에 속함 (다대일 관계)
    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private Member member;

    @Column(name = "TITLE")
    private String title;   // 목표 제목

    @Column(name = "CONTENT")
    private String content; // 목표 내용

    @Column(name = "START_DT")
    private LocalDate startDt; // 시작일자

    @Column(name = "END_DT")
    private LocalDate endDt;   // 종료일자

    @Formula("(SELECT COUNT(T.TASK_SEQ) FROM TASK T WHERE T.GOAL_SEQ = GOAL_SEQ)")
    private Long cnt;

    @Formula("(SELECT COUNT(CASE WHEN T.STATUS = 'Y' THEN 1 END) FROM TASK T WHERE T.GOAL_SEQ = GOAL_SEQ)")
    private Long stsCnt;

    @Formula("(SELECT ROUND(CASE WHEN COUNT(T.TASK_SEQ) = 0 THEN 0 ELSE COUNT(CASE WHEN T.STATUS = 'Y' THEN 1 END) / COUNT(T.TASK_SEQ) * 100 END) FROM TASK T WHERE T.GOAL_SEQ = GOAL_SEQ)")
    private Long progress;
}