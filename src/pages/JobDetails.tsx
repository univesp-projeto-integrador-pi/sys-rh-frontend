import { Link, useParams } from 'react-router-dom';
import { allJobs } from '../data/jobs';

export function JobDetails() {
  const { id } = useParams();
  const vaga = allJobs.find((j) => j.id === Number(id));

  if (!vaga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Vaga não encontrada</h1>
          <Link to="/" className="text-teal-600 hover:underline mt-4 inline-block">Voltar para o início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* HEADER FIXO NO TOPO */}
      <header className="bg-blue-700 text-white p-4 shadow-sm mb-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Jobs na ONG</Link>
          <button className="text-sm bg-blue-800 px-4 py-2 rounded-lg hover:bg-blue-900 transition">Sair</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-12">
        {/* NAVEGAÇÃO */}
        <Link to="/" className="text-teal-600 font-medium hover:text-teal-700 mb-6 inline-flex items-center gap-2">
          <span>←</span> Voltar para a lista de vagas
        </Link>

        {/* CONTAINER PRINCIPAL BRANCO */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* SEÇÃO SUPERIOR: TÍTULO E BOTÃO COPIAR */}
          <div className="p-8 border-b border-slate-100 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-3 inline-block">
                  {vaga.tag}
                </span>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
                  {vaga.role}
                </h1>
                <p className="text-xl text-teal-600 font-semibold">{vaga.company}</p>
              </div>
              <button className="flex items-center gap-2 text-blue-600 border border-blue-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition shrink-0">
                <span>🔗</span> Copiar link
              </button>
            </div>

            {/* GRID DE INFORMAÇÕES RÁPIDAS COM ÍCONES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase">Local</span>
                  <span className="text-sm text-slate-700 font-medium">{vaga.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">💼</span>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase">Contrato</span>
                  <span className="text-sm text-slate-700 font-medium">{vaga.contractType}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🏢</span>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase">Modelo</span>
                  <span className="text-sm text-slate-700 font-medium">Presencial</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📅</span>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase">Prazo</span>
                  <span className="text-sm text-slate-700 font-medium">{vaga.deadline}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CORPO DA PÁGINA (COLUNA DUPLA) */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* COLUNA DA ESQUERDA: TEXTOS INFORMATIVOS */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider border-l-4 border-teal-500 pl-4">
                  Descrição da Vaga
                </h2>
                <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                  {vaga.description}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider border-l-4 border-teal-500 pl-4">
                  Requisitos e Qualificações
                </h2>
                <ul className="list-disc list-inside text-slate-600 space-y-3 text-lg">
                  <li>Ensino médio completo;</li>
                  <li>Experiência prévia em rotinas de almoxarifado ou logística;</li>
                  <li>Conhecimento básico em informática (Pacote Office);</li>
                  <li>Perfil proativo e organizado.</li>
                </ul>
              </section>
            </div>

            {/* COLUNA DA DIREITA: CARD DE CANDIDATURA (STICKY) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Interessado?</h3>
                <p className="text-slate-500 text-sm text-center mb-8">Candidate-se agora e nossa equipe entrará em contato.</p>
                
                <Link 
                  to="/login"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white text-center font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  CANDIDATAR-SE
                </Link>
                
                <p className="mt-4 text-[11px] text-slate-400 text-center leading-tight">
                  Sua inscrição será processada de acordo com as leis de proteção de dados (LGPD).
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}