import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/Login';
import { ApplicationForm } from './pages/ApplicationForm';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import AdminApplications from './pages/AdminApplications';
import { ProtectedRoute } from './components/ProtectedRoute';

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
            
            {/* ROTAS PROTEGIDAS (REQUEREM LOGIN) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Navigate to="/admin/candidaturas" replace />} />
              <Route path="/admin/candidaturas" element={<AdminApplications />} />
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