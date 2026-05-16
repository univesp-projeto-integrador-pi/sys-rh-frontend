import { useEffect, useState } from "react";
import { User, Phone, Mail, GraduationCap, Loader2 } from "lucide-react";

export function Profile() {
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const response = await fetch(
          "import.meta.env.VITE_API_URL/api/v1/candidates-external/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header do Perfil */}
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="bg-teal-500 p-4 rounded-2xl">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">
                {candidate?.fullName}
              </h1>
              <p className="text-slate-400 font-medium">Candidato cadastrado</p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User size={20} className="text-teal-600" /> Contato
            </h2>
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-slate-600">
                <Mail size={18} /> {candidate?.email}
              </p>
              <p className="flex items-center gap-3 text-slate-600">
                <Phone size={18} /> {candidate?.phone}
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap size={20} className="text-teal-600" /> Formação
              Acadêmica
            </h2>
            {candidate?.resume?.educations?.map((edu: any) => (
              <div
                key={edu.id}
                className="border-l-4 border-teal-500 pl-4 py-2"
              >
                <h3 className="font-bold text-slate-800">{edu.fieldOfStudy}</h3>
                <p className="text-sm text-slate-600 font-medium">
                  {edu.institution} • {edu.degree}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(edu.startDate).toLocaleDateString()} -{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).toLocaleDateString()
                    : "Presente"}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
