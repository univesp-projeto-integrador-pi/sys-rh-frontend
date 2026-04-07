import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Trash2, User, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) throw new Error('Falha ao buscar usuários');

        const usersData = await response.json();
        const sorted = usersData.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleRemoveUser = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja remover este usuário? Ele perderá o acesso ao sistema.")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Falha ao remover usuário');

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
      alert('Não foi possível remover o usuário no momento.');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO PADRONIZADO */}
        <header className="mb-6 flex justify-between items-end">
          <div>
            <span className="text-teal-600 font-black text-xs uppercase tracking-[0.2em]">Painel de Controle</span>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Administrativo</h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-bold uppercase">Usuários: </span>
            <span className="text-teal-600 font-black text-lg">{users.length}</span>
          </div>
        </header>

        {/* NAVEGAÇÃO DE ABAS PADRONIZADA */}
        <div className="flex gap-8 border-b border-slate-200 mb-10">
          <Link 
            to="/admin/candidaturas" 
            className={`pb-4 text-[11px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${
              location.pathname === '/admin/candidaturas' 
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
              location.pathname === '/admin/usuarios' 
              ? 'border-b-4 border-teal-500 text-teal-600' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users size={14} />
            USUÁRIOS DO SISTEMA
          </Link>
        </div>

        {/* TABELA DE USUÁRIOS */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  <div className="flex items-center gap-2"><User size={12}/> Nome</div>
                </th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  <div className="flex items-center gap-2"><Mail size={12}/> E-mail</div>
                </th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  <div className="flex items-center gap-2"><Calendar size={12}/> Cadastro</div>
                </th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-400 font-medium italic">
                    Carregando base de usuários...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-400 font-medium italic">
                    Nenhum usuário cadastrado no sistema.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <span className="text-slate-800 font-bold text-sm">{user.name}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-slate-500 text-sm">{user.email}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-slate-500 text-xs font-medium">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')} às {new Date(user.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => handleRemoveUser(user.id)}
                        className="bg-red-50 text-red-400 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Remover Usuário"
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