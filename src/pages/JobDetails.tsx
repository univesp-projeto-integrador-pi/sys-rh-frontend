import { Link, useParams } from 'react-router-dom';

export function JobDetails() {
  const { id } = useParams(); // No futuro, usaremos esse ID para buscar a vaga no banco

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-blue-700 text-white p-6 shadow-md mb-8">
         <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">Jobs na ONG</Link>
         </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* BOTÃO VOLTAR */}
        <Link to="/" className="text-teal-600 font-medium hover:underline mb-8 inline-block">
          ← Voltar para a lista de vagas
        </Link>

        {/* HEADER DA VAGA */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
              Assistente de Almoxarifado
            </h1>
            <p className="text-slate-500">Publicada em 10 de março de 2026</p>
            <p className="text-slate-500 font-medium">Inscrições abertas até 09 de maio de 2026</p>
          </div>
        </div>

        {/* INFO TAGS (BASEADO NA SUA IMAGEM) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b border-slate-100 mb-10">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-xl">📍</span>
            <span>São Paulo - SP</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-xl">💼</span>
            <span>Efetivo</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-xl">🏢</span>
            <span>Presencial</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-xl">♿</span>
            <span>Vaga também para PcD</span>
          </div>
        </div>

        {/* CONTEÚDO DA DESCRIÇÃO */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-l-4 border-teal-500 pl-4">
            Descrição da Vaga
          </h2>
          <div className="text-slate-700 leading-relaxed space-y-4">
            <p>
              Estamos em busca de uma <strong>Pessoa Assistente de Almoxarife</strong>. 
              Essa pessoa será responsável pelo controle do estoque físico do almoxarifado, garantindo níveis adequados de materiais para o funcionamento da operação.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Posição:</strong> CLT</li>
              <li><strong>Horário:</strong> Dedicação de 40h semanais (Segunda a Sexta, das 09h às 18h)</li>
            </ul>
          </div>
        </section>

        {/* BOTÃO DE CANDIDATURA */}
        <div className="bg-slate-50 p-8 rounded-2xl flex flex-col items-center">
          <button className="bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold py-4 px-12 rounded-lg transition-all shadow-lg hover:scale-105">
            CANDIDATAR-SE
          </button>
          <p className="mt-4 text-slate-500 text-sm">Você será redirecionado para o formulário de inscrição.</p>
        </div>
      </main>
    </div>
  );
}