import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RoleType, ApplicationStatus, DailyReport, StudentGrade, StudentAcceptance } from '../../types';
import { 
  Briefcase, 
  Users, 
  FileCheck, 
  Heart, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp, 
  Hourglass,
  CalendarDays,
  MapPin,
  Building2,
  BookOpen,
  Award,
  FileSignature,
  PlusCircle,
  Check,
  Edit2,
  Trash2,
  Download,
  AlertCircle,
  HelpCircle,
  GraduationCap,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

export default function Dashboard({ onViewChange }: { onViewChange: (view: string) => void }) {
  const { 
    currentUser, 
    internships, 
    applications, 
    students, 
    companies, 
    users,
    dailyReports,
    studentGrades,
    studentAcceptances,
    addDailyReport,
    updateDailyReportByAdmin,
    addStudentGrade,
    updateStudentGrade,
    updateAcceptanceStatus,
    showToast
  } = useApp();

  // Active sub-tabs for student and admin to keep navigation organized
  const [studentTab, setStudentTab] = useState<'applications' | 'reports' | 'grades' | 'acceptance'>('applications');
  const [adminTab, setAdminTab] = useState<'overview' | 'reports' | 'grades' | 'acceptance'>('overview');

  // Local Form state for creating daily reports
  const [reportForm, setReportForm] = useState({
    activity: '',
    date: new Date().toISOString().split('T')[0],
    hoursWorked: 8
  });

  // Local Form state for Admin adding/editing grades
  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    subject: 'Rapport final de Stage',
    grade: 16,
    comment: ''
  });

  // Local Form state for Admin modifying a student's daily report
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [adminReportUpdates, setAdminReportUpdates] = useState({
    activity: '',
    hoursWorked: 8,
    status: 'validated' as 'pending' | 'validated' | 'rejected',
    adminComment: ''
  });

  if (!currentUser) return null;

  // ----------------------------------------------------
  // 1. STUDENT SPACE
  // ----------------------------------------------------
  if (currentUser.role === RoleType.STUDENT) {
    const studentProf = students.find(s => s.userId === currentUser.id);
    const myApps = applications.filter(a => a.studentId === studentProf?.id);
    
    // Stats computes
    const pendingApps = myApps.filter(a => a.status === ApplicationStatus.PENDING);
    const acceptedApps = myApps.filter(a => a.status === ApplicationStatus.ACCEPTED);
    const scheduledApps = myApps.filter(a => a.status === ApplicationStatus.INTERVIEW);
    
    // Student's reports, grades and acceptance files
    const myReports = dailyReports.filter(r => r.studentId === studentProf?.id);
    const myGrades = studentGrades.filter(g => g.studentId === studentProf?.id);
    const myAcceptance = studentAcceptances.filter(a => a.studentId === studentProf?.id);

    // Dynamic AI Recommendations based on competencies
    const recommendations = internships.filter(i => 
      i.status === 'published' && 
      (studentProf?.skills || []).some(skill => 
        i.skillsRequired.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      )
    ).slice(0, 3);

    // Handle daily report submissions
    const handleAddReport = (e: React.FormEvent) => {
      e.preventDefault();
      if (!reportForm.activity.trim()) {
        showToast("Veuillez rédiger la description de l'activité.", "error");
        return;
      }
      addDailyReport(reportForm.activity, reportForm.date, Number(reportForm.hoursWorked));
      setReportForm({
        activity: '',
        date: new Date().toISOString().split('T')[0],
        hoursWorked: 8
      });
    };

    // Calculate overall average grade (Weighted on 20)
    const averageGrade = myGrades.length > 0 
      ? (myGrades.reduce((sum, g) => sum + (g.grade / g.maxGrade) * 20, 0) / myGrades.length).toFixed(1)
      : null;

    return (
      <div className="space-y-6 animate-fade-in" id="student-workspace">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white rounded-2xl shadow-lg border border-slate-750 p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/30 px-3 py-1 rounded-full text-indigo-200 text-xs font-semibold mb-3">
              <Sparkles className="h-3 w-3 text-indigo-300 animate-pulse" />
              <span>Session Académique Active — Haut-Katanga</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Bonjour, {currentUser.name} ! 👋</h2>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
              Bienvenue dans votre portail de stage. Ici, rédigez vos rapports journaliers d'activités, consultez vos notes d'acceptation et suivez l'évaluation finale de vos professeurs de l'Université.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button 
                onClick={() => { setStudentTab('reports'); }}
                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-all flex items-center shadow-md shadow-emerald-950/20"
              >
                <ClipboardList className="mr-1.5 h-4 w-4" /> Rédiger mon rapport
              </button>
              <button 
                onClick={() => onViewChange('internships')}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-lg transition-all"
              >
                Explorer de nouvelles offres
              </button>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 hidden lg:block">
            <BookOpen className="w-64 h-64 text-indigo-400" />
          </div>
        </div>

        {/* Workspace Sub-Tabs navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none bg-white p-2 rounded-xl shadow-xs gap-1">
          <button
            onClick={() => setStudentTab('applications')}
            className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center shrink-0 transition-all ${
              studentTab === 'applications' 
                ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Suivi & Recommandations
          </button>
          <button
            onClick={() => setStudentTab('reports')}
            className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center shrink-0 transition-all ${
              studentTab === 'reports' 
                ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Journal de Stage ({myReports.length})
          </button>
          <button
            onClick={() => setStudentTab('grades')}
            className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center shrink-0 transition-all ${
              studentTab === 'grades' 
                ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Award className="h-4 w-4 mr-2" />
            Mes Cotes ({myGrades.length})
          </button>
          <button
            onClick={() => setStudentTab('acceptance')}
            className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center shrink-0 transition-all ${
              studentTab === 'acceptance' 
                ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileSignature className="h-4 w-4 mr-2" />
            Notes d'Acceptation ({myAcceptance.length})
          </button>
        </div>

        {/* Tab 1: APPLICATIONS & RECOMMENDATIONS */}
        {studentTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Quick stats on top */}
            <div className="lg:col-span-2 space-y-6">
              {/* Counter panels */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Postulées</span>
                  <span className="text-xl md:text-2xl font-bold text-slate-800 mt-2">{myApps.length}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <span className="text-[10px] text-amber-650 uppercase font-semibold">En attente</span>
                  <span className="text-xl md:text-2xl font-bold text-amber-600 mt-2">{pendingApps.length}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-650 uppercase font-semibold">Acceptées</span>
                  <span className="text-xl md:text-2xl font-bold text-emerald-600 mt-2">{acceptedApps.length}</span>
                </div>
              </div>

              {/* Application tracker list */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">Suivi de vos requêtes récentes</h3>
                {myApps.length === 0 ? (
                  <div className="p-8 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
                    <FileCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium text-xs">Aucune candidature soumise pour le moment.</p>
                    <button 
                      onClick={() => onViewChange('internships')}
                      className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
                    >
                      Découvrir des offres
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myApps.map((app) => (
                      <div key={app.id} className="p-4 rounded-lg bg-slate-50/50 border border-slate-150 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs md:text-sm">{app.internshipTitle}</h4>
                          <span className="text-xs text-slate-500 font-medium block mt-1">{app.companyName}</span>
                          <span className="text-[10px] text-slate-400 block mt-2">Dossier de candidature: <span className="font-medium text-slate-600">{app.cvName}</span></span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            app.status === ApplicationStatus.ACCEPTED ? 'bg-emerald-100 text-emerald-800' :
                            app.status === ApplicationStatus.REJECTED ? 'bg-rose-100 text-rose-800' :
                            app.status === ApplicationStatus.INTERVIEW ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800 font-medium'
                          }`}>
                            {app.status === ApplicationStatus.PENDING ? 'En attente' : app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Advisor & Recommendations */}
            <div className="space-y-6">
              <div className="bg-indigo-950 p-5 rounded-2xl text-white shadow-md border border-indigo-900 space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-bold text-sm tracking-wide">Compagnon de stage IA</h4>
                </div>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  En tant qu'étudiant ciblant les industries minières et services financiers du <strong>Haut-Katanga</strong> (Lubumbashi, Kolwezi, Likasi), nous vous recommandons d'axer votre profil sur la sécurité industrielle et l'énergétique pratique.
                </p>
                <div className="p-3 bg-indigo-900/60 rounded-lg border border-indigo-800/80">
                  <span className="text-[10px] text-indigo-300 font-bold block uppercase">Conseil du Moment</span>
                  <p className="text-[11px] text-indigo-100 mt-1">Renseignez régulièrement vos heures de chantiers hebdomadaires pour faciliter la validation automatique par votre promoteur académique.</p>
                </div>
              </div>

              {/* Recommended List */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-blue-600" /> Recommandé pour vous
                </h3>
                {recommendations.length === 0 ? (
                  <p className="text-xs text-slate-500">Ajoutez des compétences (Géologie, API, SQL) pour débloquer les offres correspondantes.</p>
                ) : (
                  recommendations.map(r => (
                    <div key={r.id} className="p-3 border rounded-lg hover:border-blue-300 transition-colors bg-slate-50/20 block cursor-pointer" onClick={() => onViewChange('internships')}>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{r.companyName}</span>
                        <span>{r.city}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs mt-1 truncate">{r.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.skillsRequired.slice(0, 2).map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-semibold rounded-sm">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DAILY CLOGS (JOURNAL DE STAGE) */}
        {studentTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Report creator form */}
            <div className="lg:col-span-1">
              <form onSubmit={handleAddReport} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-4">
                <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5 text-blue-600" />
                  Rédiger un journalier
                </h3>
                <p className="text-xs text-slate-500">Renseignez quotidiennement les travaux accomplis au sein de votre entreprise d'accueil pour validation.</p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date d'activité</label>
                  <input 
                    type="date" 
                    value={reportForm.date}
                    onChange={(e) => setReportForm({ ...reportForm, date: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heures effectuées</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="16" 
                    value={reportForm.hoursWorked}
                    onChange={(e) => setReportForm({ ...reportForm, hoursWorked: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description des travaux</label>
                  <textarea 
                    value={reportForm.activity}
                    rows={4}
                    onChange={(e) => setReportForm({ ...reportForm, activity: e.target.value })}
                    placeholder="Saisissez ici ce que vous avez effectué (consignes de sécurité, maintenance préventive, maintenance mécanique, etc.)"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 shadow-inner"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                >
                  Soumettre au promoteur
                </button>
              </form>
            </div>

            {/* List of previously logged activities */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center justify-between">
                <span>Historique du Journal de Stage</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full">{myReports.length} entrée(s)</span>
              </h3>

              {myReports.length === 0 ? (
                <div className="py-20 text-center text-slate-500 text-xs border border-dashed border-slate-250 rounded-xl bg-slate-50/40">
                  <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  Vous n'avez soumis aucune entrée de journal pour le moment. Remplissez le formulaire de gauche !
                </div>
              ) : (
                <div className="space-y-3">
                  {myReports.map((report) => (
                    <div key={report.id} className="p-4 border border-slate-150 rounded-xl bg-slate-50/40 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-semibold text-xs text-slate-700 flex items-center">
                            <CalendarDays className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            {new Date(report.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 block">Rapport d'activité • Durée : <strong className="text-slate-650 font-semibold">{report.hoursWorked} heures</strong></span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center ${
                          report.status === 'validated' ? 'bg-emerald-100 text-emerald-800' :
                          report.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {report.status === 'validated' ? (
                            <><Check className="mr-0.5 h-2.5 w-2.5" /> Validé</>
                          ) : report.status === 'rejected' ? (
                            <><XCircle className="mr-0.5 h-2.5 w-2.5" /> Refusé</>
                          ) : (
                            <><Hourglass className="mr-0.5 h-2.5 w-2.5 animate-pulse" /> À valider</>
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs whitespace-pre-line leading-relaxed font-normal">{report.activity}</p>
                      
                      {report.adminComment && (
                        <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100/70 text-xs">
                          <span className="font-bold text-indigo-900 block text-[10px] uppercase">Commentaire Académique</span>
                          <p className="text-indigo-850 mt-0.5 text-[11px] leading-relaxed italic">"{report.adminComment}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: GRADES & RATINGS (MES COTES) */}
        {studentTab === 'grades' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 animate-fade-in bg-gradient-to-tr from-white via-white to-blue-50/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center">
                  <Award className="h-6 w-6 text-indigo-600 mr-2" /> Evaluation académique de stage
                </h3>
                <p className="text-xs text-slate-500 mt-1">Cotes enregistrées par vos promoteurs académiques et industriels du Haut-Katanga.</p>
              </div>

              {/* Total points card */}
              {averageGrade && (
                <div className="bg-blue-600 text-white p-3 rounded-xl flex items-center space-x-3 shadow-md relative overflow-hidden">
                  <div className="bg-blue-700 p-2.5 rounded-lg text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[9px] text-blue-200 block uppercase font-bold tracking-wider">Moyenne Générale</span>
                    <span className="text-base font-extrabold">{averageGrade} / 20</span>
                  </div>
                </div>
              )}
            </div>

            {myGrades.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs border border-dashed border-slate-250 rounded-xl bg-slate-50/40">
                <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                Vos cotes ne sont pas encore publiées par l'administration académique. Elles apparaîtront ici dès que possible.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myGrades.map((g) => {
                  const percent = (g.grade / g.maxGrade) * 100;
                  return (
                    <div key={g.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-350 transition-all space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full">Note active</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-slate-800">{g.grade}</span>
                          <span className="text-xs text-slate-500"> / {g.maxGrade}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-xs md:text-sm line-clamp-1">{g.subject}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Attribuée par : <span className="font-medium text-slate-650">{g.gradedBy}</span></p>
                      </div>

                      {/* Grade visual feedback bar */}
                      <div className="space-y-1">
                        <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${
                            percent >= 80 ? 'bg-emerald-500' :
                            percent >= 60 ? 'bg-blue-500' :
                            percent >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`} style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                          <span>0%</span>
                          <span>{percent}%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {g.comment && (
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 mt-2 text-[11px] text-slate-600 italic">
                          "{g.comment}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: STUDENT ACCEPTANCE NOTEPAD (N0TE D'ACCEPTATION) */}
        {studentTab === 'acceptance' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div>
              <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center">
                <FileSignature className="h-6 w-6 text-purple-600 mr-2" /> Note d'acceptation de stage
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ce document officiel atteste que l'entreprise implantée dans la province du Haut-Katanga a formellement validé votre intégration.
              </p>
            </div>

            {myAcceptance.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs border border-dashed border-slate-250 rounded-xl bg-slate-50/40">
                <AlertCircle className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                Aucune note d'acceptation n'a encore été rattachée à votre compte. 
                Une fois sélectionné, l'entreprise partenaire émettra ce document à destination du Secrétariat Académique.
              </div>
            ) : (
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4 max-w-2xl">
                {myAcceptance.map((a) => (
                  <div key={a.id} className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Compagnie Émettrice</span>
                        <h4 className="font-extrabold text-blue-900 text-sm md:text-base">{a.companyName}</h4>
                        <p className="text-xs text-slate-600 mt-1">Poste de stage accepté : <strong className="text-slate-800">{a.internshipTitle}</strong></p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center tracking-wider shrink-0 ${
                        a.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {a.status === 'approved' ? 'Approuvée par l\'Admin' : a.status === 'rejected' ? 'Rejetée' : 'Vérification Admin'}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Date de Réception</span>
                        <span className="font-medium text-slate-800">{new Date(a.receivedAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Date de signature universitaire</span>
                        <span className="font-medium text-slate-800">{a.issueDate ? new Date(a.issueDate).toLocaleDateString() : 'En attente...'}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white border rounded-lg flex items-center justify-between text-xs mt-2 shadow-2xs">
                      <div className="flex items-center space-x-2">
                        <FileCheck className="h-5 w-5 text-emerald-500" />
                        <div>
                          <span className="font-bold text-slate-800 block">Note_Acceptation_Officielle.pdf</span>
                          <span className="text-[10px] text-slate-400">Taille : 340 Ko • Généré automatiquement</span>
                        </div>
                      </div>
                      <a 
                        href="#download"
                        onClick={(e) => {
                          e.preventDefault();
                          showToast("Téléchargement de la note d'acceptation simulé avec succès.", "success");
                        }}
                        className="p-2 text-blue-650 hover:bg-slate-100 hover:text-blue-750 rounded-lg transition"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. COMPANY SPACE
  // ----------------------------------------------------
  if (currentUser.role === RoleType.COMPANY) {
    const comProf = companies.find(c => c.userId === currentUser.id);
    const myJobs = internships.filter(i => i.companyId === comProf?.id);
    const myJobsIds = myJobs.map(j => j.id);
    const incomingApps = applications.filter(a => myJobsIds.includes(a.internshipId));

    const pendingReview = incomingApps.filter(a => a.status === ApplicationStatus.PENDING);
    const interviewsCount = incomingApps.filter(a => a.status === ApplicationStatus.INTERVIEW);
    const acceptedTotal = incomingApps.filter(a => a.status === ApplicationStatus.ACCEPTED);

    return (
      <div className="space-y-6 animate-fade-in" id="company-workspace">
        <div className="bg-gradient-to-r from-slate-800 to-slate-950 p-6 md:p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Espace Entreprise — {comProf?.name}</h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Gérez vos offres de stage, contactez les talents de l'enseignement académique supérieur et validez les candidatures d'étudiants d'ici dans le Haut-Katanga.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                onClick={() => onViewChange('internships')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition"
              >
                Créer une offre de stage
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 hidden md:block">
            <Building2 className="w-full h-full p-6 text-slate-200" />
          </div>
        </div>

        {/* Short metrics counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Annonces actives</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{myJobs.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-amber-650 font-bold block uppercase">Candidatures à réviser</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{pendingReview.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-indigo-650 font-bold block uppercase">Entretiens prévus</span>
            <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">{interviewsCount.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-emerald-650 font-bold block uppercase font-mono">Stagiaires acceptés</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{acceptedTotal.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Dernières candidatures reçues</h3>
              <button onClick={() => onViewChange('applications')} className="text-xs text-blue-600 font-semibold hover:underline">Voir tout</button>
            </div>

            {incomingApps.length === 0 ? (
              <div className="p-8 text-center rounded-lg border border-dashed border-slate-220 bg-slate-50/50">
                <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-xs">Aucune candidature n'a encore été déposée pour vos publications de stages.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomingApps.slice(0, 4).map((app) => (
                  <div key={app.id} className="p-3.5 border rounded-lg bg-slate-50/40 hover:bg-slate-50 transition flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs md:text-sm">{app.studentName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{app.internshipTitle}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      app.status === ApplicationStatus.ACCEPTED ? 'bg-emerald-100 text-emerald-800' :
                      app.status === ApplicationStatus.REJECTED ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status === ApplicationStatus.PENDING ? 'Reçu' : app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Mes publications de stage</h3>
            <div className="space-y-2">
              {myJobs.slice(0, 4).map((job) => (
                <div key={job.id} className="p-3 border border-slate-100 rounded-lg flex items-center justify-between hover:shadow-2xs transition">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{job.title}</h4>
                    <span className="text-[10px] text-slate-400 capitalize">{job.city}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase shrink-0 ${
                    job.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-105 text-yellow-800 bg-yellow-100'
                  }`}>
                    {job.status === 'published' ? 'Actif' : 'Vérification'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. ADMINISTRATOR SPACE (PREMIUM ACADEMIC CONTROL)
  // ----------------------------------------------------
  if (currentUser.role === RoleType.ADMIN) {
    const totalOffers = internships.length;
    const validatedOffers = internships.filter(i => i.status === 'published').length;
    const awaitingValidation = internships.filter(i => i.status === 'pending').length;
    const totalApps = applications.length;

    const recentUsersJoined = users.slice(0, 4);

    // Filter elements
    const pendingReportsList = dailyReports.filter(r => r.status === 'pending');
    const allReportsList = dailyReports;
    const allGradesList = studentGrades;
    const allAcceptanceList = studentAcceptances;
    const activeStudentProfiles = students;

    // Handle Admin updating a student, validating daily tasks
    const toggleEditReport = (report: DailyReport) => {
      setEditingReportId(report.id);
      setAdminReportUpdates({
        activity: report.activity,
        hoursWorked: report.hoursWorked,
        status: report.status,
        adminComment: report.adminComment || ''
      });
    };

    const handleSaveReportUpdates = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingReportId) return;

      updateDailyReportByAdmin(editingReportId, {
        activity: adminReportUpdates.activity,
        hoursWorked: Number(adminReportUpdates.hoursWorked),
        status: adminReportUpdates.status,
        adminComment: adminReportUpdates.adminComment
      });

      setEditingReportId(null);
    };

    // Handle Admin creating a grade
    const handleAddGradeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!gradeForm.studentId) {
        showToast("Veuillez sélectionner un étudiant.", "error");
        return;
      }
      if (!gradeForm.subject.trim()) {
        showToast("Veuillez renseigner le libellé du cours / aspect de stage.", "error");
        return;
      }

      const selectedStudent = students.find(s => s.id === gradeForm.studentId);
      if (!selectedStudent) return;

      addStudentGrade(
        gradeForm.studentId,
        selectedStudent.name,
        gradeForm.subject,
        Number(gradeForm.grade),
        gradeForm.comment
      );

      setGradeForm({
        studentId: '',
        subject: 'Rapport final de Stage',
        grade: 16,
        comment: ''
      });
    };

    return (
      <div className="space-y-6 animate-fade-in" id="admin-workspace">
        {/* Banner header to establish academic authority */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-red-950 text-red-400 border border-red-900 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>Rôle : Administrateur Général</span>
            </div>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">Panneau de Contrôle Académique</h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl">
              Inspectez et modifiez les rapports journaliers rédigés par les stagiaires de l'Université, validez d'un seul clic leurs travaux pratiques et attribuez-leur des cotes académiques sur 20.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start md:self-center shrink-0">
            <button 
              onClick={() => { setAdminTab('reports'); }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition"
            >
              Valider les travaux
            </button>
            <button 
              onClick={() => { setAdminTab('grades'); }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition"
            >
              Attribuer notes / cotes
            </button>
          </div>
        </div>

        {/* Academic admin sub-tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-white p-2 rounded-xl shadow-2xs gap-1">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center shrink-0 transition-all ${
              adminTab === 'overview' 
                ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Layers className="h-4 w-4 mr-2" />
            Vue Générale & Inscriptions
          </button>
          <button
            onClick={() => setAdminTab('reports')}
            className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center shrink-0 transition-all ${
              adminTab === 'reports' 
                ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Vérification des Rapports ({pendingReportsList.length} en attente)
          </button>
          <button
            onClick={() => setAdminTab('grades')}
            className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center shrink-0 transition-all ${
              adminTab === 'grades' 
                ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Award className="h-4 w-4 mr-2" />
            Gestion des Cotes ({allGradesList.length})
          </button>
          <button
            onClick={() => setAdminTab('acceptance')}
            className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center shrink-0 transition-all ${
              adminTab === 'acceptance' 
                ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileSignature className="h-4 w-4 mr-2" />
            Notes d'Acceptation ({allAcceptanceList.length})
          </button>
        </div>

        {/* Tab 1: OVERVIEW & USERS */}
        {adminTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Numeric performance indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Publications de Stages</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{totalOffers}</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs relative">
                <span className="text-[10px] text-amber-650 font-bold block uppercase">Stages en attente</span>
                <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{awaitingValidation}</span>
                {awaitingValidation > 0 && <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>}
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-indigo-500 font-bold block uppercase">Candidatures Soumises</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{totalApps}</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-emerald-650 font-bold block uppercase">Membres Actifs</span>
                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{users.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Offers list section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center-center">
                  <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" /> Offres de stages requérant approbation
                  </h3>
                  <button onClick={() => onViewChange('internships')} className="text-xs text-blue-600 font-bold hover:underline">Accéder à la liste</button>
                </div>

                {awaitingValidation === 0 ? (
                  <div className="p-10 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
                    <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium text-xs">Aucune approbation en suspens. Toutes les publications sont en ligne.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {internships.filter(i => i.status === 'pending').map((job) => (
                      <div key={job.id} className="p-4 border border-slate-150 rounded-xl bg-orange-50/10 hover:bg-orange-50/20 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs md:text-sm">{job.title}</h4>
                          <span className="text-xs text-indigo-900 block mt-1">Émis par : <strong>{job.companyName}</strong> • Lieu : {job.city}</span>
                        </div>
                        <button 
                          onClick={() => onViewChange('internships')}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold self-start md:self-auto shadow-xs"
                        >
                          Examiner maintenant
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Members panel */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Membres récents</h3>
                  <button onClick={() => onViewChange('users')} className="text-xs text-blue-600 font-bold hover:underline">Gérer tous</button>
                </div>

                <div className="space-y-3 divide-y divide-slate-150">
                  {recentUsersJoined.map(u => (
                    <div key={u.id} className="pt-3 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{u.name}</h4>
                        <span className="text-slate-450 text-[10px] block">{u.email}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                        u.role === RoleType.ADMIN ? 'bg-red-100 text-red-800' :
                        u.role === RoleType.COMPANY ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DAILY REPORT REVIEWER (VALIDATION & MODIFICATION DES RAPPORTS DE STAGES DES ETUDIANTS) */}
        {adminTab === 'reports' && (
          <div className="space-y-6 animate-fade-inGrid">
            {/* Header info */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-sm md:text-base">Espace de Validation & d'Édition des Travaux</h3>
              <p className="text-xs text-slate-500 mt-1">
                Conformément aux directives de l'Université, vous disposez d'un droit de modification et de validation sur tous les rapports journaliers transmis par les étudiants.
              </p>
            </div>

            {/* Editing modal lookalike if active */}
            {editingReportId && (
              <div className="bg-indigo-50 border-2 border-indigo-200 p-5 rounded-2xl shadow-sm space-y-4 animate-fade-in">
                <div className="flex justify-between items-center border-b border-indigo-150 pb-2">
                  <h4 className="font-bold text-indigo-950 text-xs md:text-sm flex items-center">
                    <Edit2 className="mr-2 h-4 w-4 text-indigo-600" />
                    Modification & Décision Académique du Rapport
                  </h4>
                  <button 
                    onClick={() => setEditingReportId(null)}
                    className="text-[11px] text-slate-500 uppercase font-black hover:text-slate-800"
                  >
                    Fermer [X]
                  </button>
                </div>

                <form onSubmit={handleSaveReportUpdates} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Contenu rédigé par l'étudiant (Editable par l'Admin)</label>
                      <textarea 
                        value={adminReportUpdates.activity}
                        rows={5}
                        onChange={(e) => setAdminReportUpdates({ ...adminReportUpdates, activity: e.target.value })}
                        className="w-full text-xs p-3 rounded-lg border border-indigo-250 bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Heures validées</label>
                      <input 
                        type="number" 
                        value={adminReportUpdates.hoursWorked}
                        onChange={(e) => setAdminReportUpdates({ ...adminReportUpdates, hoursWorked: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Statut universitaire</label>
                      <select
                        value={adminReportUpdates.status}
                        onChange={(e) => setAdminReportUpdates({ ...adminReportUpdates, status: e.target.value as any })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                      >
                        <option value="pending">En attente de contrôle</option>
                        <option value="validated">Validé & Approuvé</option>
                        <option value="rejected">Refusé (À réécrire)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Annotation / Avis académique</label>
                      <input 
                        type="text"
                        value={adminReportUpdates.adminComment}
                        placeholder="Ex: Excellent travail ou Expliquez le motif de rejet"
                        onChange={(e) => setAdminReportUpdates({ ...adminReportUpdates, adminComment: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button 
                        type="submit" 
                        className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                      >
                        Sauvegarder & Signer
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditingReportId(null)}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* List of reports */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Tous les rapports transmis par les stagiaires</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">{allReportsList.length} total</span>
              </h3>

              {allReportsList.length === 0 ? (
                <p className="text-xs text-slate-500 py-10 text-center">Aucun journalier transmis par les élèves actuellement.</p>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {allReportsList.map((rep) => (
                    <div key={rep.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{rep.studentName}</h4>
                          <span className="text-[10px] text-slate-450 block mt-0.5">Le {new Date(rep.date).toLocaleDateString()} • Durée déclarée : <strong className="text-slate-650">{rep.hoursWorked} h</strong></span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase inline-flex items-center ${
                            rep.status === 'validated' ? 'bg-emerald-100 text-emerald-800' :
                            rep.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {rep.status}
                          </span>

                          <button 
                            onClick={() => toggleEditReport(rep)}
                            className="p-1 px-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-750 text-slate-650 text-[10px] font-semibold border rounded-md transition flex items-center gap-1"
                          >
                            <Edit2 className="h-3 w-3" /> Modifier & Valider
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-705">
                        {rep.activity}
                      </div>

                      {rep.adminComment && (
                        <div className="p-2.5 bg-indigo-50/30 rounded-lg border border-indigo-100/50 text-xs flex gap-2">
                          <Check className="h-4 w-4 text-indigo-650 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-indigo-950 text-[9px] uppercase tracking-wider">Avis universitaire :</span>
                            <p className="text-indigo-850 italic mt-0.5 font-medium">"{rep.adminComment}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: GRADES & RATINGS MANAGER (ATTRIBUTION DES COTES ET RETROACTION) */}
        {adminTab === 'grades' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Input cote Form */}
            <div className="lg:col-span-1">
              <form onSubmit={handleAddGradeSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-4">
                <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5 text-emerald-600" />
                  Nouvelle Cote
                </h3>
                <p className="text-xs text-slate-500">Attribuez une pondération sur 20 à un stagiaire pour des travaux éligibles.</p>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Sélectionner l'étudiant</label>
                  <select
                    value={gradeForm.studentId}
                    onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Choisir un stagiaire --</option>
                    {activeStudentProfiles.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Module ou matière évaluée</label>
                  <select
                    value={gradeForm.subject}
                    onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50"
                  >
                    <option value="Assiduité & Aptitudes Pratiques">Assiduité & Aptitudes Pratiques</option>
                    <option value="Rapports Journaliers de Stage">Rapports Journaliers de Stage</option>
                    <option value="Rapport final de Stage">Rapport final de Stage</option>
                    <option value="Soutenance & Mémoire Professionnel">Soutenance & Mémoire Professionnel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Cote obtenue (Sur 20)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="20"
                    step="0.5"
                    value={gradeForm.grade}
                    onChange={(e) => setGradeForm({ ...gradeForm, grade: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Observations / Retours de l'évaluateur</label>
                  <textarea 
                    value={gradeForm.comment}
                    rows={3}
                    onChange={(e) => setGradeForm({ ...gradeForm, comment: e.target.value })}
                    placeholder="Saisissez des commentaires encourageants ou des axes d'amélioration"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Publier la Note
                </button>
              </form>
            </div>

            {/* Existing cotes database table */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Palmarès des évaluations publiées</h3>
              
              {allGradesList.length === 0 ? (
                <p className="text-xs text-slate-500 py-10 text-center">Aucune cote attribuée pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {allGradesList.map((g) => (
                    <div key={g.id} className="p-4 border border-slate-150 rounded-xl bg-slate-50/20 hover:bg-slate-50 transition space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{g.studentName}</h4>
                          <span className="text-[10px] text-blue-800 font-bold block mt-1">{g.subject}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-indigo-900">{g.grade} / {g.maxGrade}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Émis par : {g.gradedBy}</span>
                        </div>
                      </div>

                      {g.comment && (
                        <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                          "{g.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: STUDENT ACCEPTANCE NOTEPAD VALIDATION (NOTES D'ACCEPTATION D'ENTREPRISES PARTENAIRES) */}
        {adminTab === 'acceptance' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 animate-fade-in animate-duration-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center">
                <FileSignature className="h-6 w-6 text-purple-600 mr-2" />
                Notes d'Acceptations Professionnelles des Étudiants
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Visualisez et contrôlez le statut d'accueil et de parrainage des stagiaires auprès des mines et banques émettrices du Haut-Katanga.
              </p>
            </div>

            {allAcceptanceList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10">Aucune note d'acceptation de stage répertoriée actuellement dans le système local.</p>
            ) : (
              <div className="space-y-4">
                {allAcceptanceList.map((a) => (
                  <div key={a.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-bold rounded-sm">Haut-Katanga Province</span>
                        <span className="text-[10px] font-mono text-slate-400 font-medium">Acceptance ID: #{a.id}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm md:text-base">{a.studentName}</h4>
                      <p className="text-xs text-slate-600">Reçu chez : <strong>{a.companyName}</strong> — {a.internshipTitle}</p>
                      <span className="text-[10px] text-slate-400 block">Soumission du document : {new Date(a.receivedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Statut Actuel</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-block mt-0.5 ${
                          a.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          a.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {a.status === 'approved' ? 'Approuvé' : a.status === 'rejected' ? 'Rejeté' : 'En attente de signature'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateAcceptanceStatus(a.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                          disabled={a.status === 'approved'}
                        >
                          Approuver
                        </button>
                        <button 
                          onClick={() => updateAcceptanceStatus(a.id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition"
                          disabled={a.status === 'rejected'}
                        >
                          Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}
