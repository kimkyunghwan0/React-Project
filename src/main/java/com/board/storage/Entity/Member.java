package com.board.storage.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "member")
public class Member {

    @Id
    @Column(name = "USER_ID")
    private String userId; // 로그인 아이디 (PK, 직접 입력)

    @Column(name = "USER_PW")
    private String userPw; // 비밀번호

    @Column(name = "USER_NAME")
    private String userName; // 이름
}
