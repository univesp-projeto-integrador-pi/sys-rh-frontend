import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react'; // Instale lucide-react ou use emojis
import { allJobs } from '../data/jobs';

export function ApplicationForm() {
  const { id } = useParams();
  const vaga = allJobs.find(j => j.id === Number(id));

  // ESTADOS DO FORMULÁRIO
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formacao, setFormacao] = useState('');

  if (!vaga) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Vaga não encontrada</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    // 1. Coleta os dados do formulário de forma técnica
    const formData = new FormData(e.currentTarget);
    const payload = {
      id: Date.now(), // ID temporário
      vagaId: id,
      vagaTitulo: vaga.role,
      nome: formData.get('nome'),
      email: formData.get('email'),
      telefone: formData.get('telefone'),
      formacao: formData.get('formacao'),
      area: formData.get('area') || 'N/A',
      experiencia: formData.get('experiencia'),
      turno: formData.get('turno'),
      dataInicio: formData.get('dataInicio'),
      dataInscricao: new Date().toISOString()
    };

    // 2. Simulação de Latência de Rede (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Persistência no LocalStorage (Simulando o Banco de Dados)
    const candidaturasAntigas = JSON.parse(localStorage.getItem('@arrastao:candidaturas') || '[]');
    localStorage.setItem('@arrastao:candidaturas', JSON.stringify([...candidaturasAntigas, payload]));

    setIsSending(false);
    setIsSuccess(true);
  };

  const inputStyle = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all text-slate-700 disabled:opacity-50";
  const labelStyle = "block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2";

  // TELA DE SUCESSO ANIMADA
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Inscrição Confirmada!</h2>
          <p className="text-slate-500 mt-4 leading-relaxed">
            Sua candidatura para <strong>{vaga.role}</strong> foi registrada com sucesso em nossa base de talentos.
          </p>
          <div className="mt-8 space-y-3">
            <Link to="/" className="block w-full bg-teal-500 text-white font-black py-4 rounded-xl hover:bg-teal-600 transition-all uppercase tracking-widest text-sm">
              Voltar para Vagas
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
          <div>
            <span className="text-teal-400 text-xs font-black uppercase tracking-widest">Inscrição Online</span>
            <h1 className="text-4xl font-black uppercase tracking-tighter mt-2">{vaga.role}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-12">
          {/* SEÇÃO 1: DADOS PESSOAIS */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">1. Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelStyle}>Nome Completo</label>
                <input name="nome" type="text" required className={inputStyle} disabled={isSending} />
              </div>
              <div>
                <label className={labelStyle}>E-mail</label>
                <input name="email" type="email" required className={inputStyle} disabled={isSending} />
              </div>
              <div>
                <label className={labelStyle}>Telefone</label>
                <input name="telefone" type="tel" required placeholder="(11) 99999-9999" className={inputStyle} disabled={isSending} />
              </div>
            </div>
          </section>

          {/* SEÇÃO 2: FORMAÇÃO E EXPERIÊNCIA */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">2. Formação e Experiência</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={['superior_inc', 'superior', 'pos'].includes(formacao) ? "md:col-span-1" : "md:col-span-2"}>
                <label className={labelStyle}>Grau de Formação</label>
                <select 
                  name="formacao"
                  required 
                  className={inputStyle}
                  value={formacao}
                  onChange={(e) => setFormacao(e.target.value)}
                  disabled={isSending}
                >
                  <option value="">Selecione...</option>
                  <option value="medio">Ensino Médio</option>
                  <option value="tecnico">Ensino Técnico</option>
                  <option value="superior_inc">Superior Incompleto</option>
                  <option value="superior">Superior Complet</option>
                  <option value="pos">Pós-graduação / MBA</option>
                </select>
              </div>

              <AnimatePresence>
                {['superior_inc', 'superior', 'pos'].includes(formacao) && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="md:col-span-1">
                    <label className={labelStyle}>Área de Formação / Curso</label>
                    <input name="area" type="text" required className={inputStyle} disabled={isSending} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="md:col-span-2">
                <label className={labelStyle}>Resumo da Experiência</label>
                <textarea name="experiencia" rows={4} required className={`${inputStyle} resize-none`} disabled={isSending}></textarea>
              </div>
            </div>
          </section>

          {/* SEÇÃO 3: DISPONIBILIDADE */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">3. Disponibilidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Turno Disponível</label>
                <select name="turno" required className={inputStyle} disabled={isSending}>
                  <option value="">Selecione...</option>
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="noite">Noite</option>
                  <option value="integral">Integral</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Data de Início</label>
                <input name="dataInicio" type="date" required className={inputStyle} disabled={isSending} />
              </div>
            </div>
          </section>

          <div className="pt-10 flex flex-col md:flex-row gap-6">
            <button 
              type="submit" 
              disabled={isSending}
              className="flex-1 bg-teal-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all cursor-pointer hover:bg-teal-600 disabled:bg-slate-300 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isSending ? (
                <><Loader2 className="animate-spin" /> PROCESSANDO...</>
              ) : "FINALIZAR CANDIDATURA"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}