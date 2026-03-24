import { useState } from "react"
import axios from "axios"
import styles from "./AiGoalModal.module.css"

// step 1: 설명 입력 + 기간 선택
// step 2: 목표 선택
// step 3: 할일 선택
export default function AiGoalModal({ userId, onClose, onSaved }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // step 1
  const [description, setDescription] = useState("");
  const [startDt, setStartDt] = useState("");
  const [endDt, setEndDt] = useState("");

  // step 2
  const [goalOptions, setGoalOptions] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // step 3
  const [taskOptions, setTaskOptions] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);

  async function handleSuggestGoals() {
    if (!description.trim()) { setError("원하는 것을 입력해주세요."); return; }
    if (!startDt || !endDt)  { setError("기간을 선택해주세요."); return; }
    if (endDt < startDt)     { setError("종료일은 시작일보다 이전일 수 없습니다."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/ai/suggest-goals", { description, startDt, endDt });
      setGoalOptions(res.data);
      setSelectedGoal(null);
      setStep(2);
    } catch {
      setError("AI 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggestTasks() {
    if (!selectedGoal) { setError("목표를 선택해주세요."); return; }
    setError("");
    setLoading(true);
    const daysDiff = Math.round((new Date(endDt) - new Date(startDt)) / (1000 * 60 * 60 * 24));
    const taskCount = Math.min(7, Math.max(3, daysDiff));
    try {
      const res = await axios.post("/ai/suggest-tasks", {
        goalTitle: selectedGoal.title,
        goalContent: selectedGoal.content,
        startDt,
        endDt,
        taskCount: String(taskCount),
      });
      setTaskOptions(res.data);
      setCheckedTasks(res.data.map((_, i) => i)); // 전체 선택 기본값
      setStep(3);
    } catch {
      setError("AI 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (checkedTasks.length === 0) { setError("할일을 하나 이상 선택해주세요."); return; }
    setError("");
    setLoading(true);
    try {
      // 목표 저장
      const goalRes = await axios.post(`/goal/member/${userId}`, {
        title: selectedGoal.title,
        content: selectedGoal.content,
        startDt,
        endDt,
      });
      const goalSeq = goalRes.data.goalSeq;

      // 선택한 할일 저장
      await Promise.all(
        checkedTasks.map(i =>
          axios.post("/task", {
            goal: { goalSeq },
            schedule: taskOptions[i].schedule,
            dueDate: taskOptions[i].dueDate || null,
          })
        )
      );

      onSaved();
      onClose();
    } catch {
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  function toggleTask(i) {
    setCheckedTasks(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* 헤더 */}
        <div className={styles.modalHeader}>
          <h3>AI 목표 만들기</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* 단계 표시 */}
        <div className={styles.steps}>
          {["설명 입력", "목표 선택", "할일 선택"].map((label, i) => (
            <div key={i} className={`${styles.stepItem} ${step === i + 1 ? styles.stepActive : step > i + 1 ? styles.stepDone : ""}`}>
              <span className={styles.stepNum}>{i + 1}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className={styles.body}>
            <label>원하는 것을 자유롭게 입력해주세요</label>
            <textarea
              className={styles.textarea}
              placeholder="예: 영어 공부를 꾸준히 하고 싶어요, 다이어트를 하고 싶어요..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
            <div className={styles.dateRow}>
              <div className={styles.dateField}>
                <label>시작일</label>
                <input type="date" value={startDt} onChange={e => setStartDt(e.target.value)} />
              </div>
              <div className={styles.dateField}>
                <label>종료일</label>
                <input type="date" value={endDt} onChange={e => setEndDt(e.target.value)} />
              </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.primaryBtn} onClick={handleSuggestGoals} disabled={loading}>
              {loading ? "AI가 생각 중..." : "목표 제안 받기"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className={styles.body}>
            <label>목표를 선택해주세요</label>
            <div className={styles.optionList}>
              {goalOptions.map((g, i) => (
                <div
                  key={i}
                  className={`${styles.optionCard} ${selectedGoal === g ? styles.optionSelected : ""}`}
                  onClick={() => setSelectedGoal(g)}
                >
                  <strong>{g.title}</strong>
                  <p>{g.content}</p>
                </div>
              ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => { setStep(1); setError(""); }}>뒤로</button>
              <button className={styles.primaryBtn} onClick={handleSuggestTasks} disabled={loading}>
                {loading ? "AI가 생각 중..." : "할일 제안 받기"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className={styles.body}>
            <label>추가할 할일을 선택해주세요 ({checkedTasks.length}/{taskOptions.length}) <span className={styles.hint}>기간에 따라 최소 3개 ~ 최대 7개가 제안됩니다</span></label>
            <div className={styles.taskList}>
              {taskOptions.map((t, i) => (
                <label key={i} className={styles.taskItem}>
                  <input
                    type="checkbox"
                    checked={checkedTasks.includes(i)}
                    onChange={() => toggleTask(i)}
                  />
                  <span className={styles.taskSchedule}>{t.schedule}</span>
                  <input
                    type="date"
                    className={styles.taskDueInput}
                    value={t.dueDate || ""}
                    min={startDt}
                    max={endDt}
                    onChange={e => {
                      const updated = [...taskOptions];
                      updated[i] = { ...updated[i], dueDate: e.target.value };
                      setTaskOptions(updated);
                    }}
                  />
                </label>
              ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => { setStep(2); setError(""); }}>뒤로</button>
              <button className={styles.primaryBtn} onClick={handleSave} disabled={loading}>
                {loading ? "저장 중..." : "목표 추가하기"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
