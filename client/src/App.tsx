import { Navigate, Route, Routes } from "react-router-dom";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "./pages/DashboardPage";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth.api";
import { useDispatch } from "react-redux";
import { setLogout, setUser } from "./store/slices/authSlice";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const loadCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      dispatch(setUser(response));
    } catch (err: any) {
      console.log(err);
      dispatch(setLogout());
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, [dispatch]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
