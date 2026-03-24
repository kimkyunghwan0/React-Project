package com.board.storage.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "goal")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
}