import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Building, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  salary?: string;
  department?: { name: string };
}

export function JobDetails() {
  const { id } = useParams<{ id: string }>(); // Captura o ID da URL
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        // ⚠️ Verifique se a URL do seu backend para buscar UMA vaga é essa:
        const response = await fetch(`http://localhost:3000/api/v1/jobs-available/${id}`);
        
        if (!response.ok) {
          throw new Error('Vaga não encontrada');
        }

        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar os detalhes da vaga.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Vaga não encontrada</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-teal-600 font-bold">
          Voltar para a home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <header className="mb-8 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-4 mb-4">
             <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-black uppercase">
              {job.department?.name || 'Geral'}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{job.title}</h1>
        </header>

        <div className="space-y-8 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Briefcase size={20} className="text-teal-500" /> Descrição da Vaga
            </h2>
            <p className="leading-relaxed whitespace-pre-line">{job.description}</p>
          </section>

          <button 
            onClick={() => navigate(`/vaga/${id}/candidatar`)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-200"
          >
            Candidatar-se agora
          </button>
        </div>
      </div>
    </div>
  );
}