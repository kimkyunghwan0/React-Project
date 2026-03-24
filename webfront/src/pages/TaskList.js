import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import styles from "./TaskList.module.css"

export default function TaskList() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const goal = state?.goal;

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ schedule: "", dueDate: "" });
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (goal) fetchTasks();
  }, []);

  async function fetchTasks() {
    const res = await axios.get(`/task/${goal.goalSeq}`);
    setTasks(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (validationCheck(form)) {
      await axios.post("/task", {
        goal: { goalSeq: goal.goalSeq },
        schedule: form.schedule,
        dueDate: form.dueDate || null,
      });
      setForm({ schedule: "", dueDate: "" });
      fetchTasks();
    }
  }

  async function handleUpdate() {
    if (window.confirm("수정하시겠습니까?")) {
      if (validationCheck(editTask)) {
        await axios.put(`/task/${editTask.taskSeq}`, editTask);
        window.alert("수정되었습니다.");
        setEditTask(null);
        fetchTasks();
      }
    }
  }

  async function handleToggle(taskSeq) {
    await axios.patch(`/task/${taskSeq}/toggle`);
    fetchTasks();
  }

  async function handleDelete(taskSeq) {
    if (window.confirm("삭제하시겠습니까?")) {
      await axios.delete(`/task/${taskSeq}`);
      fetchTasks();
    }
  }

  function validationCheck(target) {
    if (target.schedule.length > 1000) {
      setError("내용은 1000자 이내로 작성해주세요.");
      return false;
    }
    if (target.dueDate && (target.dueDate < goal.startDt || target.dueDate > goal.endDt)) {
      setError("마감일은 목표 기간 내에서 설정해주세요.");
      return false;
    }
    setError("");
    return true;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>{goal.title}</h2>
            {goal.content && <p className={styles.goalContent}>{goal.content}</p>}
          </div>
          <span className={styles.goalPeriod}>{goal.startDt} ~ {goal.endDt}</span>
        </div>

        <hr className={styles.divider} />

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <input
              className={styles.inputSchedule}
              placeholder="할 일 내용을 입력하세요"
              value={form.schedule}
              onChange={e => setForm({ ...form, schedule: e.target.value })}
              required
            />
            <input
              className={styles.inputDate}
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
            />
            <button className={styles.addBtn} type="submit">추가</button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "50px" }}>No</th>
              <th>할 일</th>
              <th style={{ width: "120px" }}>마감일</th>
              <th style={{ width: "60px" }}>완료</th>
              <th style={{ width: "120px" }}></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => {
              const isOverdue = task.dueDate && task.status === "N" && task.dueDate < new Date().toISOString().slice(0, 10);
              const rowClass = task.status === "Y" ? styles.done : styles[index % 2 === 0 ? "even" : "odd"];
              return (
                <tr key={task.taskSeq} className={rowClass}>
                  <td>{index + 1}</td>
                  {editTask?.taskSeq === task.taskSeq ? (
                    <>
                      <td><input value={editTask.schedule} onChange={e => setEditTask({ ...editTask, schedule: e.target.value })} /></td>
                      <td><input type="date" value={editTask.dueDate || ""} onChange={e => setEditTask({ ...editTask, dueDate: e.target.value })} /></td>
                      <td>
                        <input
                          type="checkbox"
                          checked={task.status === "Y"}
                          onChange={() => handleToggle(task.taskSeq)}
                        />
                      </td>
                      <td>
                        <div className={styles.btnGroup}>
                          <button className={styles.updateBtn} onClick={e => { e.stopPropagation(); handleUpdate(); }}>저장</button>
                          <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); setEditTask(null); setError(""); }}>취소</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={`${styles.taskSchedule} ${task.status === "Y" ? styles.doneText : ""}`} title={task.schedule}>{task.schedule}</td>
                      <td className={`${styles.dueDate} ${isOverdue ? styles.overdue : ""}`}>{task.dueDate || "-"}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={task.status === "Y"}
                          onChange={() => handleToggle(task.taskSeq)}
                        />
                      </td>
                      <td>
                        <div className={styles.btnGroup}>
                          <button className={styles.updateBtn} onClick={() => setEditTask(task)}>수정</button>
                          <button className={styles.deleteBtn} onClick={() => handleDelete(task.taskSeq)}>삭제</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.backBtnWrap}>
          <button className={styles.backBtn} onClick={() => navigate("/goals")}>목록으로</button>
        </div>
      </div>
    </div>
  );
}
