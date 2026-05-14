import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, UserCheck, Loader2, LogOut, FileText } from 'lucide-react';

/* ── Rotas de navegação ── */
const navLinks = [
  { label: 'INÍCIO',   url: '/',                               isInternal: true },
  { label: 'SOBRE',    url: 'https://www.arrastao.org.br/sobre'                 },
  { label: 'PROJETOS', url: 'https://www.arrastao.org.br/projetos'              },
  { label: 'CONTATO',  url: 'https://www.arrastao.org.br/contato'               },
];

/* ── Títulos do banner por rota ── */
const bannerTitles: Record<string, JSX.Element> = {
  '/': (
    <>Oportunidades <br />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            className="text-teal-400">em Aberto</span>
    </>
  ),
  admin: (
    <>Painel <br />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            className="text-teal-400">Administrativo</span>
    </>
  ),
  vaga: (
    <>Detalhes da <br />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            className="text-teal-400">Vaga</span>
    </>
  ),
  default: (
    <>Área do <br />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            className="text-teal-400">Candidato</span>
    </>
  ),
};

function getBannerTitle(pathname: string) {
  if (pathname === '/')            return bannerTitles['/'];
  if (pathname.includes('/admin')) return bannerTitles.admin;
  if (pathname.includes('/vaga'))  return bannerTitles.vaga;
  return bannerTitles.default;
}

