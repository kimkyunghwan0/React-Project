package com.board.storage.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.board.storage.Entity.Member;
import com.board.storage.Repository.MemberRepository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public List<Member> getMemberApi() {
        /*
            findAll()       SELECT * FROM member
            findById(1)     SELECT * FROM member WHERE id=1
            save(member)    INSERT 또는 UPDATE
            deleteById(1)   DELETE FROM member WHERE id=1
        */
        return memberRepository.findAll();
    }
}
