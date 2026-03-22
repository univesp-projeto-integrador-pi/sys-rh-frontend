interface JobCardProps {
  title: string;     // Ex: Assistente
  role: string;      // Ex: Assistente de Almoxarifado
  company: string;   // Ex: MASP
  location: string;  // Ex: São Paulo - SP
  deadline: string;  // Ex: 09/05/2026
  tag: string;       // Ex: SERVIÇOS ESPECIALIZADOS
}

export function JobCard({ title, role, company, location, deadline, tag }: JobCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-slate-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-semibold text-teal-600">{title}</h2>
          <h3 className="text-lg text-teal-600 mb-4">{role}</h3>
        </div>
        <span className="bg-slate-300 text-slate-800 text-xs font-medium px-4 py-2 rounded uppercase tracking-wider">
          {tag}
        </span>
      </div>

      <div className="space-y-1 text-slate-700 mb-6">
        <p className="font-medium text-slate-900">{company}</p>
        <p>{location}</p>
        <p className="text-xs text-slate-500">INSCREVA-SE ATÉ: {deadline}</p>
      </div>

      <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition">
        Ver vaga
          </button>
    </div>
  );
}