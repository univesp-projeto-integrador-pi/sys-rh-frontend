import { useState } from 'react'
import { FilterBar } from "./components/FilterBar"
import { JobCard } from "./components/JobCard"

// 1. Nossos dados de teste (Mock)
const allJobs = [
  { id: 1, title: "Assistente", role: "Assistente de Almoxarifado", company: "MASP", location: "São Paulo - SP", deadline: "09/05/2026", tag: "SERVIÇOS ESPECIALIZADOS", contractType: "CLT" },
  { id: 2, title: "Analista", role: "Analista de Acervo", company: "Itaú Cultural", location: "São Paulo - SP", deadline: "09/05/2026", tag: "SERVIÇOS ESPECIALIZADOS", contractType: "PJ" },
  { id: 3, title: "Especialista", role: "Músico - Flauta", company: "Orquestra Sinfônica", location: "Bahia - BA", deadline: "09/05/2026", tag: "ARTISTA", contractType: "Temporário" },
];

function App() {
  // 2. Estado para guardar o filtro selecionado
  const [cargoFiltro, setCargoFiltro] = useState("Todos");

  // 3. Lógica que filtra a lista em tempo real
  const jobsFiltrados = allJobs.filter(job => 
    cargoFiltro === "Todos" || job.title === cargoFiltro
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-blue-700 text-white p-6 shadow-md">
        <h1 className="max-w-6xl mx-auto text-2xl font-bold">Jobs na ONG</h1>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        <FilterBar onCargoChange={setCargoFiltro} />

        <div className="flex flex-col gap-4">
          {jobsFiltrados.map(job => (
            <JobCard key={job.id} {...job} />
          ))}
          
          {jobsFiltrados.length === 0 && (
            <p className="text-center text-slate-500 py-10">Nenhuma vaga encontrada para este filtro.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;