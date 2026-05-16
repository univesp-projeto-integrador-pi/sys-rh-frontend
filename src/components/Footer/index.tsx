import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function Footer() {
  const location = useLocation();
  const isMyApplications = location.pathname === '/minhas-candidaturas';

  const odsImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6vTscB99757YAn-V8uD5O-GbeC6W33vSPlw&s";

  return (
    <footer className={`w-full bg-slate-800 text-white/80 py-6 ${isMyApplications ? 'mt-auto' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* COLUNA 1 – Institucional */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <h4
            className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Instituição
          </h4>
          <ul className="space-y-1.5 text-sm font-medium">
            <li>
              <a
                href="https://www.arrastao.org.br/sobre"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Quem somos
              </a>
            </li>
            <li>
              <a
                href="https://www.arrastao.org.br/projetos"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Projetos
              </a>
            </li>
            <li>
              <a
                href="https://www.arrastao.org.br/contato"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Contato
              </a>
            </li>
          </ul>
        </motion.div>

        {/* COLUNA 2 – Para Candidatos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h4
            className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Candidato
          </h4>
          <ul className="space-y-1.5 text-sm font-medium">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Vagas abertas
              </Link>
            </li>
            <li>
              <Link to="/minhas-candidaturas" className="hover:text-white transition-colors">
                Minhas candidaturas
              </Link>
            </li>
            <li>
              <Link to="/meu-perfil" className="hover:text-white transition-colors">
                Meu perfil
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* COLUNA 3 – Missão ONU + Redes Sociais (ainda mais compacto) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-md">
              <img
                src={odsImage}
                alt="ODS ONU"
                className="w-14 h-auto object-contain"
              />
            </div>
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-wider text-teal-300"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Alinhado à ONU
              </p>
              <p className="text-xs text-white/50 italic mt-0.5">
                Redução das desigualdades
              </p>
            </div>
          </div>

          {/* Redes sociais */}
          <div className="flex gap-2 pt-1">
            {['fb', 'ig', 'in', 'yt'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center
                  hover:bg-teal-500 hover:border-teal-500 transition-all duration-300
                  text-[10px] font-bold uppercase"
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Copyright – linha fina */}
      <div className="max-w-7xl mx-auto px-6 mt-6 pt-4 border-t border-white/10 text-center text-[10px] text-white/40 uppercase tracking-wider">
        © 2026 Projeto Integrador • Todos os direitos reservados
      </div>
    </footer>
  );
}