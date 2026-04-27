import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Department {
  id: string | number;
  name: string;
}

export function CreateJob() {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  // 1. Busca os departamentos do banco de dados
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('user_token');
        const response = await fetch('http://localhost:3000/api/departments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log("Resposta do Backend (Dept):", data);

        // Se o backend retornar { data: [...] } ou direto o [...]
        const list = Array.isArray(data) ? data : (data.data || []);
        setDepartments(list);
      } catch (error) {
        console.error("Erro ao carregar departamentos:", error);
        toast.error("Não foi possível carregar os departamentos.");
        setDepartments([]); // Garante que continue sendo um array para não quebrar o .map
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem('user_token');

    // Monta o payload conforme sua tabela job_positions
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: 'OPEN',
      departmentId: formData.get('departmentId'), // Aqui enviará "1" conforme sua imagem
    };

    try {
      const response = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar vaga");
      }

      toast.success("Vaga publicada com sucesso!");
      navigate('/'); 
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const inputStyle = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-700 disabled:opacity-50";
  const labelStyle = "block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-6 transition-colors font-bold uppercase text-xs tracking-widest">
          <ArrowLeft size={16} /> Voltar para o Mural
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 p-8 text-white flex items-center gap-4">
            <div className="p-3 bg-teal-500 rounded-2xl">
              <Briefcase size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Cadastrar Nova Vaga</h1>
              <p className="text-slate-400 text-xs font-medium">Preencha os dados para publicação imediata</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className={labelStyle}>Título da Vaga</label>
              <input name="title" type="text" placeholder="Ex: Desenvolvedor Full Stack" required className={inputStyle} disabled={isSending} />
            </div>

            <div>
              <label className={labelStyle}>Departamento Responsável</label>
              <select name="departmentId" required className={inputStyle} disabled={isSending}>
                <option value="">Selecione um departamento...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Descrição da Vaga e Requisitos</label>
              <textarea name="description" rows={6} placeholder="Descreva as responsabilidades, requisitos técnicos e benefícios..." required className={`${inputStyle} resize-none`} disabled={isSending} />
            </div>

            <button 
              type="submit" 
              disabled={isSending}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-teal-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isSending ? (
                <><Loader2 className="animate-spin" /> PROCESSANDO...</>
              ) : (
                <><Save size={20} /> PUBLICAR VAGA AGORA</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}