import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para loading
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Inicia o loading

    try {
      // Chamada para a API de Login (mesma base do register)
      const response = await fetch('http://localhost:3000/api/auth/login', {
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

      // Salva o token JWT e dados do usuário
      localStorage.setItem("user_token", data.accessToken);
      
      if (data.user) {
        localStorage.setItem("logged_user", JSON.stringify(data.user));
      }

      navigate("/");
      window.location.reload(); 

    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false); // Finaliza o loading
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Entrar</h2>

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
              disabled={isLoading} // Desabilita durante o loading
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
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
              disabled={isLoading} // Desabilita durante o loading
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              placeholder="Sua senha"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} // Desabilita durante o loading
            className="w-full bg-teal-500 text-white font-black py-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer hover:bg-teal-600 hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest disabled:bg-slate-400 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>

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