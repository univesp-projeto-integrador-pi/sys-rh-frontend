import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Trash2, ShieldCheck, Shield, AlertCircle, Briefcase, Plus, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

// Interfaces para tipagem
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'RECRUITER' | 'VIEWER'; 
  createdAt: string;
}

interface ApplicationData {
  id: string;
  candidate?: {
    fullName: string;
    email: string;
  };
  position?: {
    title: string;
  };
  currentStage: string;
  createdAt: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const isApplicationsTab = location.pathname.includes('candidaturas');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("user_token");
    const endpoint = isApplicationsTab ? 'job-applications' : 'users';

    try {
      const response = await fetch(`http://localhost:3000/api/v1/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Erro ao carregar ${isApplicationsTab ? 'candidaturas' : 'usuários'}.`);

      const data = await response.json();
      console.log("Dados recebidos da API:", data);

      if (isApplicationsTab) {
        setApplications(Array.isArray(data) ? data : []);
      } else {
        const usersArray = Array.isArray(data) ? data : (data.users || []);
        setUsers(usersArray);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const handleRemove = async (id: string, type: 'user' | 'app') => {
    if (!window.confirm("Confirmar exclusão permanente?")) return;
    try {
      const token = localStorage.getItem("user_token");
      const url = type === 'user' ? `/api/v1/users/${id}` : `/api/v1/job-applications/${id}`;
      
      const res = await fetch(`http://localhost:3000${url}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        if (type === 'app') setApplications(prev => prev.filter(a => a.id !== id));
        else setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) { alert("Erro ao excluir."); }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-end">
          <div>
            <span className="text-teal-600 font-black text-xs uppercase tracking-[0.2em]">Painel de Controle</span>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Administrativo</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/admin/vagas/nova" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-teal-600 transition-all shadow-lg active:scale-95">
              <Plus size={16} strokeWidth={3} /> Nova Vaga
            </Link>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
              <span className="text-slate-500 text-xs font-bold uppercase">Total: </span>
              <span className="text-teal-600 font-black text-lg">
                {isApplicationsTab ? applications.length : users.length}
              </span>
            </div>
          </div>
        </header>

        {/* ABAS */}
        <div className="flex gap-8 border-b border-slate-200 mb-10">
          <Link to="/admin/candidaturas" className={`pb-4 text-[11px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${isApplicationsTab ? 'border-b-4 border-teal-500 text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <FileText size={14} /> CANDIDATURAS
          </Link>
          <Link to="/admin/usuarios" className={`pb-4 text-[11px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${!isApplicationsTab && location.pathname.includes('usuarios') ? 'border-b-4 border-teal-500 text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Users size={14} /> USUÁRIOS
          </Link>
          <Link to="/admin/vagas/nova" className="pb-4 text-[11px] font-black tracking-[0.2em] text-slate-400 hover:text-slate-600 flex items-center gap-2">
            <Briefcase size={14} /> POSTAR VAGA
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex gap-2 items-center">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {isApplicationsTab ? (
                  <>
                    <th className="p-5 text-[10px] font-black uppercase text-slate-400">Candidato</th>
                    <th className="p-5 text-[10px] font-black uppercase text-slate-400">Vaga</th>
                    <th className="p-5 text-[10px] font-black uppercase text-slate-400">Status</th>
                  </>
                ) : (
                  <>
                    <th className="p-5 text-[10px] font-black uppercase text-slate-400">Usuário</th>
                    <th className="p-5 text-[10px] font-black uppercase text-slate-400">Permissão</th>
                  </>
                )}
                <th className="p-5 text-[10px] font-black uppercase text-slate-400">Data</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">Carregando dados...</td></tr>
              ) : isApplicationsTab ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold text-sm">{app.candidate?.fullName || 'N/A'}</span>
                        <span className="text-slate-400 text-xs flex items-center gap-1"><Mail size={12}/>{app.candidate?.email}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-slate-700 font-black text-[10px] bg-slate-100 px-2 py-1 rounded">
                        {app.position?.title || 'Vaga excluída'}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="py-1 px-3 rounded-full text-[10px] font-black bg-teal-50 text-teal-600 border border-teal-100">
                        {app.currentStage}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-xs font-medium">
                      {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-5 text-center">
                      <button onClick={() => handleRemove(app.id, 'app')} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold text-sm">{user.name}</span>
                        <span className="text-slate-400 text-xs">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1 py-1 px-3 rounded-full text-[10px] font-black ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
                        {user.role === 'ADMIN' ? <ShieldCheck size={12}/> : <Shield size={12}/>} {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-xs font-medium">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-5 text-center">
                      <button onClick={() => handleRemove(user.id, 'user')} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
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