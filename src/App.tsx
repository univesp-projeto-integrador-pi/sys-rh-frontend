// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/Login';
import { Header } from './components/Header'; // Importe o novo Header
import { ApplicationForm } from './pages/ApplicationForm'; // Importe aqui

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Adicione o Header aqui para que apareça em todas as páginas */}
      <Routes>
        <Route path="/vaga/:id/candidatar" element={<ApplicationForm />} /> 
        <Route path="/" element={<Home />} />
        <Route path="/vaga/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
