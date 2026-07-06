import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { User, RoleType } from '@/types';
import { X, ArrowLeft } from 'lucide-react';
import ReportsPage from '@/pages/reports/ReportsPage';

export default function CompanySupervisors() {
  const { users, students, dailyReports, studentGrades, companyProfile } = useApp();
  const [selectedSupervisor, setSelectedSupervisor] = useState<User | null>(null);

  if (!companyProfile) return <div className="p-6">Aucun profil d'entreprise trouvé.</div>;

  const companySupervisors = users.filter((u: User) => u.role === RoleType.SUPERVISOR && u.companyId === companyProfile.id);

  const [showDashboard, setShowDashboard] = useState(false);
  const handleCloseModal = () => { setSelectedSupervisor(null); setShowDashboard(false); };

  const supervisedStudents = selectedSupervisor
    ? students.filter(s => s.supervisorId === selectedSupervisor.id)
    : [];

  const totalReports = selectedSupervisor
    ? dailyReports.filter(r => supervisedStudents.some(s => s.id === r.studentId)).length
    : 0;

  const totalGrades = selectedSupervisor
    ? studentGrades.filter(g => supervisedStudents.some(s => s.id === g.studentId)).length
    : 0;

  return (
    <div className="space-y-6 text-xs md:text-sm animate-fade-in">
      <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Mes maîtres de stage</h3>
            <p className="text-slate-500 text-xs mt-1">Liste des comptes de superviseurs déjà créés par votre entreprise.</p>
            <p className="text-slate-400 text-[11px] mt-1">La création d'un nouveau maître de stage se fait uniquement depuis votre profil entreprise.</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {companySupervisors.length === 0 ? (
            <div className="text-slate-500 text-sm">Aucun maître de stage enregistré.</div>
          ) : (
            companySupervisors.map(s => (
              <div key={s.id} className="p-3 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div className="text-[12px] text-slate-500">{s.email}</div>
                  <div className="mt-2 text-[11px] text-slate-400">Compte créé le {new Date(s.createdAt).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => {
                    // Navigate to reports view and request impersonation via URL param
                    const base = window.location.pathname;
                    window.location.href = `${base}?impersonate=${encodeURIComponent(s.id)}&view=reports`;
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Ouvrir le tableau de bord
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedSupervisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900">Compte superviseur : {selectedSupervisor.name}</h4>
                <p className="text-[12px] text-slate-500">{selectedSupervisor.email}</p>
              </div>
              <div className="flex items-center gap-3">
                {showDashboard && (
                  <button onClick={() => setShowDashboard(false)} className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
                    <ArrowLeft /> Retour
                  </button>
                )}
                <button onClick={handleCloseModal} className="text-slate-500 hover:text-slate-800"><X /></button>
              </div>
            </div>

            {!showDashboard ? (
              <>
                <div className="p-6 space-y-4 text-sm text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">Étudiants supervisés</div>
                      <div className="mt-3 text-2xl font-black text-slate-900">{supervisedStudents.length}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">Rapports associés</div>
                      <div className="mt-3 text-2xl font-black text-slate-900">{totalReports}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">Notes attribuées</div>
                      <div className="mt-3 text-2xl font-black text-slate-900">{totalGrades}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-semibold text-slate-900">Étudiants affectés</h5>
                    {supervisedStudents.length === 0 ? (
                      <p className="text-slate-500 text-sm">Aucun étudiant n'a encore été affecté à ce superviseur.</p>
                    ) : (
                      <div className="space-y-2">
                        {supervisedStudents.map((student) => (
                          <div key={student.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                            <p className="font-semibold text-slate-900">{student.name}</p>
                            <p className="text-[12px] text-slate-500">{student.email}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <button onClick={handleCloseModal} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold">Fermer</button>
                </div>
              </>
            ) : (
              <div className="p-6">
                <ReportsPage impersonateSupervisorId={selectedSupervisor.id} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
