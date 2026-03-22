interface FilterBarProps {
  onCargoChange: (value: string) => void;
  onContratoChange: (value: string) => void;
}

export function FilterBar({ onCargoChange, onContratoChange }: FilterBarProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
      {/* O grid divide o espaço em 2 colunas no computador (md) e 1 no celular */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SELETOR DE CARGO */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-500 mb-2 ml-1 uppercase tracking-wider">
            Cargo
          </label>
          <select 
            onChange={(e) => onCargoChange(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
          >
            <option value="Todos">Todos</option>
            <option value="Analista">Analista</option>
            <option value="Assistente">Assistente</option>
            <option value="Especialista">Especialista</option>
          </select>
        </div>

        {/* SELETOR DE TIPO DE CONTRATO */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-500 mb-2 ml-1 uppercase tracking-wider">
            Tipo de Contrato
          </label>
          <select 
            onChange={(e) => onContratoChange(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
          >
            <option value="Todos">Todos</option>
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
            <option value="Temporário">Temporário</option>
          </select>
        </div>

      </div>
    </div>
  );
}