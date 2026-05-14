import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Briefcase, Loader2, AlertCircle, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/*
  Fontes (adicione no index.html se ainda não estiver):
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400;1,700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
*/

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt?: string;
  department?: { name: string };
}

/* ── Animação de entrada para os cards ── */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ────────────────────────────────────────────
   Hook: contagem animada com ease-out cúbico
   ──────────────────────────────────────────── */
function useCountUp(target: number, duration = 1300, enabled = true) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (target === 0) { setCount(0); return; }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, enabled]);

  return count;
}

/* ── Stat item com contagem animada e delay de entrada ── */
function StatItem({
  target,
  suffix = '',
  label,
  startDelay = 0,
  enabled = false,
}: {
  target: number;
  suffix?: string;
  label: string;
  startDelay?: number;
  enabled?: boolean;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => setActive(true), startDelay);
    return () => clearTimeout(t);
  }, [enabled, startDelay]);

  const count = useCountUp(target, 1300, active);

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
      <span
        className="text-teal-500 tabular-nums leading-none"
        style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.2rem', fontWeight: 800 }}
      >
        {active ? count : 0}{suffix}
      </span>
      <span
        className="text-slate-400 text-center uppercase"
        style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '0.18em' }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Chip de filtro de departamento ── */
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest
        transition-all duration-200 cursor-pointer whitespace-nowrap
        ${active
          ? 'bg-teal-500 border-teal-500 text-white shadow-[0_0_16px_rgba(20,184,166,0.3)]'
          : 'bg-white border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-600'
        }`}
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════ */
export function Home() {
  const [jobs, setJobs]                 = useState<Job[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [hasProfile, setHasProfile]     = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [statsReady, setStatsReady]     = useState(false);

  const token    = localStorage.getItem('user_token');
  const userJson = localStorage.getItem('logged_user');
  const user     = userJson ? JSON.parse(userJson) : null;

  const isAuthenticated = !!token;
  const isNotAdmin      = isAuthenticated && user?.role?.toUpperCase() !== 'ADMIN';

  /* ── Fetch de dados ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const jobsRes  = await fetch('http://localhost:3000/api/v1/jobs-available/open');
        const jobsData = await jobsRes.json();
        setJobs(Array.isArray(jobsData) ? jobsData : (jobsData.data ?? []));

        if (isNotAdmin && token) {
          const profileRes = await fetch('http://localhost:3000/api/v1/candidates-external/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileRes.status === 404) setHasProfile(false);
          else if (profileRes.ok)        setHasProfile(true);
        }
      } catch (err) {
        console.error('[Home] Erro:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isNotAdmin, token]);

  /* Dispara a contagem logo após o loading terminar */
  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setStatsReady(true), 150);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  /* ── Departamentos únicos ── */
  const departments = useMemo(() => {
    const names = jobs.map(j => j.department?.name).filter(Boolean) as string[];
    return ['Todos', ...Array.from(new Set(names))];
  }, [jobs]);

  /* ── Filtragem ── */
  const filteredJobs = useMemo(() =>
    jobs.filter(job => {
      const matchSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept   = activeFilter === 'Todos' || job.department?.name === activeFilter;
      return matchSearch && matchDept;
    }),
    [jobs, searchTerm, activeFilter],
  );

  const openCount       = jobs.length;
  const departmentCount = departments.length - 1;

  /* ──────────────────────── RENDER ──────────────────────── */
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `
          linear-gradient(160deg, #f8fafc 0%, #f1f5f9 55%, #e8f4f3 100%),
          linear-gradient(rgba(20,184,166,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20,184,166,0.04) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 48px 48px, 48px 48px',
      }}
    >
      {/* ── ALERTA: perfil incompleto ── */}
      <AnimatePresence>
        {isNotAdmin && !hasProfile && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-6xl mx-auto px-6 pt-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4
              border border-amber-200 rounded-2xl px-6 py-4
              bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} className="text-amber-600" />
                </div>
                <div>
                  <p
                    className="text-amber-900 uppercase"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em' }}
                  >
                    Perfil Incompleto
                  </p>
                  <p className="text-amber-700 text-xs mt-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Complete seu cadastro para se candidatar às vagas disponíveis.
                  </p>
                </div>
              </div>
              <Link
                to="/completar-perfil"
                className="shrink-0 flex items-center gap-2 bg-amber-500 hover:bg-amber-600
                  text-white px-5 py-2.5 rounded-xl transition-all duration-200
                  active:scale-95 shadow-sm hover:shadow-md"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 800, letterSpacing: '0.15em' }}
              >
                COMPLETAR CADASTRO
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CORPO PRINCIPAL ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── HEADER DA SEÇÃO: totalmente centralizado ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          {/* Label com linhas laterais */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-teal-400" />
            <span
              className="text-teal-600 uppercase tracking-[0.22em]"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 700 }}
            >
              Instituição
            </span>
            <div className="h-[1px] w-8 bg-teal-400" />
          </div>

          {/* Título */}
          <h2
            className="text-slate-900 uppercase leading-none mb-3"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Encontre sua{' '}
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 700,
                color: '#0d9488',
                textTransform: 'none',
              }}
            >
              próxima vaga
            </span>
          </h2>

          {/* Descrição */}
          <p
            className="text-slate-400 max-w-lg mx-auto"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: 400 }}
          >
            Selecione uma oportunidade e dê o próximo passo na sua carreira.
          </p>
        </motion.div>

        {/* ── STATS BAR: faixa centralizada entre título e busca ── */}
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
              className="flex justify-center mb-10"
            >
              <div
                className="inline-flex items-center gap-10 px-10 py-5
                  bg-white/80 backdrop-blur-sm border border-slate-100
                  rounded-2xl shadow-sm"
              >
                <StatItem
                  target={openCount}
                  label="Vagas Abertas"
                  startDelay={0}
                  enabled={statsReady}
                />
                <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
                <StatItem
                  target={departmentCount}
                  label="Departamentos"
                  startDelay={120}
                  enabled={statsReady}
                />
                <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
                <StatItem
                  target={100}
                  suffix="%"
                  label="Gratuito"
                  startDelay={240}
                  enabled={statsReady}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BARRA DE BUSCA + FILTROS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mb-8 space-y-4"
        >
          {/* Input de busca centralizado */}
          <div className="relative max-w-2xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por cargo ou área..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl
                shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent
                outline-none transition-all duration-200 text-slate-700"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '13px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300
                  hover:text-slate-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Chips de departamento centralizados */}
          {departments.length > 1 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <SlidersHorizontal size={13} className="text-slate-400 shrink-0" />
              {departments.map(dept => (
                <FilterChip
                  key={dept}
                  label={dept}
                  active={activeFilter === dept}
                  onClick={() => setActiveFilter(dept)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── DIVISOR com contagem de resultados ── */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-200 to-transparent" />
          <span
            className="text-slate-400 uppercase"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em' }}
          >
            {isLoading ? '—' : `${filteredJobs.length} resultado${filteredJobs.length !== 1 ? 's' : ''}`}
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-slate-200 to-transparent" />
        </div>

        {/* ── ESTADOS: LOADING / VAZIO / GRID ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-teal-100" />
              <Loader2 className="absolute inset-0 m-auto animate-spin text-teal-500" size={28} />
            </div>
            <p
              className="text-slate-400 uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 600 }}
            >
              Carregando vagas...
            </p>
          </div>

        ) : filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 gap-5
              bg-white/60 rounded-3xl border border-dashed border-slate-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Briefcase className="text-slate-300" size={28} />
            </div>
            <div className="text-center">
              <p
                className="text-slate-700 uppercase"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                {searchTerm || activeFilter !== 'Todos' ? 'Nenhuma vaga encontrada' : 'Nenhuma vaga disponível'}
              </p>
              <p
                className="text-slate-400 mt-1"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '12px' }}
              >
                {searchTerm || activeFilter !== 'Todos'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Novas oportunidades serão publicadas em breve.'}
              </p>
            </div>
            {(searchTerm || activeFilter !== 'Todos') && (
              <button
                onClick={() => { setSearchTerm(''); setActiveFilter('Todos'); }}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700
                  border border-teal-200 hover:border-teal-400 px-5 py-2 rounded-xl
                  transition-all cursor-pointer"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 700 }}
              >
                <X size={13} />
                Limpar filtros
              </button>
            )}
          </motion.div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        )}

        {/* ── RODAPÉ DA SEÇÃO ── */}
        {!isLoading && filteredJobs.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-slate-400 mt-12"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '11px', letterSpacing: '0.06em' }}
          >
            Exibindo <strong className="text-slate-600">{filteredJobs.length}</strong> de{' '}
            <strong className="text-slate-600">{openCount}</strong> vagas —{' '}
            <span
              className="text-teal-500 italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px' }}
            >
              Instituição
            </span>
          </motion.p>
        )}
      </div>
    </div>
  );
}