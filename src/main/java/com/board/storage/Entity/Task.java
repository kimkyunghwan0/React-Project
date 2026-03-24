package com.board.storage.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TASK_SEQ")
    private Long taskSeq;

    // 여러 할 일이 하나의 목표에 속함 (다대일 관계)
    @ManyToOne
    @JoinColumn(name = "GOAL_SEQ")
    private Goal goal;

    @Column(name = "SCHEDULE")
    private String schedule; // 계획 내용

    @Column(name = "STATUS")
    private String status = "N"; // 완료 여부 (N: 미완료, Y: 완료)

    @Column(name = "DUE_DATE")
    private LocalDate dueDate; // 마감일
}