import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home } from './pages/Home';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/Login';
import { ApplicationForm } from './pages/ApplicationForm';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute'; 
import { Register } from './pages/Register';
import { CompleteProfile } from './pages/CompleteProfile';

// Import da nova página
import { CreateJob } from './pages/CreateJob'; // Certifique-se que o nome do arquivo/export está correto

// Páginas Administrativas
import AdminApplications from './pages/AdminApplications';
import { AdminUsers } from './pages/AdminUsers';
import { Profile } from './pages/Profile';

function AppContent() {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 ${isAuthPage ? 'overflow-hidden h-screen' : ''}`}>
      {!isAuthPage && <Header />} 
      
      <main className={`flex-grow px-4 md:px-0 ${
        isAuthPage 
          ? 'flex items-center justify-center' 
          : 'pt-16 pb-20'
      }`}>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/vaga/:id" element={<JobDetails />} />
          <Route path="/vaga/:id/candidatar" element={<ApplicationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />          
          
          {/* ROTAS PROTEGIDAS (QUALQUER USUÁRIO LOGADO) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/completar-perfil" element={<CompleteProfile />} />
            <Route path="/meu-perfil" element={<Profile />} />
            {/* Espaço para rotas comuns */}
          </Route>
          
          {/* ROTAS ADMIN (APENAS ADMINISTRADORES) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/candidaturas" replace />} />
            <Route path="/admin/candidaturas" element={<AdminApplications />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
            
            {/* NOVA ROTA PARA CRIAR VAGAS */}
            <Route path="/admin/vagas/nova" element={<CreateJob />} />
          </Route>
          
          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;