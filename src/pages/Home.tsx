import { useState, useEffect } from 'react';
import { Search, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  department?: {
    name: string;
  };
}

export function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // 🚀 Novo estado para controlar a visibilidade do banner
  const [hasProfile, setHasProfile] = useState<boolean>(true); // Começa como true para não dar "flicker"

  const token = localStorage.getItem("user_token");
  const userJson = localStorage.getItem("logged_user");
  const user = userJson ? JSON.parse(userJson) : null;
  const isAuthenticated = !!token;
  const isNotAdmin = isAuthenticated && user?.role?.toUpperCase() !== 'ADMIN';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1. Buscar Vagas
        const jobsResponse = await fetch('http://localhost:3000/api/jobs/open');
        const jobsData = await jobsResponse.json();
        const finalJobs = Array.isArray(jobsData) ? jobsData : (jobsData.data || []);
        setJobs(finalJobs);

        // 2. Verificar Perfil (apenas se for candidato logado)
        if (isNotAdmin) {
          const profileResponse = await fetch('http://localhost:3000/api/candidates/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          // Se o status for 404, significa que o perfil de candidato NÃO existe
          if (profileResponse.status === 404) {
            setHasProfile(false);
          } else if (profileResponse.ok) {
            setHasProfile(true);
          }
        }
      } catch (error) {
        console.error("Erro na sincronização:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isNotAdmin, token]);

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      
      {/* 🚀 Banner exibido apenas se logado, não-admin e SEM perfil completo */}
      {isNotAdmin && !hasProfile && (
        <div className="mb-8 bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 text-amber-800">
            <AlertCircle size={24} className="text-amber-600" />
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider">Atenção, Candidato!</h3>
              <p className="text-xs mt-1">Para se candidatar às nossas vagas, é necessário finalizar o preenchimento do seu perfil.</p>
            </div>
          </div>
          <Link 
            to="/completar-perfil" 
            className="whitespace-nowrap bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-md active:scale-95"
          >
            Completar Agora
          </Link>
        </div>
      )}

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          Mural de Oportunidades
        </h1>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por cargo ou tecnologia..."
            className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold uppercase tracking-widest text-xs">Sincronizando vagas...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">Nenhuma vaga aberta no momento.</p>
        </div>
      )}
    </div>
  );
}