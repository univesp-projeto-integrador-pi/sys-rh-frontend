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
import { CreateJob } from './pages/CreateJob'; 
import MyApplications from './pages/MyApplications';

// Páginas Administrativas
import AdminApplications from './pages/AdminApplications';
import { AdminUsers } from './pages/AdminUsers';
import { Profile } from './pages/Profile';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`min-h-screen flex flex-col ${isAuthPage ? 'overflow-hidden h-screen' : ''}`}>
      {!isAuthPage && <Header />} 
      
      <main className={`flex-grow flex flex-col ${
        isAuthPage 
          ? 'flex items-center justify-center' 
          : ''
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
            <Route path="/minhas-candidaturas" element={<MyApplications />} />
          </Route>
          
          {/* ROTAS ADMIN (APENAS ADMINISTRADORES) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/vagas" replace />} />
            <Route path="/admin/vagas" element={<AdminUsers />} />
            <Route path="/admin/candidaturas" element={<AdminApplications />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
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