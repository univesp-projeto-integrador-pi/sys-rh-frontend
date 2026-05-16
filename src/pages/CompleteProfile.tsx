import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Phone, ArrowRight, Loader2, GraduationCap, Building2, BookOpen, Calendar } from 'lucide-react';

// ... (mantenha os imports)

export function CompleteProfile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem("user_token");

    const rawStartDate = formData.get('startDate') as string;
    const rawEndDate = formData.get('endDate') as string;

    // Montamos o objeto garantindo strings puras
    const payload = {
      fullName: String(formData.get('fullName')),
      phone: String(formData.get('phone')),
      education: {
        institution: String(formData.get('institution')),
        degree: String(formData.get('degree')),
        fieldOfStudy: String(formData.get('fieldOfStudy')),
        startDate: rawStartDate ? new Date(rawStartDate).toISOString() : null,
        endDate: rawEndDate ? new Date(rawEndDate).toISOString() : null,
      }
    };

    console.log("🚀 [FRONTEND] Enviando para /candidates-external:", payload);

    try {
      const response = await fetch('import.meta.env.VITE_API_URL/api/v1/candidates-external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o erro for de validação (array de erros), pegamos a primeira mensagem
        const errorMsg = Array.isArray(data) ? data[0].message : data.message;
        throw new Error(errorMsg || "Erro ao salvar perfil.");
      }

      toast.success("Perfil salvo com sucesso!");
      setTimeout(() => navigate('/'), 1500);

    } catch (error: any) {
      console.error("❌ [FRONTEND] Erro:", error);
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