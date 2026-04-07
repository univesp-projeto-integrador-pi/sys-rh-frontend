import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Novo estado para exibir erros na tela
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa os erros antes de tentar logar novamente

    // 1. Busca os usuários salvos no LocalStorage (criados pelo Register.tsx)
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // 2. Procura um usuário que tenha exatamente o mesmo e-mail e senha digitados
    const validUser = storedUsers.find(
      (user: any) => user.email === email && user.password === password
    );

    // 3. (Opcional) Mantemos o admin padrão como um "Mestre" caso você precise
    const isAdminDefault = email === "admin@teste.com" && password === "123456";

    // 4. Valida se encontrou o usuário ou se é o admin
    if (validUser || isAdminDefault) {
      // Cria o token de sessão
      localStorage.setItem("user_token", "sessao_ativa_123");
      
      // Salva os dados do usuário logado (útil se você quiser mostrar o nome dele no Header depois)
      if (validUser) {
        localStorage.setItem("logged_user", JSON.stringify(validUser));
      }

      navigate("/");
      window.location.reload(); 
    } else {
      // Se não encontrar, exibe o erro
      setError("E-mail ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Entrar</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* MENSAGEM DE ERRO VISUAL */}
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
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
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
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              placeholder="Sua senha"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-teal-500 text-white font-black py-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer hover:bg-teal-600 hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest"
          >
            ENTRAR
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