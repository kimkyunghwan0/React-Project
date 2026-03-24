import { useState } from "react"
import axios from "axios"
import styles from "./Login.module.css"

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ userId: "", userPw: "", userPwConfirm: "", userName: "" });
  const [error, setError] = useState("");

  function switchMode(next) {
    setMode(next);
    setForm({ userId: "", userPw: "", userPwConfirm: "", userName: "" });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "register" && form.userPw !== form.userPwConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      if (mode === "login") {
        const res = await axios.post("/auth/login", {
          userId: form.userId,
          userPw: form.userPw,
        });
        onLogin(res.data);
      } else {
        await axios.post("/auth/register", {
          userId: form.userId,
          userName: form.userName,
          userPw: form.userPw,
        });
        switchMode("login");
      }
    } catch (err) {
      setError(err.response?.data || "오류가 발생했습니다.");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2>목표 관리 앱</h2>

        <div className={styles.tabs}>
          <button className={mode === "login" ? styles.tabActive : styles.tab} onClick={() => switchMode("login")}>로그인</button>
          <button className={mode === "register" ? styles.tabActive : styles.tab} onClick={() => switchMode("register")}>회원가입</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === "register" && (
            <input
              placeholder="이름"
              value={form.userName}
              onChange={e => setForm({ ...form, userName: e.target.value })}
              required
            />
          )}
          <input
            placeholder="아이디"
            value={form.userId}
            onChange={e => setForm({ ...form, userId: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={form.userPw}
            onChange={e => setForm({ ...form, userPw: e.target.value })}
            required
          />
          {mode === "register" && (
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={form.userPwConfirm}
              onChange={e => setForm({ ...form, userPwConfirm: e.target.value })}
              required
            />
          )}
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
