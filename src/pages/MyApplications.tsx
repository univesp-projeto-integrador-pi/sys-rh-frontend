import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Loader2, AlertCircle, ArrowRight,
  Building2, CalendarDays, ChevronRight,
  CheckCircle2, XCircle, Clock, Users, Star,
} from 'lucide-react';

/*
  Fontes (adicione no index.html se ainda não estiver):
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400;1,700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
*/

type Stage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

interface Application {
  id: string;
  appliedAt: string;
  currentStage: Stage;
  position: {
    title: string;
    department: { name: string };
  };
}

/* ── Estágios do funil ── */
const PIPELINE: Stage[] = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'];

const STAGE_META: Record<Stage, {
  label: string;
  shortLabel: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
  icon: React.ReactNode;
  step: number;
}> = {
  APPLIED:   { label: 'Candidatado', shortLabel: 'Enviada',    color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    dot: 'bg-blue-500',    icon: <FileText    size={12}/>, step: 1 },
  SCREENING: { label: 'Em Triagem',  shortLabel: 'Em análise', color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200',  dot: 'bg-violet-500',  icon: <Clock       size={12}/>, step: 2 },
  INTERVIEW: { label: 'Entrevista',  shortLabel: 'Entrevista', color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500',   icon: <Users       size={12}/>, step: 3 },
  OFFER:     { label: 'Proposta',    shortLabel: 'Selecionada',color: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-200',    dot: 'bg-teal-500',    icon: <Star        size={12}/>, step: 4 },
  HIRED:     { label: 'Contratado',  shortLabel: 'Finalista',  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: <CheckCircle2 size={12}/>, step: 5 },
  REJECTED:  { label: 'Não aprovado',shortLabel: 'Encerrada',  color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-200',     dot: 'bg-red-400',     icon: <XCircle     size={12}/>, step: 0 },
};

const FILTER_OPTIONS: { label: string; value: Stage | 'TODOS' }[] = [
  { label: 'Todas',        value: 'TODOS'     },
  { label: 'Candidatado',  value: 'APPLIED'   },
  { label: 'Em Triagem',   value: 'SCREENING' },
  { label: 'Entrevista',   value: 'INTERVIEW' },
  { label: 'Proposta',     value: 'OFFER'     },
  { label: 'Contratado',   value: 'HIRED'     },
  { label: 'Não aprovado', value: 'REJECTED'  },
];

function InlineSteps({ stage }: { stage: Stage }) {
  if (stage === 'REJECTED') {
    return (
      <div className="flex items-center">
        <span
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12px] font-bold
            ${STAGE_META.REJECTED.color} bg-red-50 border-red-200`}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <XCircle size={14} />
          Candidatura encerrada
        </span>
      </div>
    );
  }

  const currentStep = STAGE_META[stage].step;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PIPELINE.map((s, idx) => {
        const meta = STAGE_META[s];

        const isPast = meta.step < currentStep;
        const isCurrent = s === stage;
        const isFuture = meta.step > currentStep;

        return (
          <React.Fragment key={s}>
            <div
              className={`
                inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-[12px] font-bold whitespace-nowrap
                transition-all duration-200 border

                ${
                  isCurrent
                    ? `${meta.color} ${meta.bg} ${meta.border} shadow-sm`
                    : isPast
                      ? 'text-slate-500 bg-slate-100 border-slate-200'
                      : 'text-slate-400 bg-slate-50 border-slate-100'
                }
              `}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isCurrent
                    ? meta.dot
                    : isPast
                      ? 'bg-slate-400'
                      : 'bg-slate-300'
                }`}
              />

              <span>{meta.shortLabel}</span>

              {isCurrent && (
                <span
                  className="ml-1 rounded-full bg-slate-800 text-white
                    px-2 py-0.5 text-[8px] font-black uppercase tracking-wider"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Atual
                </span>
              )}
            </div>

            {idx < PIPELINE.length - 1 && (
              <ChevronRight
                size={15}
                className="text-slate-400 hidden sm:block"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────
   Card de candidatura
   ──────────────────────────────────────────── */
const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

function ApplicationCard({ app, index }: { app: Application; index: number }) {
  const meta = STAGE_META[app.currentStage];
  const isRej = app.currentStage === 'REJECTED';
  const date = new Date(app.appliedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`group bg-white border rounded-3xl overflow-hidden min-h-[240px]
        transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        ${isRej ? 'border-slate-100' : 'border-slate-100 hover:border-teal-200'}`}
    >
      <div className={`h-[4px] w-full ${meta.dot}`} />

      <div className="p-9">
        <div className="flex items-start justify-between gap-5 mb-4">
          <h3
            className={`leading-tight ${isRej ? 'text-slate-500' : 'text-slate-900'}`}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.015em',
            }}
          >
            {app.position.title}
          </h3>

          <Link
            to={`/vagas/${app.id}`}
            className={`shrink-0 flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl
              border text-[10px] font-bold uppercase tracking-widest
              transition-all duration-200 whitespace-nowrap
              ${isRej
                ? 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                : 'border-teal-200 text-teal-600 hover:bg-teal-500 hover:border-teal-500 hover:text-white'
              }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Ver vaga
            <ArrowRight size={11} />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mb-7">
          <span
            className="flex items-center gap-2 text-slate-600"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 700 }}
          >
            <Building2 size={13} className="text-slate-500" />
            {app.position.department.name}
          </span>
          <span
            className="flex items-center gap-1.5 text-slate-400"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '12px', fontWeight: 600 }}
          >
            <CalendarDays size={13} className="text-slate-300" />
            Aplicado em {date}
          </span>
        </div>

        <div>
          <p
            className="text-slate-400 uppercase mb-3"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em' }}
          >
            Status da candidatura
          </p>

          <div className="overflow-x-auto pb-1">
            <InlineSteps stage={app.currentStage} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════ */
const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Stage | 'TODOS'>('TODOS');

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('user_token');
      try {
        const res = await fetch('http://localhost:3000/api/v1/job-applications/me', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error();
        setApplications(await res.json());
      } catch {
        setError('Não foi possível carregar suas candidaturas.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    const map: Partial<Record<Stage | 'TODOS', number>> = { TODOS: applications.length };
    applications.forEach(a => { map[a.currentStage] = (map[a.currentStage] ?? 0) + 1; });
    return map;
  }, [applications]);

  const filtered = useMemo(() =>
    activeFilter === 'TODOS'
      ? applications
      : applications.filter(a => a.currentStage === activeFilter),
    [applications, activeFilter],
  );

  const availableFilters = FILTER_OPTIONS.filter(
    f => f.value === 'TODOS' || (counts[f.value] ?? 0) > 0,
  );

  /* ── Render ── */
  return (
    <div
        className="flex-1 bg-slate-50"
        style={{
        backgroundImage: `
            linear-gradient(160deg, #f8fafc 0%, #f1f5f9 55%, #e8f4f3 100%),
            linear-gradient(rgba(20,184,166,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.04) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 48px 48px, 48px 48px',
        }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12 min-h-full" style={{ marginTop: '6rem' }}>

        {/* ── CABEÇALHO: discreto, alinhado à esquerda ── */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1
              className="text-slate-800"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '20px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {applications.length > 0
                ? <>
                    <span className="text-teal-500">{applications.length}</span>
                    {' '}candidatura{applications.length !== 1 ? 's' : ''}{' '}
                    <span
                      className="text-slate-400 font-normal"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1em' }}
                    >
                      nos últimos 6 meses
                    </span>
                  </>
                : 'Minhas candidaturas'
              }
            </h1>
            <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-slate-200 to-transparent" />
          </motion.div>
        )}

        {/* ── ERRO ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 border border-red-200 bg-red-50
                rounded-2xl px-5 py-4 mb-8"
            >
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={18} className="text-red-500" />
              </div>
              <p className="text-red-700" style={{ fontFamily: "'Syne', sans-serif", fontSize: '12px', fontWeight: 600 }}>
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LOADING ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-teal-100" />
              <Loader2 className="absolute inset-0 m-auto animate-spin text-teal-500" size={28} />
            </div>
            <p
              className="text-slate-400 uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 600 }}
            >
              Carregando candidaturas...
            </p>
          </div>

        ) : applications.length === 0 ? (
          /* ── VAZIO TOTAL ── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 gap-5
              bg-white/60 rounded-3xl border border-dashed border-slate-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100
              flex items-center justify-center">
              <FileText className="text-slate-300" size={28} />
            </div>
            <div className="text-center">
              <p
                className="text-slate-700 uppercase"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                Nenhuma candidatura ainda
              </p>
              <p className="text-slate-400 mt-1" style={{ fontFamily: "'Syne', sans-serif", fontSize: '12px' }}>
                Explore as vagas disponíveis e candidate-se.
              </p>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600
                text-white px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 800, letterSpacing: '0.15em' }}
            >
              VER VAGAS <ArrowRight size={13} />
            </Link>
          </motion.div>

        ) : (
          <>
            {/* ── BARRA DE FILTROS ── */}
            {availableFilters.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-2 flex-wrap mb-6
                  bg-white/80 border border-slate-100 rounded-2xl px-5 py-3.5
                  backdrop-blur-sm shadow-sm"
              >
                <span
                  className="text-slate-400 uppercase tracking-widest mr-1 shrink-0"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 700 }}
                >
                  Filtrar:
                </span>
                {availableFilters.map(f => {
                  const isActive = activeFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setActiveFilter(f.value)}
                      className={`px-3.5 py-1.5 rounded-lg border text-[10px] font-bold
                        uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap
                        ${isActive
                          ? 'bg-teal-500 border-teal-500 text-white shadow-[0_0_14px_rgba(20,184,166,0.3)]'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-600'
                        }`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {f.label}
                      {counts[f.value] !== undefined && (
                        <span className={`ml-1.5 ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                          ({counts[f.value]})
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* ── LISTA DE CARDS ── */}
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty-filter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 gap-4
                    bg-white/60 rounded-3xl border border-dashed border-slate-200"
                >
                  <FileText className="text-slate-200" size={32} />
                  <p className="text-slate-400" style={{ fontFamily: "'Syne', sans-serif", fontSize: '12px', fontWeight: 600 }}>
                    Nenhuma candidatura com esse status.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((app, i) => (
                    <ApplicationCard key={app.id} app={app} index={i} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;