import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Phone, ArrowRight, Loader2, GraduationCap, Building2, BookOpen, Calendar } from 'lucide-react';

export function CompleteProfile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem("user_token");

    // 1. Extraímos os valores para garantir que não são nulos antes de converter
    const rawStartDate = formData.get('startDate') as string;
    const rawEndDate = formData.get('endDate') as string;

    // 2. Montamos o payload estruturado exatamente como o backend espera
    const payload = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      education: {
        institution: formData.get('institution'),
        degree: formData.get('degree'),
        fieldOfStudy: formData.get('fieldOfStudy'),
        // Convertemos para ISOString pois o Prisma/Postgres exige esse formato para campos DateTime
        startDate: rawStartDate ? new Date(rawStartDate).toISOString() : null,
        endDate: rawEndDate ? new Date(rawEndDate).toISOString() : null,
      }
    };

    // LOG DE SEGURANÇA: Verifique isso no F12 do navegador!
    console.log("🚀 [FRONTEND] Enviando payload estruturado:", payload);

    try {
      const response = await fetch('http://localhost:3000/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar perfil.");
      }

      toast.success("Perfil e formação salvos com sucesso!");
      
      // Pequeno delay para o usuário ver o feedback antes de ir para a Home
      setTimeout(() => navigate('/'), 1500);

    } catch (error: any) {
      console.error("❌ [FRONTEND] Erro na requisição:", error);
      toast.error(`Falha: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="max-w-2xl w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Finalizar Cadastro</h1>
          <p className="text-slate-500 mt-2">Dados pessoais e sua última formação acadêmica.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SEÇÃO: DADOS PESSOAIS */}
          <div className="space-y-4">
            <h3 className="text-teal-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400" size={20} />
                <input name="fullName" type="text" required placeholder="Nome Completo" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
                <input name="phone" type="tel" required placeholder="Telefone" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SEÇÃO: EDUCAÇÃO */}
          <div className="space-y-4">
            <h3 className="text-teal-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <GraduationCap size={16} /> Última Formação
            </h3>
            
            <div className="relative">
              <Building2 className="absolute left-4 top-4 text-slate-400" size={20} />
              <input name="institution" type="text" required placeholder="Instituição (Ex: USP, Alura, Arrastão)" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <BookOpen className="absolute left-4 top-4 text-slate-400" size={20} />
                <input name="degree" type="text" required placeholder="Grau (Ex: Bacharelado, Técnico)" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-4 text-slate-400" size={20} />
                <input name="fieldOfStudy" type="text" required placeholder="Curso (Ex: Análise de Sistemas)" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-2">Início</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input name="startDate" type="date" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-2">Fim (ou previsão)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input name="endDate" type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-teal-600 transition-all shadow-lg active:scale-95 disabled:bg-slate-300 uppercase tracking-widest">
            {isSubmitting ? (
              <><Loader2 className="animate-spin" /> Salvando...</>
            ) : (
              <><ArrowRight size={20} /> Salvar Perfil Completo</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}