import { useParams, useNavigate } from 'react-router-dom';
import { allJobs } from '../data/jobs';

export function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vaga = allJobs.find(j => j.id === Number(id));

  if (!vaga) return <div>Vaga não encontrada</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Candidatura enviada com sucesso para " + vaga.company);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Candidatura para a vaga:</h1>
        <p className="text-teal-600 font-bold mb-8 text-xl">{vaga.role}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Pretensão Salarial</label>
              <input type="number" required className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="R$ 0,00" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Disponibilidade de Início</label>
              <input type="date" required className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Por que você quer esta vaga?</label>
            <textarea required rows={4} className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Conte um pouco sobre sua experiência..."></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition shadow-lg">
            ENVIAR CANDIDATURA
          </button>
        </form>
      </div>
    </div>
  );
}