import { useState } from 'react'
import { JobCard } from "./components/JobCard"

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* HEADER */}
      <header className="bg-blue-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Jobs na ONG</h1>
          <nav>
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition font-medium">
              Acesso Administrativo
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        {/* TÍTULO E SUBTÍTULO */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
            Oportunidades Abertas
          </h2>
          <p className="text-slate-600 text-lg">
            Encontre a vaga ideal e comece sua jornada com a gente.
          </p>
        </div>

        {/* VITRINE DE VAGAS (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JobCard 
            title="Desenvolvedor Frontend Júnior" 
            location="Remoto" 
            type="Híbrido" 
            category="Estágio" 
          />
          <JobCard 
            title="Assistente Administrativo" 
            location="São Paulo, SP" 
            type="Presencial" 
            category="CLT" 
          />
          <JobCard 
            title="Voluntário de Comunicação" 
            location="Rio de Janeiro, RJ" 
            type="Remoto" 
            category="Voluntariado" 
          />
          <JobCard 
            title="Analista de RH Pleno" 
            location="Curitiba, PR" 
            type="Presencial" 
            category="CLT" 
          />
        </div>
      </main>
    </div>
  )
}

export default App