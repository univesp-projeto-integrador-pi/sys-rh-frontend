import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users, FileText, Trash2, ShieldCheck, Shield,
  AlertCircle, Briefcase, Plus, Mail,
  GraduationCap, Building2, UsersRound
} from 'lucide-react';

// ─── Tokens de estilo compartilhados ─────────────────────────────────────────
const TH  = 'px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap';
const TD  = 'px-5 py-4 align-middle';
const ROW = 'border-b border-slate-50 hover:bg-slate-50/60 transition-colors';

// ─── Interfaces ──────────────────────────────────────────────────────────────
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
    education?: { degree: string; fieldOfStudy: string };
  };
  position?: { title: string };
  currentStage: string;
  createdAt: string;
}

interface JobData {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  department?: { name: string };
  _count?: { applications: number };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function statusColor(stage: string) {
  const s = stage.toUpperCase();
  if (s.includes('APROVADO') || s.includes('OPEN'))
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (s.includes('REJEITADO') || s.includes('CLOSED'))
    return 'bg-red-50 text-red-600 border-red-100';
  return 'bg-blue-50 text-blue-600 border-blue-100';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

// ─── Componente ──────────────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers]               = useState<UserData[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [jobs, setJobs]                 = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const location = useLocation();

  const isJobsTab         = location.pathname.includes('vagas') && !location.pathname.includes('nova');
  const isApplicationsTab = location.pathname.includes('candidaturas');
  const isUsersTab        = location.pathname.includes('usuarios');

  // ── Fetch — sem cache, sempre busca dados frescos ao trocar de aba ──────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('user_token');

      let endpoint = '';
      if (isApplicationsTab) endpoint = 'job-applications';
      else if (isUsersTab)   endpoint = 'users';
      else if (isJobsTab)    endpoint = 'jobs-services';

      if (!endpoint) { setLoading(false); return; }

      try {
        const res = await fetch(`http://localhost:3000/api/v1/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Erro ao carregar dados do servidor.');
        const data = await res.json();

        if (isApplicationsTab) setApplications(Array.isArray(data) ? data : []);
        else if (isUsersTab)   setUsers(Array.isArray(data) ? data : (data.users || []));
        else if (isJobsTab)    setJobs(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleRemove = async (id: string, type: 'user' | 'app' | 'job') => {
    if (!window.confirm('Confirmar exclusão permanente? Esta ação não pode ser desfeita.')) return;
    try {
      const token = localStorage.getItem('user_token');
      const map   = { user: 'users', app: 'job-applications', job: 'jobs-services' };
      const res   = await fetch(`http://localhost:3000/api/v1/${map[type]}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao excluir o registro.');
      if (type === 'app')  setApplications(p => p.filter(a => a.id !== id));
      if (type === 'user') setUsers(p => p.filter(u => u.id !== id));
      if (type === 'job')  setJobs(p => p.filter(j => j.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir o registro.');
    }
  };

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const tabs = [
    { label: 'Vagas',        to: '/admin/vagas',        icon: <Briefcase size={13} />, active: isJobsTab         },
    { label: 'Candidaturas', to: '/admin/candidaturas', icon: <FileText  size={13} />, active: isApplicationsTab },
    { label: 'Usuários',     to: '/admin/usuarios',     icon: <Users     size={13} />, active: isUsersTab        },
  ];

  const isEmpty =
    (!loading && isJobsTab         && jobs.length === 0) ||
    (!loading && isApplicationsTab && applications.length === 0) ||
    (!loading && isUsersTab        && users.length === 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">

        {/* HEADER — completamente estático, não muda entre abas */}
        <header className="mb-8 flex flex-row justify-between items-end">
          <div className="min-w-max">
            <span className="text-teal-600 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mb-1 whitespace-nowrap">
              <ShieldCheck size={13} /> Sistema de Gestão Administrativo
            </span>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Administrativo
            </h1>
          </div>

          <Link
            to="/admin/vagas/nova"
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-teal-600 transition-colors shadow-md"
          >
            <Plus size={14} strokeWidth={3} /> Nova Vaga
          </Link>
        </header>

        {/* ABAS — border-b puro, sem framer-motion */}
        <nav className="flex items-center border-b border-slate-200 mb-8">
          {tabs.map(tab => (
            <Link
              key={tab.to}
              to={tab.to}
              className={[
                'flex items-center gap-2 px-5 py-3 -mb-px',
                'text-[11px] font-black tracking-[0.2em] uppercase',
                'border-b-2 transition-colors duration-150',
                tab.active
                  ? 'text-teal-600 border-teal-500'
                  : 'text-slate-400 border-transparent hover:text-slate-600',
              ].join(' ')}
            >
              {tab.icon}
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* ERRO */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex gap-3 items-center">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* TABELA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">

            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                {isJobsTab && <>
                  <th className={TH}>Título da Vaga</th>
                  <th className={TH}>Departamento</th>
                  <th className={`${TH} text-center`}>Candidatos</th>
                  <th className={TH}>Status</th>
                </>}
                {isApplicationsTab && <>
                  <th className={TH}>Candidato</th>
                  <th className={TH}>Vaga</th>
                  <th className={TH}>Educação</th>
                  <th className={TH}>Status</th>
                </>}
                {isUsersTab && <>
                  <th className={TH}>Usuário</th>
                  <th className={TH}>Permissão</th>
                </>}
                <th className={`${TH} text-center`}>Data</th>
                <th className={`${TH} text-center`}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {loading && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-7 h-7 border-[3px] border-teal-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Sincronizando...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {/* VAGAS */}
              {!loading && isJobsTab && jobs.map(job => (
                <tr key={job.id} className={ROW}>
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 text-white rounded-lg shrink-0">
                        <Briefcase size={13} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{job.title}</span>
                    </div>
                  </td>
                  <td className={TD}>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                      <Building2 size={13} className="text-teal-500 shrink-0" />
                      {job.department?.name || 'Geral'}
                    </div>
                  </td>
                  <td className={`${TD} text-center`}>
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold">
                      <UsersRound size={13} className="text-teal-600" />
                      {job._count?.applications ?? 0}
                    </span>
                  </td>
                  <td className={TD}>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className={`${TD} text-center text-[11px] font-bold text-slate-500 uppercase`}>
                    {formatDate(job.createdAt)}
                  </td>
                  <td className={`${TD} text-center`}>
                    <button onClick={() => handleRemove(job.id, 'job')} className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* CANDIDATURAS */}
              {!loading && isApplicationsTab && applications.map(app => (
                <tr key={app.id} className={ROW}>
                  <td className={TD}>
                    <div className="text-sm font-bold text-slate-900">{app.candidate?.fullName}</div>
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400 font-medium">
                      <Mail size={11} /> {app.candidate?.email}
                    </div>
                  </td>
                  <td className={TD}>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{app.position?.title}</span>
                  </td>
                  <td className={TD}>
                    {app.candidate?.education ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase">
                          <GraduationCap size={13} className="text-teal-600 shrink-0" />
                          {app.candidate.education.degree}
                        </div>
                        <div className="mt-0.5 text-[10px] italic text-slate-400 font-medium pl-[18px]">
                          {app.candidate.education.fieldOfStudy}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-300 font-medium">Não informado</span>
                    )}
                  </td>
                  <td className={TD}>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusColor(app.currentStage)}`}>
                      {app.currentStage}
                    </span>
                  </td>
                  <td className={`${TD} text-center text-[11px] font-bold text-slate-500 uppercase`}>
                    {formatDate(app.createdAt)}
                  </td>
                  <td className={`${TD} text-center`}>
                    <button onClick={() => handleRemove(app.id, 'app')} className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* USUÁRIOS */}
              {!loading && isUsersTab && users.map(user => (
                <tr key={user.id} className={ROW}>
                  <td className={TD}>
                    <div className="text-sm font-bold text-slate-900">{user.name}</div>
                    <div className="mt-0.5 text-[11px] text-slate-400 font-medium">{user.email}</div>
                  </td>
                  <td className={TD}>
                    <span className={[
                      'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl',
                      'text-[10px] font-black tracking-wider border',
                      user.role === 'ADMIN'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200',
                    ].join(' ')}>
                      {user.role === 'ADMIN' ? <ShieldCheck size={13} /> : <Shield size={13} />}
                      {user.role}
                    </span>
                  </td>
                  <td className={`${TD} text-center text-[11px] font-bold text-slate-500 uppercase`}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td className={`${TD} text-center`}>
                    <button onClick={() => handleRemove(user.id, 'user')} className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* VAZIO */}
              {isEmpty && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}