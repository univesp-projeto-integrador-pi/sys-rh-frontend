import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ApplicationForm() {
  const { id } = useParams(); // ID da vaga (UUID)
  const navigate = useNavigate();

  // ESTADOS
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);

  // 1. Busca o perfil do candidato para saber se ele pode se candidatar
  useEffect(() => {
    const checkProfile = async () => {
      const token = localStorage.getItem("user_token");
      if (!token) {
        toast.error("Faça login para continuar.");
        return navigate('/login');
      }

      try {
        const response = await fetch('http://localhost:3000/api/v1/candidates-external/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 404) {
          // Usuário logado mas sem perfil de candidato
          setCandidateProfile(null);
        } else if (response.ok) {
          const data = await response.json();
          setCandidateProfile(data);
        }
      } catch (err) {
        console.error("Erro ao verificar perfil:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkProfile();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const token = localStorage.getItem("user_token");

    try {
      const response = await fetch('http://localhost:3000/api/v1/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ positionId: id }), // O backend blindado só precisa disso!
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) throw new Error("Você já se candidatou para esta vaga!");
        throw new Error(errorData.message || "Erro ao processar candidatura.");
      }

      setIsSuccess(true);
      toast.success("Candidatura enviada com sucesso!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };

  // TELA DE CARREGAMENTO
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-500" size={40} />
      </div>
    );
  }

  // TELA CASO NÃO TENHA PERFIL DE CANDIDATO
  if (!candidateProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-amber-100">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h2 className="text-2xl font-black text-slate-900 uppercase">Perfil Incompleto</h2>
          <p className="text-slate-500 mt-4">
            Para se candidatar, precisamos que você complete seus dados de contato (Nome e Telefone).
          </p>
          <button 
            onClick={() => navigate('/completar-perfil')} 
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-teal-600 transition-all"
          >
            Completar Perfil agora
          </button>
        </div>
      </div>
    );
  }

  // TELA DE SUCESSO
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center">
          <CheckCircle className="text-teal-500 mx-auto mb-6" size={60} />
          <h2 className="text-3xl font-black text-slate-900">Tudo pronto!</h2>
          <p className="text-slate-500 mt-4">Sua candidatura foi registrada e o RH já pode visualizar seu perfil.</p>
          <Link to="/" className="block mt-8 w-full bg-teal-500 text-white font-black py-4 rounded-xl uppercase tracking-widest text-sm">Voltar ao Início</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-xs font-bold uppercase transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <h1 className="text-3xl font-black uppercase">Confirmar Candidatura</h1>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
            <h3 className="text-teal-800 font-bold mb-2">Dados do Candidato</h3>
            <p className="text-sm text-teal-700"><strong>Nome:</strong> {candidateProfile.fullName}</p>
            <p className="text-sm text-teal-700"><strong>E-mail:</strong> {candidateProfile.email}</p>
            <p className="text-sm text-teal-700"><strong>Telefone:</strong> {candidateProfile.phone || 'Não informado'}</p>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed">
            Ao clicar no botão abaixo, os dados acima e o seu currículo cadastrado serão enviados para a equipe de recrutamento desta vaga.
          </p>

          <button 
            onClick={handleSubmit}
            disabled={isSending}
            className="w-full bg-teal-500 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-teal-600 disabled:bg-slate-300 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {isSending ? <><Loader2 className="animate-spin" /> Processando...</> : "Confirmar Minha Inscrição"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}