import { useParams, Link } from 'react-router-dom';
import { allJobs } from '../data/jobs'; // Certifique-se de que o caminho dos dados está correto

export function JobDetails() {
  const { id } = useParams();
  
  // 1. Busca a vaga pelo ID da URL
  const vaga = allJobs.find(j => j.id === Number(id));

  // 2. Verifica se o usuário está logado para decidir o destino do botão
  const isAuthenticated = !!localStorage.getItem("user_token");
  const destinoCandidatura = isAuthenticated 
    ? `/vaga/${id}/candidatar` 
    : "/login";

  if (!vaga) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Vaga não encontrada.</h1>
        <Link to="/" className="text-blue-600 underline">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* CONTEÚDO DA VAGA */}
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {vaga.tag}
              </span>
              <h1 className="text-4xl font-black text-slate-900 mt-4 leading-tight">
                {vaga.role}
              </h1>
              <p className="text-xl text-slate-500 font-medium">{vaga.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 pb-10 border-b border-slate-100 text-sm">
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-widest">Localização</span>
              <span className="text-slate-700 font-semibold">{vaga.location}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-widest">Contrato</span>
              <span className="text-slate-700 font-semibold">{vaga.contractType}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-widest">Data Limite</span>
              <span className="text-slate-700 font-semibold italic">Inscreva-se até: {vaga.deadline}</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none mb-12">
            <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">Descrição da Vaga</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {vaga.description}
            </p>
          </div>

          {/* BOTÃO DE AÇÃO DINÂMICO */}
          <Link 
            to={destinoCandidatura}
            className="inline-block w-full md:w-auto bg-teal-500 hover:bg-teal-600 text-white text-center font-black py-5 px-12 rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
          >
            {isAuthenticated ? "CONFIRMAR CANDIDATURA" : "FAÇA LOGIN PARA SE CANDIDATAR"}
          </Link>
        </div>
      </div>
    </div>
  );
}