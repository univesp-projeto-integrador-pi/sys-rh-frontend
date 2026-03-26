import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react'; // Ícone de segurança para o Admin
import logoImg from '../../assets/logoarrastao.png';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verifica se o token existe (usuário logado)
  const isAuthenticated = !!localStorage.getItem("user_token");
  const userName = localStorage.getItem("user_name") || "Usuário";

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");
    navigate("/login");
    window.location.reload(); 
  };

  const navLinks = [
    { label: 'INÍCIO', url: 'https://www.arrastao.org.br' },
    { label: 'SOBRE', url: 'https://www.arrastao.org.br/sobre' },
    { label: 'PROJETOS', url: 'https://www.arrastao.org.br/projetos' },
    { label: 'VAGAS', url: '/', isInternal: true },
    { label: 'CONTATO', url: 'https://www.arrastao.org.br/contato' },
  ];

  return (
    <div 
      className="relative w-full bg-cover bg-center font-sans overflow-hidden shadow-lg"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000')` 
      }}
    >
      {}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logoImg} alt="Logo" className="w-24 h-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </Link>

        <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold tracking-[0.1em]">
          {navLinks.map((link, index) => {
            const isVagas = link.label === 'VAGAS';
            return (
              <motion.div key={link.label} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                {link.isInternal ? (
                  <Link to={link.url} className={`relative py-2 transition-all duration-300 cursor-pointer ${isVagas ? 'text-teal-400' : 'hover:text-teal-400'} group/link`}>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-teal-400 transition-all duration-300 ${isVagas ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                  </Link>
                ) : (
                  <a href={link.url} target="_blank" rel="noreferrer" className="relative py-2 transition-all duration-300 cursor-pointer hover:text-teal-400 group/link">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover/link:w-full"></span>
                  </a>
                )}
              </motion.div>
            );
          })}

          <div className="h-4 w-[1px] bg-white/20"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              {/* NOVO BOTÃO DE ADMIN - Aparece apenas se logado */}
              <Link 
                to="/admin/candidaturas" 
                className="flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500 border border-teal-500/50 px-3 py-1.5 rounded text-[10px] font-black text-teal-400 hover:text-white transition-all duration-300 group"
              >
                <ShieldCheck size={14} className="group-hover:rotate-12 transition-transform" />
                ADMIN
              </Link>

              <div className="flex flex-col items-end">
                <span className="text-teal-400 lowercase italic text-[11px]">Olá, {userName}</span>
                <button 
                  onClick={handleLogout} 
                  className="text-[10px] text-white/50 hover:text-red-400 font-bold cursor-pointer transition-all uppercase tracking-tighter"
                >
                  [ Sair ]
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-teal-500 hover:bg-teal-600 px-5 py-2.5 rounded-lg text-white font-bold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 active:scale-95 text-[11px] tracking-widest"
            >
              ÁREA DO CANDIDATO
            </Link>
          )}
        </div>
      </nav>

      {/* Título Centralizado do Banner */}
      <div className="relative z-10 h-[350px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1 
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter text-center"
          >
            {location.pathname === '/' ? (
              <>Oportunidades <br /> <span className="text-teal-400">em Aberto</span></>
            ) : location.pathname.includes('/admin') ? (
              <>Painel <br /> <span className="text-teal-400">Administrativo</span></>
            ) : location.pathname.includes('/vaga') ? (
              <>Detalhes da <br /> <span className="text-teal-400">Vaga</span></>
            ) : (
              <>Área do <br /> <span className="text-teal-400">Candidato</span></>
            )}
          </motion.h1>
        </AnimatePresence>
      </div>
    </div>
  );
}