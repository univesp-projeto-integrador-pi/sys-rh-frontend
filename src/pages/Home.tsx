// src/pages/Home.tsx
import { useState } from 'react'
import { FilterBar } from "../components/FilterBar"
import { JobCard } from "../components/JobCard"

const allJobs = [
  { id: 1, title: "Assistente", role: "Assistente de Almoxarifado", company: "MASP", location: "São Paulo - SP", deadline: "09/05/2026", tag: "SERVIÇOS ESPECIALIZADOS", contractType: "CLT" },
  { id: 2, title: "Analista", role: "Analista de Acervo", company: "Itaú Cultural", location: "São Paulo - SP", deadline: "08/04/2026", tag: "SERVIÇOS ESPECIALIZADOS", contractType: "PJ" },
];

export function Home() {
  const [cargoFiltro, setCargoFiltro] = useState("Todos");
  const [contratoFiltro, setContratoFiltro] = useState("Todos");

  const jobsFiltrados = allJobs.filter(job => {
    const bateCargo = cargoFiltro === "Todos" || job.title === cargoFiltro;
    const bateContrato = contratoFiltro === "Todos" || job.contractType === contratoFiltro;
    return bateCargo && bateContrato;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-blue-700 text-white p-6 shadow-md">
         <h1 className="max-w-6xl mx-auto text-2xl font-bold">Jobs na ONG</h1>
      </header>
      <main className="max-w-6xl mx-auto p-6 mt-8">
        <FilterBar onCargoChange={setCargoFiltro} onContratoChange={setContratoFiltro} />
        <div className="flex flex-col gap-4">
          {jobsFiltrados.map(job => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </main>
    </div>
  );
}