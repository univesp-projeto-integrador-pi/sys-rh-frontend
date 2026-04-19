import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast'; // Sugestão: use react-hot-toast para mensagens bonitas

export function ProtectedRoute() {
  const location = useLocation();
  
  // 1. Buscamos os dados do localStorage
  const isAuthenticated = !!localStorage.getItem("user_token");
  const userJson = localStorage.getItem("logged_user");
  const user = userJson ? JSON.parse(userJson) : null;

  // 2. Verificamos se é admin
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  // 3. Efeito para disparar a mensagem apenas quando o acesso for negado
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      // Aqui você pode usar um alert() simples ou uma biblioteca como o Toast
      toast.error("Acesso Negado: Esta área é restrita para administradores.", {
        id: "admin-denied" // Evita que a mensagem duplique
      });
    }
  }, [isAuthenticated, isAdmin]);

  // CASO 1: Não está logado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // CASO 2: Está logado, mas NÃO é admin
  if (!isAdmin) {
    // Redireciona para a home de vagas (ou outra página pública)
    return <Navigate to="/" replace />;
  }

  // CASO 3: É admin e está logado. Liberado!
  return <Outlet />;
}