interface JobProps {
  title: string;
  location: string;
  type: string; // Ex: Presencial, Remoto, Híbrido
  category: string; // Ex: Voluntariado, Estágio
}

export function JobCard({ title, location, type, category }: JobProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {category}
        </span>
        <button className="text-blue-600 font-semibold text-sm group-hover:underline">
          Candidatar-se →
        </button>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
        {title}
      </h3>
      
      <div className="flex items-center gap-4 text-slate-500 text-sm">
        <div className="flex items-center gap-1">
          <span>📍 {location}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💼 {type}</span>
        </div>
      </div>
    </div>
  );
}