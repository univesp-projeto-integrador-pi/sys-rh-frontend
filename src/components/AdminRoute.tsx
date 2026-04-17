import { Navigate, Outlet } from 'react-router-dom';

export function AdminRoute() {
  const token = localStorage.getItem("user_token");
  const userJson = localStorage.getItem("logged_user");

  // 1. Se não estiver logado → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Se não for admin → home
  if (userJson) {
    const user = JSON.parse(userJson);
    if (user.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
  }

  // 3. Se for admin → permite acesso
  return <Outlet />;
}