import { Navigate, Route, Routes } from "react-router-dom";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "./pages/DashboardPage";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth.api";
import { useDispatch } from "react-redux";
import { setUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const loadCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      dispatch(setUser(response.data.data));
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
