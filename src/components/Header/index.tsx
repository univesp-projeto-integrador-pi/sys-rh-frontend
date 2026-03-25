import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Importação do Framer Motion
import logoImg from '../../assets/logoarrastao.png';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para detectar mudança de rota
  
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
    { label: 'CONTATO', url: 'https://www.arrastao.org.br/contato' },
  ];

  return (
    <div className="relative w-full bg-cover bg-center font-sans overflow-hidden" 
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000')` }}>
      
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logoImg} alt="Logo" className="w-24 h-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </Link>

        <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold tracking-[0.1em]">
          {navLinks.map((link, index) => (
            <motion.a 
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} // Efeito cascata nos links
              href={link.url} 
              target="_blank" 
              rel="noreferrer" 
              className="relative py-2 transition-colors duration-300 hover:text-teal-400 group/link"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover/link:w-full"></span>
            </motion.a>
          ))}

          <div className="h-4 w-[1px] bg-white/20"></div>

          {isAuthenticated ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4"
            >
              <span className="text-teal-400 lowercase italic">Olá, {userName}</span>
              <button onClick={handleLogout} className="...">SAIR</button>
            </motion.div>
          ) : (
            <Link to="/login" className="...">ÁREA DO CANDIDATO</Link>
          )}
        </div>
      </nav>

      {/* TÍTULO COM ANIMAÇÃO DE ENTRADA TODA VEZ QUE MUDA A ROTA */}
      <div className="relative z-10 h-[350px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1 
            key={location.pathname} // A mágica está aqui: muda a rota, reinicia a animação
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter text-center"
          >
            {location.pathname === '/' ? (
              <>Projetos que <br /> <span className="text-teal-400">Transformam</span></>
            ) : location.pathname.includes('/vaga') ? (
              <>Detalhes da <br /> <span className="text-teal-400">Oportunidade</span></>
            ) : (
              <>Área do <br /> <span className="text-teal-400">Candidato</span></>
            )}
          </motion.h1>
        </AnimatePresence>
      </div>
    </div>
  );
}