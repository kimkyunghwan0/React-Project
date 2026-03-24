package com.board.storage.Controller;

import com.board.storage.Entity.Member;
import com.board.storage.Repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class MemberController {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 회원가입 - POST /auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member member) {
        if (memberRepository.existsById(member.getUserId())) {
            return ResponseEntity.badRequest().body("이미 존재하는 아이디입니다.");
        }
        // 비밀번호 암호화 후 저장
        member.setUserPw(passwordEncoder.encode(member.getUserPw()));
        return ResponseEntity.ok(memberRepository.save(member));
    }

    // 로그인 - POST /auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String userPw = body.get("userPw");

        Optional<Member> member = memberRepository.findById(userId);

        // 아이디 없거나 비밀번호 불일치 시 401
        if (member.isEmpty() || !passwordEncoder.matches(userPw, member.get().getUserPw())) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 틀렸습니다.");
        }

        // 비밀번호 제외하고 응답
        member.get().setUserPw(null);
        return ResponseEntity.ok(member.get());
    }
}
