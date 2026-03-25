import { Link } from 'react-router-dom';

export function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Entrar</h2>
        <p className="text-slate-500 text-center mb-8">Faça login para se candidatar às vagas.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
          </div>
          
          <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all shadow-md mt-4">
            ENTRAR
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-600">Ainda não tem conta?</p>
          <Link to="/cadastro" className="text-blue-700 font-bold hover:underline">
            Crie sua conta gratuitamente
          </Link>
        </div>
      </div>
    </div>
  );
}