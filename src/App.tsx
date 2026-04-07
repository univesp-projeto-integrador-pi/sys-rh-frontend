import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/Login';
import { ApplicationForm } from './pages/ApplicationForm';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Register } from './pages/Register'; // Adicione este import

// Páginas Administrativas
import AdminApplications from './pages/AdminApplications';
import { AdminUsers } from './pages/AdminUsers'; // Nova página


function App() {
  return (
    <BrowserRouter>
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
            
            {/* ROTAS PROTEGIDAS (REQUEREM LOGIN) */}
            <Route element={<ProtectedRoute />}>
              {/* Redirecionamento base do Admin */}
              <Route path="/admin" element={<Navigate to="/admin/candidaturas" replace />} />
              
              {/* Gestão de Candidaturas (Cursos/Vagas) */}
              <Route path="/admin/candidaturas" element={<AdminApplications />} />
              
              {/* Gestão de Usuários Cadastrados */}
              <Route path="/admin/usuarios" element={<AdminUsers />} />
            </Route>
            
            {/* FALLBACK: Redireciona qualquer rota inválida para o Início */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;