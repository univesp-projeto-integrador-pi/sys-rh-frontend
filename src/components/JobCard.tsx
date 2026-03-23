import { Link } from 'react-router-dom';

interface JobCardProps {
  id: number;
  title: string;     // Ex: Assistente
  role: string;      // Ex: Assistente de Almoxarifado
  company: string;   // Ex: MASP
  location: string;  // Ex: São Paulo - SP
  deadline: string;  // Ex: 09/05/2026
  tag: string;       // Ex: SERVIÇOS ESPECIALIZADOS
  contractType: string; // Ex: CLT
}

export function JobCard({ id, title, role, company, location, deadline, tag, contractType }: JobCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      
      <div className="flex-1">
        <div className="mb-2">
          <h2 className="text-2xl font-semibold text-teal-600 leading-tight">{title}</h2>
          <h3 className="text-lg text-teal-600">{role}</h3>
        </div>

        <div className="space-y-1 text-slate-600 text-sm">
          <p className="font-bold text-slate-800">{company}</p>
          <p>{location} • <span className="font-medium text-slate-500">{contractType}</span></p>
          <p className="text-xs uppercase tracking-wider text-slate-400">Increva-se até: {deadline}</p>
        </div>

        <div className="mt-6">
          <Link 
            to={`/vaga/${id}`} 
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-8 rounded transition-all inline-block"
          >
            Ver vaga
          </Link>
        </div>
      </div>

      {/* A TAG CINZA (Igual à referência da Cultura) */}
      <div className="hidden md:block">
        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest">
          {tag}
        </span>
      </div>
      
    </div>
  );
}