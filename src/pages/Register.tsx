import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react'; // Certifique-se de ter o lucide-react instalado

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // Estado para a mensagem bonita
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error((body && body.message) || 'Falha ao registrar usuário.');
      }

      setShowSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Erro no cadastro.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* MENSAGEM DE SUCESSO (TOAST ANIMADO) */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-teal-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-teal-400">
            <CheckCircle size={28} />
            <div>
              <p className="font-black text-lg leading-tight">CADASTRO REALIZADO!</p>
              <p className="text-sm opacity-90">Redirecionando para o login...</p>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 transition-all duration-500 ${showSuccess ? 'opacity-50 scale-95 blur-sm' : ''}`}>
        <h2 className="text-3xl font-black mb-2 text-center text-slate-800 tracking-tight">Criar Conta</h2>
        <p className="text-center text-slate-500 mb-8 font-medium">Preencha os dados abaixo</p>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center font-bold border border-red-200 animate-pulse">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Nome Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-300"
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">E-mail Corporativo</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-300"
              placeholder="exemplo@rh.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Senha de Acesso</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-300"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={showSuccess}
            className="w-full bg-teal-500 text-white font-black py-5 rounded-2xl shadow-lg shadow-teal-200 transition-all duration-300 hover:bg-teal-600 hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest"
          >
            FINALIZAR CADASTRO
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 font-medium">
            Já possui acesso?{' '}
            <Link 
              to="/login" 
              className="text-teal-600 font-black hover:text-teal-700 transition-colors underline-offset-8 hover:underline"
            >
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}