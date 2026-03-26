// src/pages/Home.tsx
import { allJobs } from "../data/jobs";
import { useState } from 'react'
import { FilterBar } from "../components/FilterBar"
import { JobCard } from "../components/JobCard"

export function Home() {
  const [cargoFiltro, setCargoFiltro] = useState("Todos");
  const [contratoFiltro, setContratoFiltro] = useState("Todos");

  const jobsFiltrados = allJobs.filter(job => {
    const bateCargo = cargoFiltro === "Todos" || job.title === cargoFiltro;
    const bateContrato = contratoFiltro === "Todos" || job.contractType === contratoFiltro;
    return bateCargo && bateContrato;
  });

  return (
    <div className="p-8">
      <main className="max-w-6xl mx-auto p-6">
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