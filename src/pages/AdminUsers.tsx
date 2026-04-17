import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Trash2, ShieldCheck, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Interface alinhada ao seu Schema Prisma
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'RECRUITER' | 'VIEWER'; 
  createdAt: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("user_token");

      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error('Acesso negado: Somente administradores podem ver esta lista.');
        throw new Error('Falha ao buscar usuários no banco de dados.');
      }

      const data = await response.json();
      
      // Garante que estamos lidando com um array, independente da estrutura da resposta
      const usersArray = Array.isArray(data) ? data : (data.users || []);

      const sorted = usersArray.sort((a: UserData, b: UserData) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setUsers(sorted);
    } catch (err: any) {
      console.error("Erro ao carregar usuários:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRemoveUser = async (id: string) => {
    const confirmDelete = window.confirm("Atenção: Esta ação removerá o acesso do usuário permanentemente. Confirmar?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`http://localhost:3000/api/users/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Não foi possível excluir o usuário.');

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-6 flex justify-between items-end">
          <div>
            <span className="text-teal-600 font-black text-xs uppercase tracking-[0.2em]">Painel de Controle</span>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Administrativo</h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="text-slate-500 text-xs font-bold uppercase">Total DB: </span>
            <span className="text-teal-600 font-black text-lg leading-none">{users.length}</span>
          </div>
        </header>

        <div className="flex gap-8 border-b border-slate-200 mb-10">
          <Link 
            to="/admin/candidaturas" 
            className={`pb-4 text-[11px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${
              location.pathname.includes('candidaturas') 
              ? 'border-b-4 border-teal-500 text-teal-600' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText size={14} />
            CANDIDATURAS
          </Link>
          <Link 
            to="/admin/usuarios" 
            className={`pb-4 text-[11px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${
              location.pathname.includes('usuarios') 
              ? 'border-b-4 border-teal-500 text-teal-600' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users size={14} />
            USUÁRIOS DO SISTEMA
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
            <AlertCircle size={20} />
            {error}
            <button onClick={loadUsers} className="ml-auto underline decoration-2 underline-offset-4">Tentar novamente</button>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Nome / E-mail</th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Cargo</th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Data de Cadastro</th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-400 font-medium italic">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      Consultando banco de dados PostgreSQL...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 && !error ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-400 font-medium italic">
                    Nenhum registro encontrado no banco.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold text-sm">{user.name}</span>
                        <span className="text-slate-400 text-xs">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      {user.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100">
                          <ShieldCheck size={12} /> ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-black bg-slate-50 text-slate-500 border border-slate-100">
                          <Shield size={12} /> USUÁRIO
                        </span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[11px] font-bold">
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          às {new Date(user.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => handleRemoveUser(user.id)}
                        className="bg-red-50 text-red-400 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        title="Deletar permanentemente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}