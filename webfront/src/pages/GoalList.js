import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./GoalList.module.css"
import AiGoalModal from "./AiGoalModal"

export default function GoalList({ user: member, onLogout }) {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", startDt: "", endDt: "" });
  const [editGoal, setEditGoal] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    const res = await axios.get(`/goal/member/${member.userId}`);
    setGoals(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if(validationCheck(form)){
      await axios.post(`/goal/member/${member.userId}`, form);
      setForm({ title: "", content: "", startDt: "", endDt: "" });
      fetchGoals();
    }
  }

  async function handleDelete(goalSeq) {
    const tasksRes = await axios.get(`/task/${goalSeq}`);
    if (tasksRes.data.length > 0) {
      window.alert("할 일이 존재하는 목표는 삭제할 수 없습니다.\n먼저 할 일을 모두 삭제해주세요.");
      return;
    }
    if (window.confirm("삭제하시겠습니까?")) {
      await axios.delete(`/goal/${goalSeq}`);
      window.alert("삭제되었습니다.");
      fetchGoals();
    }
  }

  async function handleUpdate() {
    if (window.confirm("수정하시겠습니까?")) {
      if(validationCheck(editGoal)){
        await axios.put(`/goal/${editGoal.goalSeq}`, editGoal);
        window.alert("수정되었습니다.");
        setEditGoal(null);
        fetchGoals();
      }
    }
  }

  function validationCheck(target) {
    if ((target.title || "").length > 50) {
      setError("제목은 50자 이내로 작성해주세요.");
      return false;
    }
    if ((target.content || "").length > 1000) {
      setError("내용은 1000자 이내로 작성해주세요.");
      return false;
    }
    if (target.endDt < target.startDt) {
      setError("종료일은 시작일보다 이전일 수 없습니다.");
      return false;
    }
    setError("");
    return true;
  }

  function getProgressClass(progress) {
    if (progress > 0){
      return styles.success;
    }else{
      return styles.fail;
    }    
  }
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>{member.userName}님의 목표 관리</h2>
          <div className={styles.headerBtns}>
            <button className={styles.aiBtn} onClick={() => setShowAiModal(true)}>✨ AI 목표 만들기</button>
            <button className={styles.logoutBtn} onClick={onLogout}>로그아웃</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="목표 제목"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="목표 내용"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            required
          />
          <div className={styles.dateRow}>
            <input
              type="date"
              value={form.startDt}
              onChange={e => setForm({ ...form, startDt: e.target.value })}
              required
            />
            <input
              type="date"
              value={form.endDt}
              onChange={e => setForm({ ...form, endDt: e.target.value })}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">목표 추가</button>
        </form>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "30px" }}>No</th>
              <th>제목</th>
              <th>내용</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>진행률</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal, index) => (
              <React.Fragment key={goal.goalSeq}>
                <tr
                  className={styles[index % 2 === 0 ? "even" : "odd"]}
                  onClick={editGoal?.goalSeq === goal.goalSeq ? undefined : () => navigate(`/goals/${goal.goalSeq}`, { state: { goal } })}
                >
                  <td>{index + 1}</td>
                  {editGoal?.goalSeq === goal.goalSeq ? (
                    <>
                      <td><input value={editGoal.title} onChange={e => setEditGoal({ ...editGoal, title: e.target.value })} /></td>
                      <td><input value={editGoal.content || ""} onChange={e => setEditGoal({ ...editGoal, content: e.target.value })} /></td>
                      <td><input type="date" style={{textAlign : "center"}} value={editGoal.startDt} onChange={e => setEditGoal({ ...editGoal, startDt: e.target.value })} /></td>
                      <td><input type="date" style={{textAlign : "center"}} value={editGoal.endDt} onChange={e => setEditGoal({ ...editGoal, endDt: e.target.value })} /></td>
                      {goal.cnt === 0 ? <td></td> : (
                      <td>
                          <div className={styles.progressArea}>
                            <div className={styles.progressBarContainer}>
                              <div className={`${styles.progressSegment} ${getProgressClass(goal.progress)}`} style={{width: `${goal.progress}%`}}>
                                  <span className={styles.progressSegmentText}>{goal.progress}%</span>
                              </div>
                              <div className={`${styles.progressSegment} ${styles.fail}`} style={{width: `${100 - goal.progress}%`}}>
                                  <span className={styles.progressSegmentText}>{100 - goal.progress}%</span>
                              </div>
                            </div>
                        </div>
                      </td>
                      )}
                      <td>
                        <div className={styles.btnGroup}>
                          <button className={styles.updateBtn} onClick={e => { e.stopPropagation(); handleUpdate(); }}>저장</button>
                          <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); setEditGoal(null); setError(""); }}>취소</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={styles.ellipsis} title={goal.title}>{goal.title}</td>
                      <td className={styles.ellipsis} title={goal.content}>{goal.content}</td>
                      <td style={{textAlign : "center"}}>{goal.startDt}</td>
                      <td style={{textAlign : "center"}}>{goal.endDt}</td>
                      {goal.cnt === 0 ? <td></td> : (
                      <td>
                          <div className={styles.progressArea}>
                            <div className={styles.progressBarContainer}>
                              <div className={`${styles.progressSegment} ${getProgressClass(goal.progress)}`} style={{width: `${goal.progress}%`}}>
                                  <span className={styles.progressSegmentText}>{goal.progress}%</span>
                              </div>
                              <div className={`${styles.progressSegment} ${styles.fail}`} style={{width: `${100 - goal.progress}%`}}>
                                  <span className={styles.progressSegmentText}>{100 - goal.progress}%</span>
                              </div>
                            </div>
                        </div>
                      </td>
                      )}
                      <td>
                        <div className={styles.btnGroup}>
                          <button className={styles.updateBtn} onClick={e => { e.stopPropagation(); setEditGoal(goal); }}>수정</button>
                          <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); handleDelete(goal.goalSeq); }}>삭제</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
                {editGoal?.goalSeq === goal.goalSeq && error && (
                  <tr className={styles.errorRow}>
                    <td colSpan={6}>{error}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {showAiModal && (
        <AiGoalModal
          userId={member.userId}
          onClose={() => setShowAiModal(false)}
          onSaved={fetchGoals}
        />
      )}
    </div>
  );
}
