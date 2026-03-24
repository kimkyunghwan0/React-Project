import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import GoalList from "./pages/GoalList";
import TaskList from "./pages/TaskList";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  function handleLogin(userData) {
    const safeData = { userId: userData.userId, userName: userData.userName };
    localStorage.setItem("user", JSON.stringify(safeData));
    setUser(safeData);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/goals" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/goals"
          element={user ? <GoalList user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/goals/:goalSeq"
          element={user ? <TaskList user={user} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </HashRouter>
  );
}