/* ── Link de navegação com underline animado ── */
function NavLink({ label, url, isInternal, active }: {
  label: string; url: string; isInternal?: boolean; active?: boolean;
}) {
  const base  = 'relative flex flex-col items-center gap-[3px] transition-colors duration-300 group/nl';
  const color = active ? 'text-teal-400' : 'text-white/80 hover:text-white';
  const style: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.18em',
  };

  const inner = (
    <>
      {label}
      <span className={`h-[1.5px] bg-teal-400 rounded-full transition-all duration-500 ease-out
        ${active ? 'w-full' : 'w-0 group-hover/nl:w-full'}`}
      />
    </>
  );

  if (isInternal) {
    return <Link to={url} className={`${base} ${color}`} style={style}>{inner}</Link>;
  }
  return (
    <a href={url} target="_blank" rel="noreferrer"
       className={`${base} ${color}`} style={style}>{inner}</a>
  );
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════ */
export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [hasProfile,        setHasProfile]        = useState<boolean | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [isScrolled,        setIsScrolled]        = useState(false);

  const token    = localStorage.getItem('user_token');
  const userJson = localStorage.getItem('logged_user');
  const user     = userJson ? JSON.parse(userJson) : null;

  const isAuthenticated = !!token;
  const userIsAdmin     = user?.role?.toUpperCase() === 'ADMIN';
  const firstName       = user?.name?.split(' ')[0] ?? 'Usuário';
  const avatarInitial   = firstName.charAt(0).toUpperCase();

  /* Scroll */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Verifica perfil */
  useEffect(() => {
    if (!isAuthenticated || userIsAdmin) return;
    (async () => {
      try {
        setIsCheckingProfile(true);
        const res = await fetch('http://localhost:3000/api/v1/candidates-external/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasProfile(res.ok ? true : res.status === 404 ? false : null);
      } catch {
        console.error('Erro ao verificar perfil');
      } finally {
        setIsCheckingProfile(false);
      }
    })();
  }, [isAuthenticated, userIsAdmin, token, location.pathname]);

  const handleLogout = () => {
    ['user_token', 'user_name', 'logged_user'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
    window.location.reload();
  };

  /* Parallax no banner */
  const bannerRef     = useRef<HTMLDivElement>(null);
  const { scrollY }   = useScroll();
  const bgY           = useTransform(scrollY, [0, 400], ['0%', '20%']);

  /* ── Render ── */
  const isMyApplications = location.pathname === '/minhas-candidaturas';
  const hideBanner = isMyApplications; // mesma lógica, só renomeei para clareza

  return (
    <div ref={bannerRef} className="relative w-full font-sans overflow-hidden shadow-xl">

      {/* Background com parallax (exibido apenas se não estiver em /minhas-candidaturas) */}
      {!hideBanner && (
        <>
          <motion.div
            style={{
              y: bgY,
              backgroundImage: `url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000')`,
            }}
            className="absolute inset-0 bg-cover bg-center scale-110"
          />

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80 z-[1]" />
          {/* Grain sutil */}
          <div className="absolute inset-0 z-[2] opacity-[0.03]"
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
          {/* Linha de luz no topo */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent z-[3]" />
        </>
      )}

      {/* ─── NAV ─── */}
      <motion.nav
        initial={false}
        animate={
          isMyApplications
            ? // Em /minhas-candidaturas, barra sempre visível (estado "scrolled")
              { backgroundColor: 'rgba(10,20,30,0.96)', backdropFilter: 'blur(16px)', paddingTop: '12px', paddingBottom: '12px' }
            : isScrolled
              ? { backgroundColor: 'rgba(10,20,30,0.96)', backdropFilter: 'blur(16px)', paddingTop: '12px', paddingBottom: '12px' }
              : { backgroundColor: 'transparent',          backdropFilter: 'blur(0px)',   paddingTop: '22px', paddingBottom: '22px' }
        }
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full z-50"
        style={{
          borderBottom: (isMyApplications || isScrolled)
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center text-white">

          {/* Links + Auth */}
          <div className="hidden lg:flex items-center ml-auto">

            {/* Nav links */}
            <div className="flex items-center gap-14">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, ease: 'easeOut' }}
                >
                  <NavLink
                    {...link}
                    active={link.isInternal && location.pathname === link.url}
                  />
                </motion.div>
              ))}
            </div>

            {/* Divisor vertical */}
            <div className="mx-10 h-5 w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent" />

            {/* ── Auth area ── */}
            <AnimatePresence mode="wait">
              {isAuthenticated ? (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                >
                  {/* ── ADMIN ── */}
                  {userIsAdmin ? (
                    <div className="flex items-center gap-3">
                      <Link
                        to="/admin/usuarios"
                        className="flex items-center gap-2 relative overflow-hidden
                          border border-teal-500/40 px-4 py-2 rounded-md
                          text-teal-400 transition-all duration-300 group/btn
                          hover:border-teal-400 hover:text-white"
                        style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 800, letterSpacing: '0.15em' }}
                      >
                        <span className="absolute inset-0 bg-teal-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0" />
                        <ShieldCheck size={13} className="relative z-10" />
                        <span className="relative z-10">ADMIN</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 relative overflow-hidden
                          border border-white/20 px-4 py-2 rounded-md
                          text-white/80 transition-all duration-300 group/logoutbtn
                          hover:border-red-500 hover:text-white"
                        style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 800, letterSpacing: '0.15em' }}
                      >
                        <span className="absolute inset-0 bg-red-500 translate-y-full group-hover/logoutbtn:translate-y-0 transition-transform duration-300 ease-out z-0" />
                        <LogOut size={13} className="relative z-10 group-hover/logoutbtn:text-white" />
                        <span className="relative z-10">SAIR</span>
                      </button>
                    </div>

                  /* ── COMPLETAR PERFIL (sem perfil ainda) ── */
                  ) : hasProfile === false ? (
                    <Link
                      to="/completar-perfil"
                      className="flex items-center gap-2 relative overflow-hidden
                        border border-amber-500/40 px-4 py-2 rounded-md
                        text-amber-400 hover:border-amber-400 hover:text-white
                        transition-all duration-300 group/btn"
                      style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 800, letterSpacing: '0.15em' }}
                    >
                      <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0" />
                      <span className="relative z-10">
                        {isCheckingProfile ? <Loader2 size={13} className="animate-spin" /> : <UserCheck size={13} />}
                      </span>
                      <span className="relative z-10">COMPLETAR PERFIL</span>
                    </Link>

                  /* ── DROPDOWN "MINHA CONTA" (com perfil) ── */
                  ) : (
                    <div className="relative group/menu">

                      {/* Trigger */}
                      <button
                        className="flex items-center gap-2.5 border border-white/20
                          pl-1.5 pr-3.5 py-1.5 rounded-full
                          text-white/80 hover:text-white hover:border-white/40
                          transition-all duration-300 cursor-pointer group/trigger"
                        style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em' }}
                      >
                        {/* Avatar com inicial */}
                        {isCheckingProfile ? (
                          <span className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/40
                            flex items-center justify-center shrink-0">
                            <Loader2 size={12} className="animate-spin text-teal-400" />
                          </span>
                        ) : (
                          <span
                            className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center
                              text-white shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.4)]
                              group-hover/trigger:shadow-[0_0_16px_rgba(20,184,166,0.6)]
                              transition-shadow duration-300"
                            style={{ fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 800 }}
                          >
                            {avatarInitial}
                          </span>
                        )}
                        {firstName.toUpperCase()}
                        {/* Chevron */}
                        <svg
                          className="w-2.5 h-2.5 opacity-40 group-hover/menu:rotate-180 transition-transform duration-300 ease-out"
                          fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l4 4 4-4" />
                        </svg>
                      </button>

                      {/* ── Painel do dropdown ── */}
                      <div
                        className="absolute right-0 top-full pt-3 w-56 z-50
                          opacity-0 pointer-events-none translate-y-1
                          group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0
                          transition-all duration-200 ease-out"
                      >
                        {/* Seta decorativa */}
                        <div className="absolute top-[6px] right-4 w-3 h-3 rotate-45
                          bg-[rgba(10,18,28,0.98)] border-l border-t border-white/10 z-10" />

                        <div className="bg-[rgba(10,18,28,0.98)] backdrop-blur-xl
                          border border-white/10 rounded-xl overflow-hidden
                          shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
                        >
                          {/* Cabeçalho com nome e saudação */}
                          <div className="px-4 py-3.5 flex items-center gap-3 border-b border-white/[0.06]">
                            <span
                              className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center
                                text-white shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.35)]"
                              style={{ fontFamily: "'Syne', sans-serif", fontSize: '12px', fontWeight: 800 }}
                            >
                              {avatarInitial}
                            </span>
                            <div>
                              <p
                                className="text-white leading-none"
                                style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: 700 }}
                              >
                                {firstName}
                              </p>
                              <p
                                className="text-white/35 mt-0.5 italic"
                                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px' }}
                              >
                                candidato
                              </p>
                            </div>
                          </div>

                          {/* Itens de menu */}
                          <div className="py-1.5">
                            <Link
                              to="/meu-perfil"
                              className="flex items-center gap-3 px-4 py-2.5
                                text-white/60 hover:text-white hover:bg-white/[0.04]
                                transition-all duration-150 group/item"
                              style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em' }}
                            >
                              <span className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/20
                                flex items-center justify-center shrink-0
                                group-hover/item:bg-teal-500/20 group-hover/item:border-teal-500/40
                                transition-colors duration-150">
                                <UserCheck size={11} className="text-teal-400" />
                              </span>
                              MEU PERFIL
                            </Link>

                            <Link
                              to="/minhas-candidaturas"
                              className="flex items-center gap-3 px-4 py-2.5
                                text-white/60 hover:text-white hover:bg-white/[0.04]
                                transition-all duration-150 group/item"
                              style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em' }}
                            >
                              <span className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/20
                                flex items-center justify-center shrink-0
                                group-hover/item:bg-teal-500/20 group-hover/item:border-teal-500/40
                                transition-colors duration-150">
                                <FileText size={11} className="text-teal-400" />
                              </span>
                              MINHAS CANDIDATURAS
                            </Link>
                          </div>

                          {/* Divisor + Sair */}
                          <div className="border-t border-white/[0.06] py-1.5">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5
                                text-white/40 hover:text-red-400 hover:bg-red-500/[0.06]
                                transition-all duration-150 cursor-pointer group/logout"
                              style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em' }}
                            >
                              <span className="w-6 h-6 rounded-md bg-white/5 border border-white/10
                                flex items-center justify-center shrink-0
                                group-hover/logout:bg-red-500/10 group-hover/logout:border-red-500/20
                                transition-colors duration-150">
                                <LogOut size={11} className="group-hover/logout:text-red-400 transition-colors" />
                              </span>
                              SAIR
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

              ) : (
                /* ── Visitante: botão de login ── */
                <motion.div
                  key="guest"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                >
                  <Link
                    to="/login"
                    className="relative overflow-hidden flex items-center gap-2
                      bg-teal-500 hover:bg-teal-400 px-6 py-2.5 rounded-md
                      text-white transition-all duration-300
                      shadow-[0_4px_24px_rgba(20,184,166,0.3)]
                      hover:shadow-[0_4px_32px_rgba(20,184,166,0.5)]
                      active:scale-95"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 800, letterSpacing: '0.18em' }}
                  >
                    ÁREA DO CANDIDATO
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* ─── BANNER (exibido apenas se não estiver em /minhas-candidaturas) ─── */}
      {!hideBanner && (
        <>
          <div className="relative z-10 h-[480px] flex flex-col items-center justify-center gap-6 pt-16">

            {/* Chip decorativo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 border border-teal-400/30 px-4 py-1.5 rounded-full
                bg-teal-400/5 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span
                className="text-teal-400/80 tracking-[0.2em]"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 700 }}
              >
                PROJETO INTEGRADOR
              </span>
            </motion.div>

            {/* Título do banner */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={location.pathname}
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                exit={{   opacity: 0, y: -16, filter: 'blur(4px)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-white text-center leading-none drop-shadow-2xl"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                }}
              >
                {getBannerTitle(location.pathname)}
              </motion.h1>
            </AnimatePresence>

            {/* Linha decorativa */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="w-16 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full"
            />
          </div>

          {/* Fade-out na base */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent z-[4]" />
        </>
      )}
    </div>
  );
}