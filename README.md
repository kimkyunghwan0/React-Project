# AI 목표 플래너

AI를 활용하여 목표를 설정하고 세부 할일을 자동으로 계획해주는 풀스택 웹 애플리케이션입니다.

---

## 주요 기능

### 목표 관리

- 목표 제목, 내용, 시작일/종료일 등록 및 CRUD
- 할일이 존재하는 목표는 삭제 불가 (데이터 무결성 보호)

### 할일 관리

- 목표별 할일 등록 및 CRUD
- 마감일 기반 정렬 및 완료 상태 토글 (Y/N)
- 마감일이 지난 미완료 할일 강조 표시

### AI 목표 만들기 (3단계 위저드)

OpenAI GPT-4o-mini를 활용한 자동 계획 생성:

1. **설명 입력** — 하고 싶은 것과 기간을 자유롭게 입력
2. **목표 선택** — AI가 제안하는 5가지 목표 중 하나 선택
3. **할일 선택** — AI가 제안하는 3~7개의 할일 중 원하는 것만 선택하여 저장

### 회원 인증

- 회원가입 / 로그인 (BCrypt 비밀번호 암호화)

---

## 기술 스택

| 구분     | 기술                                                       |
| -------- | ---------------------------------------------------------- |
| Frontend | React 19, React Router v6, Axios, CSS Modules              |
| Backend  | Spring Boot 3.5, Java 17, Spring Data JPA, Spring Security |
| Database | Oracle XE (로컬), PostgreSQL (운영)                        |
| AI       | OpenAI API (GPT-4o-mini)                                   |
| 빌드     | Gradle, Create React App                                   |
| 배포     | GitHub Pages (프론트엔드)                                  |

---

## 프로젝트 구조

React-Project/
├── src/main/java/com/board/storage/ # Spring Boot 백엔드
│ ├── Controller/ # REST API 엔드포인트
│ ├── Service/ # 비즈니스 로직
│ ├── Entity/ # JPA 엔티티 (Member, Goal, Task)
│ ├── Repository/ # Spring Data JPA
│ └── Config/ # CORS, Security 설정
├── src/main/resources/
│ ├── application.yaml # 공통 설정 (OpenAI 키)
│ ├── application-local.yaml # 로컬 (Oracle)
│ └── application-prod.yaml # 운영 (PostgreSQL)
└── webfront/ # React 프론트엔드
└── src/pages/
├── Login.js # 로그인 / 회원가입
├── GoalList.js # 목표 목록 및 관리
├── TaskList.js # 할일 목록 및 관리
└── AiGoalModal.js # AI 목표 만들기 모달

---

## 데이터 모델

Member ─── (1:N) ──▶ Goal ─── (1:N) ──▶ Task
userId(PK) goalSeq(PK) taskSeq(PK)
userName title schedule
userPw content dueDate
startDt status (N/Y)
endDt

---

## API 엔드포인트

| Method | URL                      | 설명                  |
| ------ | ------------------------ | --------------------- |
| POST   | `/auth/register`         | 회원가입              |
| POST   | `/auth/login`            | 로그인                |
| GET    | `/goal/member/{userId}`  | 사용자 목표 목록 조회 |
| POST   | `/goal/member/{userId}`  | 목표 등록             |
| PUT    | `/goal/{goalSeq}`        | 목표 수정             |
| DELETE | `/goal/{goalSeq}`        | 목표 삭제             |
| GET    | `/task/{goalSeq}`        | 목표별 할일 목록 조회 |
| POST   | `/task`                  | 할일 등록             |
| PUT    | `/task/{taskSeq}`        | 할일 수정             |
| PATCH  | `/task/{taskSeq}/toggle` | 완료 상태 토글        |
| DELETE | `/task/{taskSeq}`        | 할일 삭제             |
| POST   | `/ai/suggest-goals`      | AI 목표 제안          |
| POST   | `/ai/suggest-tasks`      | AI 할일 제안          |

---

## 로컬 실행 방법

### 사전 준비

- Java 17+
- Node.js 18+
- Oracle XE (포트 1522, SID: xepdb1, 계정: plan/1234)
- OpenAI API 키

### 백엔드 실행

bash

# 환경변수 설정

set OPENAI_API_KEY=sk-...

# 빌드 및 실행 (로컬 프로파일 기본값)

./gradlew bootRun

### 프론트엔드 실행

bash
cd webfront
npm install
npm start # http://localhost:3000 (백엔드 8080으로 프록시)

### 운영 환경 배포

bash

# 백엔드: prod 프로파일 활성화 (환경변수로 DB 연결 정보 주입)

# DB_URL, DB_USERNAME, DB_PASSWORD, OPENAI_API_KEY 설정 필요

# 프론트엔드: GitHub Pages 배포

cd webfront
npm run deploy
