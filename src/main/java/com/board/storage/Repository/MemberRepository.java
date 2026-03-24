package com.board.storage.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.board.storage.Entity.Member;

// PK 타입이 String (userId = 로그인 아이디)
public interface MemberRepository extends JpaRepository<Member, String> {
}
