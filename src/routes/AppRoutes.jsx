import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Loader from "../components/Loader";
import ProtectedRoute from "../components/ProtectedRoute";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));

function AppRoutes() {
  return (
    <Suspense fallback={<Loader text="Loading page..." />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
