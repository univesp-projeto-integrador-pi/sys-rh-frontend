import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@teste.com" && password === "123456") {
      localStorage.setItem("user_token", "sessao_ativa_123");
      // Forçamos um refresh ou redirecionamento para o Header atualizar
      navigate("/");
      window.location.reload(); // Força o Header a ler o localStorage novo
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Entrar</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="admin@teste.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="123456"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-teal-500 text-white font-black py-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer hover:bg-teal-600 hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest"          >
            ENTRAR
          </button>

        </form>
      </div>
    </div>
  );
}