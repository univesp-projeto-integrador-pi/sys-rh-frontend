import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '../assets/logoarrastao.png';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('import.meta.env.VITE_API_URL/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'E-mail ou senha incorretos.');
      }

      localStorage.setItem("user_token", data.accessToken);
      
      if (data.user) {
        localStorage.setItem("logged_user", JSON.stringify(data.user));
      }

      navigate("/");
      window.location.reload(); 

    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 relative">
        
        <Link 
          to="/" 
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all z-10"
          title="Voltar para o início"
        >
          <X size={24} />
        </Link>

        {/* LOGO ACIMA DO TÍTULO */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Arrastão" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800 tracking-tight">Entrar</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center font-bold border border-red-200 animate-pulse">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed text-lg"
              placeholder="exemplo@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed text-lg"
              placeholder="Sua senha"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-teal-500 text-white font-black py-4 mt-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-teal-600 hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest disabled:bg-slate-400 disabled:cursor-not-allowed text-lg"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-600">
            Não tem uma conta?{' '}
            <Link 
              to="/register" 
              className="text-teal-600 font-bold hover:text-teal-700 transition-colors underline-offset-4 hover:underline"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}