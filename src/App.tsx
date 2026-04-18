import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // IMPORTAÇÃO NOVA
import { Home } from './pages/Home';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/Login';
import { ApplicationForm } from './pages/ApplicationForm';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute'; 
import { Register } from './pages/Register';

// Páginas Administrativas
import AdminApplications from './pages/AdminApplications';
import { AdminUsers } from './pages/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      {/* O Toaster fica aqui, fora do layout, para ser global */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header /> 
        
        <main className="flex-grow pt-16 pb-20 px-4 md:px-0">
          <Routes>
            {/* ROTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/vaga/:id" element={<JobDetails />} />
            <Route path="/vaga/:id/candidatar" element={<ApplicationForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* ROTAS PROTEGIDAS (QUALQUER USUÁRIO LOGADO) */}
            <Route element={<ProtectedRoute />}>
              {/* Espaço para rotas comuns de usuários logados */}
            </Route>
            
            {/* ROTAS ADMIN (APENAS ADMINISTRADORES) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Navigate to="/admin/candidaturas" replace />} />
              <Route path="/admin/candidaturas" element={<AdminApplications />} />
              <Route path="/admin/usuarios" element={<AdminUsers />} />
            </Route>
            
            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;