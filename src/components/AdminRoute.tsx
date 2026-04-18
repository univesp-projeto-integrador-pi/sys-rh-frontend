import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function AdminRoute() {
  const token = localStorage.getItem("user_token");
  const userJson = localStorage.getItem("logged_user");
  const user = userJson ? JSON.parse(userJson) : null;

  const isAuthenticated = !!token;
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  // O useEffect garante que a mensagem dispare assim que o componente carregar
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast.error("Acesso negado: Você não tem permissão de administrador.", {
        id: 'admin-denied', // Evita que a mensagem se repita várias vezes
        duration: 4000,     // Fica na tela por 4 segundos
      });
    }
  }, [isAuthenticated, isAdmin]);

  // 1. Se não estiver logado → vai para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Se não for admin → vai para a home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 3. Se for admin → permite acesso
  return <Outlet />;
}