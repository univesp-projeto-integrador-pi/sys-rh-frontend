import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  // Verificamos se existe o token no localStorage
  const isAuthenticated = !!localStorage.getItem("user_token");

  // Se não estiver autenticado, redireciona para o login
  // O 'replace' evita que o usuário volte para a rota protegida ao clicar no botão 'voltar'
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza as rotas filhas (o conteúdo da página)
  return <Outlet />;
}