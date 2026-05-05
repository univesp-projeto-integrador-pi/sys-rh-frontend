import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Importar o hook

export function JobCard({ job }: { job: any }) {
  const navigate = useNavigate(); // 2. Inicializar o navigate

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-teal-50 p-3 rounded-xl text-teal-600">
          <Briefcase size={24} />
        </div>
        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
          {job.department?.name || 'Geral'}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">{job.title}</h3>
      <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
        {job.description}
      </p>
      
      {/* 3. Adicionar o onClick chamando a rota correta */}
      <button 
        onClick={() => navigate(`/vaga/${job.id}`)}
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors"
      >
        Ver Detalhes
      </button>
    </div>
  );
}