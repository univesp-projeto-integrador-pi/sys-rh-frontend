import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function ProtectedRoute() {
  const location = useLocation();
  
  // Apenas verifica se existe um token (usuário logado)
  const isAuthenticated = !!localStorage.getItem("user_token");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Por favor, faça login para acessar esta página.", {
        id: "login-required"
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // Redireciona para o login e salva para onde o usuário queria ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se tem token, libera o acesso!
  return <Outlet />;
}