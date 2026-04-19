import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom'; // Importados para a navegação
import { Trash2, User, Calendar, Clock, Briefcase, ChevronDown, ChevronUp, FileText, Users } from 'lucide-react';

interface Candidatura {
  id: number;
  vagaTitulo: string;
  nome: string;
  email: string;
  telefone: string;
  formacao: string;
  area: string;
  turno: string;
  experiencia: string;
  dataInscricao: string;
}

export default function AdminApplications() {
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const location = useLocation(); // Para identificar a aba ativa

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('@arrastao:candidaturas') || '[]');
    const ordenados = dados.sort((a: any, b: any) => 
      new Date(b.dataInscricao).getTime() - new Date(a.dataInscricao).getTime()
    );
    setCandidaturas(ordenados);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Deseja remover esta candidatura permanentemente?")) {
      const novasCandidaturas = candidaturas.filter(c => c.id !== id);
      localStorage.setItem('@arrastao:candidaturas', JSON.stringify(novasCandidaturas));
      setCandidaturas(novasCandidaturas);
      if (expandedId === id) setExpandedId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-6 flex justify-between items-end">
          <div>
            <span className="text-teal-600 font-black text-xs uppercase tracking-[0.2em]">Painel de Controle</span>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Administrativo</h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-bold uppercase">Inscrições: </span>
            <span className="text-teal-600 font-black text-lg">{candidaturas.length}</span>
          </div>
        </header>

        {/* --- NOVO SISTEMA DE ABAS --- */}
        <div className="flex gap-8 border-b border-slate-200 mb-10">
          <Link 
            to="/admin/candidaturas" 
            className={`pb-4 text-[11px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${
              location.pathname === '/admin/candidaturas' 
              ? 'border-b-4 border-teal-500 text-teal-600' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText size={14} />
            CANDIDATURAS
          </Link>
          <Link 
            to="/admin/usuarios" 
            className={`pb-4 text-[11px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${
              location.pathname === '/admin/usuarios' 
              ? 'border-b-4 border-teal-500 text-teal-600' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users size={14} />
            USUÁRIOS DO SISTEMA
          </Link>
        </div>

        {candidaturas.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">Nenhuma candidatura registrada no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {candidaturas.map((c, index) => (
              <motion.div 
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-teal-200 transition-colors"
              >
                {/* O seu código de renderização das candidaturas continua exatamente igual daqui para baixo */}
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <User size={12} /> Candidato
                      </span>
                      <span className="text-slate-800 font-bold leading-tight">{c.nome}</span>
                      <span className="text-slate-500 text-xs truncate">{c.email}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Briefcase size={12} /> Vaga / Formação
                      </span>
                      <span className="text-teal-600 font-black uppercase text-[11px] tracking-tight">{c.vagaTitulo}</span>
                      <span className="text-slate-500 text-[10px] font-medium uppercase">{c.formacao}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Clock size={12} /> Turno
                      </span>
                      <span className="text-slate-700 font-bold capitalize text-sm">{c.turno}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Calendar size={12} /> Data
                      </span>
                      <span className="text-slate-700 font-semibold text-sm">
                        {new Date(c.dataInscricao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
                    <button 
                      onClick={() => toggleExpand(c.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                        expandedId === c.id 
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FileText size={14} />
                      {expandedId === c.id ? 'Fechar' : 'Experiência'}
                      {expandedId === c.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <button 
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-50 text-red-400 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer group"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === c.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="bg-slate-50 border-t border-slate-100"
                    >
                      <div className="p-8 md:px-12 md:py-10">
                        <div className="flex items-start gap-4">
                          <div className="bg-teal-100 p-3 rounded-2xl text-teal-600">
                            <Briefcase size={20} />
                          </div>
                          <div className="space-y-4 flex-1">
                            <div>
                              <h4 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-1">Trajetória Profissional</h4>
                              <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line font-medium bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                {c.experiencia || "Nenhuma experiência detalhada."}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-200">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Área Específica</span>
                                    <span className="text-slate-800 font-bold text-xs">{c.area || 'N/A'}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Contato Direto</span>
                                    <span className="text-slate-800 font-bold text-xs">{c.telefone}</span>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}