import { useState } from 'react';
import { RoleType } from '../../types';
import { useApp } from '@/contexts/AppContext';
import { ApplicationStatus } from '@/types';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Briefcase, 
  Users, 
  Award,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ReportsPage({ impersonateSupervisorId }: { impersonateSupervisorId?: string } ) {
  const { internships, applications, users, showToast, currentUser, dailyReports, studentGrades, students, studentAcceptances, addStudentGrade, updateDailyReportByAdmin, updateAcceptanceStatus } = useApp();
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'excel' | null>(null);
  const [acceptanceTitles, setAcceptanceTitles] = useState<Record<string, string>>({});

  const totalOffers = internships.length;
  const publishedCount = internships.filter(i => i.status === 'published').length;
  const pendingCount = internships.filter(i => i.status === 'pending').length;

  const totalApps = applications.length;
  const acceptedApps = applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length;
  const pendingApps = applications.filter(a => a.status === ApplicationStatus.PENDING).length;
  const scheduledApps = applications.filter(a => a.status === ApplicationStatus.INTERVIEW).length;
  const rejectedApps = applications.filter(a => a.status === ApplicationStatus.REJECTED).length;

  // Simulate exporting reports
  const triggerExport = (format: 'pdf' | 'excel', title: string) => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
      showToast(`Exportation réussie ! Le fichier "${title}.${format === 'pdf' ? 'pdf' : 'xlsx'}" a été téléchargé avec succès.`, 'success');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-xs md:text-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium">Visualisez les statistiques globales d'insertion académique et téléchargez les rapports administratifs officiels.</p>
        </div>
      </div>

      {/* CORE STATS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-550 block text-[11px] uppercase font-semibold">Taux d'acceptation</span>
            <span className="text-xl md:text-2xl font-black text-slate-900">
              {totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0} %
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Insertion directe en hausse</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-550 block text-[11px] uppercase font-semibold">Taux de placement global</span>
            <span className="text-xl md:text-2xl font-black text-slate-900">
              {totalOffers > 0 ? Math.round((publishedCount / totalOffers) * 100) : 0} %
            </span>
            <span className="text-[10px] text-blue-600 block mt-0.5">Offres validées et actives</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-550 block text-[11px] uppercase font-semibold">Moyenne postulants / offres</span>
            <span className="text-xl md:text-2xl font-black text-slate-900">
              {publishedCount > 0 ? (totalApps / publishedCount).toFixed(1) : 0} par stage
            </span>
            <span className="text-[10px] text-purple-650 text-purple-500 block mt-0.5">Demande étudiante forte</span>
          </div>
        </div>
      </div>

      {/* STATS VISUAL CHANNELS BAR DIAGRAMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart Card 1: Applications status bar diagram */}
        <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center">
            <Layers className="h-4.5 w-4.5 mr-2 text-blue-600" /> Stats Candidatures par Statut
          </h3>
          
          <div className="space-y-4">
            {/* Pending apps */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5 font-bold">
                <span>En attente ({pendingApps})</span>
                <span>{totalApps > 0 ? Math.round((pendingApps / totalApps) * 100) : 0} %</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${totalApps > 0 ? (pendingApps / totalApps) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Interviews Scheduled */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5 font-bold">
                <span>Entretien programmé ({scheduledApps})</span>
                <span>{totalApps > 0 ? Math.round((scheduledApps / totalApps) * 100) : 0} %</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${totalApps > 0 ? (scheduledApps / totalApps) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Accepted apps */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5 font-bold">
                <span>Acceptées ({acceptedApps})</span>
                <span>{totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0} %</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${totalApps > 0 ? (acceptedApps / totalApps) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Rejected apps */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-605 mb-1.5 font-bold">
                <span>Refusées ({rejectedApps})</span>
                <span>{totalApps > 0 ? Math.round((rejectedApps / totalApps) * 100) : 0} %</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${totalApps > 0 ? (rejectedApps / totalApps) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Card 2: System posts breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center">
            <Briefcase className="h-4.5 w-4.5 mr-2 text-emerald-600" /> Stats de Validation des Annonces de stage
          </h3>
          
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <span className="text-xl md:text-3xl font-black text-emerald-600 block">{publishedCount}</span>
                <span className="text-[11px] text-slate-500 font-bold block mt-1 uppercase">Validées & En ligne</span>
              </div>
              <div className="p-4 bg-yellow-50/50 rounded-lg border border-yellow-100">
                <span className="text-xl md:text-3xl font-black text-yellow-600 block">{pendingCount}</span>
                <span className="text-[11px] text-slate-500 font-bold block mt-1 uppercase">Attente Administrateur</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border rounded-lg text-slate-600 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-850">Nombre total de comptes utilisateurs inscrits :</span>
              <strong className="text-blue-600 font-bold font-semibold text-sm">{users.length}</strong>
            </div>

            <div className="text-[10px] text-slate-400 italic text-center">
              Mise à jour en temps réel des dépôts académiques de la session courante.
            </div>
          </div>
        </div>
      </div>

      {/* REPORT EXPRORT PANEL */}
      <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Téléchargements des rapports administratifs officiels</h3>
        <p className="text-xs text-slate-500 -mt-2">Générez des rapports instantanés d'activités scolaires ou d'insertion de l'établissement.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Export Report 1: Stages list */}
          <div className="p-4 bg-slate-50/60 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-105 text-blue-600 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs md:text-sm">Rapport Annuel des Stages</span>
                <span className="text-[10px] text-slate-400">Liste exhaustive, recruteurs, salaires, régions.</span>
              </div>
            </div>
            
            <div className="flex space-x-1.5 shrink-0">
              <button
                disabled={downloadingFormat !== null}
                onClick={() => triggerExport('pdf', 'Rapport_Stages_Academique')}
                className="p-1.5 bg-white border rounded-md hover:bg-slate-50 text-slate-600 font-semibold text-[10px]"
                title="Exporter PDF"
              >
                PDF
              </button>
              <button
                disabled={downloadingFormat !== null}
                onClick={() => triggerExport('excel', 'Rapport_Stages_Excel')}
                className="p-1.5 bg-white border rounded-md hover:bg-slate-50 text-slate-600 font-semibold text-[10px]"
                title="Exporter Excel"
              >
                EXCEL
              </button>
            </div>
          </div>

          {/* Export Report 2: Candidatures */}
          <div className="p-4 bg-slate-50/60 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-105 text-emerald-600 bg-emerald-100 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs md:text-sm">Bilan Statistique Candidatures</span>
                <span className="text-[10px] text-slate-400">Orientation, taux de refus, entretiens menés.</span>
              </div>
            </div>

            <div className="flex space-x-1.5 shrink-0">
              <button
                disabled={downloadingFormat !== null}
                onClick={() => triggerExport('pdf', 'Bilan_Candidatures_PDF')}
                className="p-1.5 bg-white border rounded-md hover:bg-slate-50 text-slate-600 font-semibold text-[10px]"
                title="Exporter PDF"
              >
                PDF
              </button>
              <button
                disabled={downloadingFormat !== null}
                onClick={() => triggerExport('excel', 'Bilan_Candidatures_Excel')}
                className="p-1.5 bg-white border rounded-md hover:bg-slate-50 text-slate-600 font-semibold text-[10px]"
                title="Exporter Excel"
              >
                EXCEL
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Supervisor view: list students and their reports/grades */}
      {(() => {
        const activeSupervisorId = impersonateSupervisorId ?? (currentUser && currentUser.role === RoleType.SUPERVISOR ? currentUser.id : undefined);
        const isImpersonation = !!impersonateSupervisorId;
        if (!activeSupervisorId) return null;

        return (
          <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Mes étudiants supervisés</h3>
            {students.filter(s => s.supervisorId === activeSupervisorId).length === 0 ? (
              <p className="text-slate-500 text-sm">Aucun étudiant ne vous est assigné pour le moment.</p>
            ) : (
              students.filter(s => s.supervisorId === activeSupervisorId).map(s => (
                <div key={s.id} className="p-4 border rounded-lg mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900">{s.name}</h4>
                      <div className="text-xs text-slate-500">{s.email}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold">Rapports journaliers</h5>
                      <div className="space-y-2 mt-2">
                        {dailyReports.filter(r => r.studentId === s.id).length === 0 ? (
                          <p className="text-sm text-slate-500">Aucun rapport.</p>
                        ) : (
                          dailyReports.filter(r => r.studentId === s.id).map(r => (
                            <div key={r.id} className="p-2 bg-slate-50 rounded-md flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900">{r.date}</div>
                                <div className="text-slate-600 text-[13px]">{r.activity}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${r.status === 'pending' ? 'bg-amber-100 text-amber-800' : r.status === 'validated' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{r.status}</span>
                                {r.status !== 'validated' && (
                                  <button
                                    onClick={() => updateDailyReportByAdmin(r.id, { status: 'validated' })}
                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs"
                                  >
                                    Valider
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold">Notes attribuées</h5>
                      <div className="mt-2 space-y-2">
                        {studentGrades.filter(g => g.studentId === s.id).length === 0 ? (
                          <p className="text-sm text-slate-500">Aucune note pour l'instant.</p>
                        ) : (
                          studentGrades.filter(g => g.studentId === s.id).map(g => (
                            <div key={g.id} className="p-2 bg-slate-50 rounded-md flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900">{g.subject}</div>
                                <div className="text-slate-600 text-[13px]">{g.grade}/{g.maxGrade} — {g.comment}</div>
                              </div>
                              <div className="text-sm text-slate-500">{g.gradedBy}</div>
                            </div>
                          ))
                        )}

                        <div className="pt-2 border-t mt-2">
                          <h6 className="font-semibold text-sm">Ajouter une note</h6>
                          <AddGradeForm student={s} onAdd={(subject, grade, comment) => addStudentGrade(s.id, s.name, subject, grade, comment)} />
                        </div>

                        <div className="pt-4 border-t mt-4">
                          <h6 className="font-semibold text-sm">Note d'acceptation</h6>
                          <div className="space-y-3 mt-3">
                            {studentAcceptances.filter(a => a.studentId === s.id).length === 0 ? (
                              <p className="text-sm text-slate-500">Aucune note d'acceptation associée.</p>
                            ) : (
                              studentAcceptances.filter(a => a.studentId === s.id).map(a => (
                                <div key={a.id} className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <div className="text-slate-900 font-semibold">{a.internshipTitle}</div>
                                      <div className="text-[11px] text-slate-500">{a.companyName}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                                      a.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : a.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                      {a.status === 'approved' ? 'Approuvée' : a.status === 'rejected' ? 'Rejetée' : 'En attente'}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {
                                      <>
                                        <button
                                          onClick={() => updateAcceptanceStatus(a.id, 'approved')}
                                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs hover:bg-emerald-700"
                                          disabled={a.status === 'approved'}
                                        >
                                          Approuver
                                        </button>
                                        <button
                                          onClick={() => updateAcceptanceStatus(a.id, 'rejected')}
                                          className="px-3 py-1.5 bg-rose-600 text-white rounded-md text-xs hover:bg-rose-700"
                                          disabled={a.status === 'rejected'}
                                        >
                                          Rejeter
                                        </button>
                                      </>
                                    }
                                  </div>
                                </div>
                              ))
                            )}

                            <div className="flex flex-col md:flex-row gap-2 items-start md:items-end">
                              <input
                                value={acceptanceTitles[s.id] || ''}
                                onChange={(e) => setAcceptanceTitles(prev => ({ ...prev, [s.id]: e.target.value }))}
                                placeholder="Titre du stage / mission"
                                className="flex-1 p-2 border rounded-md text-sm"
                              />
                              <button
                                onClick={() => {
                                  const title = acceptanceTitles[s.id]?.trim();
                                  if (!title) {
                                    showToast('Veuillez saisir un titre pour la note d\'acceptation.', 'error');
                                    return;
                                  }
                                  showToast("Création de note d'acceptation indisponible dans ce module.", 'error');
                                  setAcceptanceTitles(prev => ({ ...prev, [s.id]: '' }));
                                }}
                                className="px-4 py-2 bg-violet-600 text-white rounded-md text-sm hover:bg-violet-700"
                              >
                                Créer une note d'acceptation
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })()}
    </div>
  );
}

function AddGradeForm({ student, onAdd }: { student: any; onAdd: (subject: string, grade: number, comment?: string) => void }) {
  const [subject, setSubject] = useState('Travail pratique');
  const [grade, setGrade] = useState<number>(15);
  const [comment, setComment] = useState('');

  return (
    <div className="space-y-2">
      <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border rounded-md text-sm" placeholder="Sujet" />
      <div className="flex gap-2">
        <input type="number" value={grade} onChange={e => setGrade(Number(e.target.value))} className="w-28 p-2 border rounded-md text-sm" min={0} max={20} />
        <input value={comment} onChange={e => setComment(e.target.value)} className="flex-1 p-2 border rounded-md text-sm" placeholder="Commentaire (optionnel)" />
      </div>
      <div className="flex justify-end">
        <button onClick={() => { onAdd(subject, grade, comment); setComment(''); }} className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">Ajouter</button>
      </div>
    </div>
  );
}
