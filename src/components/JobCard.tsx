import { Briefcase, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🚀 NOVO: Função para calcular "Há quanto tempo" foi publicado
function getTimeAgo(dateString?: string) {
  if (!dateString) return 'Data não informada';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInDays > 30) return `Há ${Math.floor(diffInDays / 30)} meses`;
  if (diffInDays === 1) return `Há 1 dia`;
  if (diffInDays > 1) return `Há ${diffInDays} dias`;
  if (diffInHours > 0) return `Há ${diffInHours} horas`;
  return 'Publicado recentemente';
}

export function JobCard({ job }: { job: any }) {
  const navigate = useNavigate();

  // 🚀 NOVO: Normalizar o status vindo do DB
  const statusText = job.status?.toUpperCase() || 'OPEN';
  const isOpen = statusText === 'OPEN' || statusText === 'ABERTO' || statusText === 'ATIVO';

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 p-3 rounded-xl text-teal-600">
            <Briefcase size={24} />
          </div>
          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
            {job.department?.name || 'Geral'}
          </span>
        </div>

        {/* Badge Dinâmico de Status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border ${
          isOpen 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
            : 'bg-rose-50 text-rose-600 border-rose-200'
        }`}>
          {isOpen ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {isOpen ? 'Aberta' : 'Fechada'}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">{job.title}</h3>
      
      <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-grow">
        {job.description}
      </p>

      {/* Relógio com tempo de publicação */}
      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-5">
        <Clock size={14} />
        <span>{getTimeAgo(job.createdAt)}</span>
      </div>
      
      <button 
        onClick={() => navigate(`/vaga/${job.id}`)}
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors"
      >
        Ver Detalhes
      </button>
    </div>
  );
}