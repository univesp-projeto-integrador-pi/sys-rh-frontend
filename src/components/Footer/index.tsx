import { motion } from 'framer-motion';

export function Footer() {
  // URL de placeholder para os objetivos da ONU (ODS)
  const odsImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6vTscB99757YAn-V8uD5O-GbeC6W33vSPlw&s";

  return (
    <footer className="w-full bg-blue-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* COLUNA ESQUERDA: FALE CONOSCO */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
              Fale <span className="text-teal-400">Conosco</span>
            </h3>
            <p className="text-blue-100 text-sm max-w-sm leading-relaxed">
              Tem alguma dúvida sobre o processo seletivo ou quer conhecer mais nossos projetos? Entre em contato.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium">
            <a href="mailto:contato@arrastao.org.br" className="flex items-center gap-3 hover:text-teal-400 transition-colors group">
              <span className="bg-white/10 p-2 rounded-lg group-hover:bg-teal-500/20">📧</span>
              contato@arrastao.org.br
            </a>
            <a href="tel:1158410934" className="flex items-center gap-3 hover:text-teal-400 transition-colors group">
              <span className="bg-white/10 p-2 rounded-lg group-hover:bg-teal-500/20">📞</span>
              (11) 5841-0934
            </a>
            <div className="flex items-center gap-3">
              <span className="bg-white/10 p-2 rounded-lg">📍</span>
              Rua Dr. Joviano de Resende, 42 - São Paulo, SP
            </div>
          </div>

          {/* REDES SOCIAIS NO FOOTER */}
          <div className="flex gap-4 pt-4">
            {['fb', 'ig', 'in', 'yt'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-teal-500 hover:border-teal-500 transition-all duration-300 cursor-pointer uppercase text-xs font-bold"
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>

        {/* COLUNA DIREITA: IMAGEM ONU */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center md:items-end gap-4"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase">Nossa Missão Alinhada à ONU</span>
          <div className="bg-white p-4 rounded-2xl shadow-2xl">
            <img 
              src={odsImage} 
              alt="Objetivos de Desenvolvimento Sustentável ONU" 
              className="w-full max-w-[400px] h-auto object-contain"
            />
          </div>
          <p className="text-[10px] text-blue-300/60 italic text-right max-w-[300px]">
            Trabalhamos para reduzir as desigualdades e promover educação de qualidade através do acolhimento.
          </p>
        </motion.div>
      </div>

      {/* COPYRIGHT */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-[10px] text-blue-300/50 uppercase tracking-widest">
        © 2026 Projeto Arrastão - Todos os direitos reservados
      </div>
    </footer>
  );
}