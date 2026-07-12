import { useState } from 'react';
import { RoleType } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { ApplicationStatus } from '../../types';
import { apiClient, type AppSnapshot } from '../../services/apiClient';
import { buildExportSheets, buildPdfLines, exportPdf, exportWorkbook } from '../../services/exportFiles';
import {
  Award,
  TrendingUp,
  Layers,
  Briefcase,
  Users,
  FileText,
  Download,
  CalendarCheck,
  MessageSquare,
  Send
} from 'lucide-react';

export default function ReportsPage({
  impersonateSupervisorId
}: {
  impersonateSupervisorId?: string;
}) {
  const {
    internships,
    applications,
    companies,
    users,
    notifications,
    auditLogs,
    showToast,
    currentUser,
    dailyReports,
    studentGrades,
    students,
    studentAcceptances,
    attendanceRecords,
    conversations,
    messages,
    archives,
    updateDailyReportByAdmin,
    addStudentGrade,
    updateAcceptanceStatus,
    reviewAttendanceRecord,
    sendMessage,
    getOrCreateConversation
  } = useApp();

  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'excel' | null>(null);
  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});

  // KPI computations
  const totalOffers = internships.length;
  const publishedCount = internships.filter((i) => i.status === 'published').length;
  const pendingCount = internships.filter((i) => i.status === 'pending').length;

  const totalApps = applications.length;
  const acceptedApps = applications.filter((a) => [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(a.status)).length;
  const pendingApps = applications.filter((a) => a.status === ApplicationStatus.PENDING).length;
  const scheduledApps = applications.filter((a) => a.status === ApplicationStatus.INTERVIEW).length;
  const rejectedApps = applications.filter((a) => a.status === ApplicationStatus.REJECTED).length;

  const currentSnapshot: AppSnapshot = {
    users,
    students,
    companies,
    internships,
    applications,
    notifications,
    auditLogs,
    dailyReports,
    studentGrades,
    studentAcceptances,
    attendanceRecords,
    conversations,
    messages,
    archives
  };

  const triggerExport = async (format: 'pdf' | 'excel', title: string) => {
    setDownloadingFormat(format);
    try {
      const snapshot = (await apiClient.getSnapshot()) || currentSnapshot;
      if (format === 'pdf') {
        exportPdf(`${title}.pdf`, 'Rapport des stages academiques', buildPdfLines(snapshot));
      } else {
        exportWorkbook(`${title}.xlsx`, buildExportSheets(snapshot));
      }
      showToast(
        `Exportation reussie. Le fichier "${title}.${format === 'pdf' ? 'pdf' : 'xlsx'}" a ete genere avec les donnees disponibles.`,
        'success'
      );
    } catch (error: any) {
      showToast(error.message || "L'exportation a echoue.", 'error');
    } finally {
      setDownloadingFormat(null);
    }
  };

  // Supervisor workspace (company-created supervisors)
  const activeSupervisorId =
    impersonateSupervisorId ?? (currentUser?.role === RoleType.SUPERVISOR ? currentUser.id : undefined);
  const activeSupervisor = activeSupervisorId ? users.find((user) => user.id === activeSupervisorId && user.role === RoleType.SUPERVISOR) : undefined;
  const supervisedStudents = activeSupervisor
    ? students.filter((student) =>
        !student.isArchived &&
        [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(student.status || ApplicationStatus.PENDING) &&
        student.supervisorId === activeSupervisor.id &&
        (activeSupervisor.assignedStudentIds || []).includes(student.id)
      )
    : [];

  return (
    <div className="space-y-8 animate-fade-in text-xs md:text-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            Visualisez les statistiques globales et gérez les rapports/notes pour vos étudiants.
          </p>
        </div>
      </div>

      {/* CORE STATS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-550 block text-[11px] uppercase font-semibold">Moyenne postulants/offres</span>
            <span className="text-xl md:text-2xl font-black text-slate-900">
              {publishedCount > 0 ? (totalApps / publishedCount).toFixed(1) : 0} par stage
            </span>
            <span className="text-[10px] text-purple-500 block mt-0.5">Demande étudiante forte</span>
          </div>
        </div>
      </div>

      {/* Supervisor / ADMIN actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center">
              <Briefcase className="h-4.5 w-4.5 mr-2 text-emerald-600" />
              Mes étudiants supervisés
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Filtré automatiquement par <span className="font-semibold">supervisorId</span>.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 italic">
            {activeSupervisorId ? 'Mode superviseur actif' : 'Aucun superviseur actif'}
          </div>
        </div>

        {activeSupervisorId ? (
          <div className="space-y-4">
            {supervisedStudents.length === 0 ? (
              <p className="text-slate-500 text-sm">Aucun étudiant ne vous est assigné pour le moment.</p>
            ) : (
              supervisedStudents.map((s) => (
                  <div key={s.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900">{s.name}</h4>
                        <div className="text-xs text-slate-500">{s.email}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Reports */}
                      <div>
                        <h5 className="font-semibold">Rapports journaliers</h5>
                        <div className="space-y-2 mt-2">
                          {dailyReports.filter((r) => r.studentId === s.id).length === 0 ? (
                            <p className="text-sm text-slate-500">Aucun rapport.</p>
                          ) : (
                            dailyReports
                              .filter((r) => r.studentId === s.id)
                              .map((r) => (
                                <div
                                  key={r.id}
                                  className="p-2 bg-slate-50 rounded-md flex items-start justify-between gap-3"
                                >
                                  <div>
                                    <div className="font-semibold text-slate-900">{r.date}</div>
                                    <div className="text-slate-600 text-[13px]">{r.activity}</div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                                        r.status === 'pending'
                                          ? 'bg-amber-100 text-amber-800'
                                          : r.status === 'validated'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {r.status}
                                    </span>

                                    {r.status !== 'validated' && (
                                      <button
                                        onClick={() =>
                                          updateDailyReportByAdmin(r.id, { status: 'validated' })
                                        }
                                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs hover:bg-emerald-700"
                                      >
                                        Valider
                                      </button>
                                    )}
                                    {r.status !== 'rejected' && (
                                      <button
                                        onClick={() =>
                                          updateDailyReportByAdmin(r.id, { status: 'rejected', supervisorComment: 'A completer puis soumettre a nouveau.' })
                                        }
                                        className="px-3 py-1.5 bg-rose-600 text-white rounded-md text-xs hover:bg-rose-700"
                                      >
                                        Refuser
                                      </button>
                                    )}

                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>

                      {/* Grades + Acceptance */}
                      <div>
                        <h5 className="font-semibold">Notes attribuées</h5>
                        <div className="mt-2 space-y-2">
                          {studentGrades.filter((g) => g.studentId === s.id).length === 0 ? (
                            <p className="text-sm text-slate-500">Aucune note pour l'instant.</p>
                          ) : (
                            studentGrades
                              .filter((g) => g.studentId === s.id)
                              .map((g) => (
                                <div key={g.id} className="p-2 bg-slate-50 rounded-md flex items-start justify-between gap-3">
                                  <div>
                                    <div className="font-semibold text-slate-900">{g.subject}</div>
                                    <div className="text-slate-600 text-[13px]">
                                      {g.grade}/{g.maxGrade} — {g.comment}
                                    </div>
                                  </div>
                                  <div className="text-sm text-slate-500">{g.gradedBy}</div>
                                </div>
                              ))
                          )}

                          <div className="pt-2 border-t mt-2">
                            <h6 className="font-semibold text-sm">Ajouter une note</h6>
                            <AddGradeForm
                              onAdd={(subject, grade, comment) =>
                                addStudentGrade(s.id, s.name, subject, grade, comment)
                              }
                            />
                          </div>

                          <div className="pt-4 border-t mt-4">
                            <h6 className="font-semibold text-sm">Note d'acceptation</h6>
                            <div className="space-y-3 mt-3">
                              {studentAcceptances.filter((a) => a.studentId === s.id).length === 0 ? (
                                <p className="text-sm text-slate-500">Aucune note d'acceptation associée.</p>
                              ) : (
                                studentAcceptances
                                  .filter((a) => a.studentId === s.id)
                                  .map((a) => (
                                    <div key={a.id} className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <div className="text-slate-900 font-semibold">{a.internshipTitle}</div>
                                          <div className="text-[11px] text-slate-500">{a.companyName}</div>
                                        </div>
                                        <span
                                          className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                                            a.status === 'approved'
                                              ? 'bg-emerald-100 text-emerald-700'
                                              : a.status === 'rejected'
                                                ? 'bg-rose-100 text-rose-700'
                                                : 'bg-amber-100 text-amber-700'
                                          }`}
                                        >
                                          {a.status === 'approved' ? 'Approuvée' : a.status === 'rejected' ? 'Rejetée' : 'En attente'}
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap gap-2">
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
                                      </div>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h5 className="font-semibold flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4 text-blue-600" />
                          Presences
                        </h5>
                        <div className="space-y-2 mt-2">
                          {attendanceRecords.filter((record) => record.studentId === s.id).length === 0 ? (
                            <p className="text-sm text-slate-500">Aucune presence signalee.</p>
                          ) : (
                            attendanceRecords
                              .filter((record) => record.studentId === s.id)
                              .map((record) => (
                                <div key={record.id} className="p-2 bg-slate-50 rounded-md flex items-start justify-between gap-3">
                                  <div>
                                    <div className="font-semibold text-slate-900">{record.date}</div>
                                    <div className="text-slate-600 text-[13px]">
                                      Arrivee {record.arrivalTime}{record.departureTime ? ` - Sortie ${record.departureTime}` : ''}
                                    </div>
                                    {record.comment && <div className="text-[12px] text-slate-500">{record.comment}</div>}
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                                      record.status === 'validee' ? 'bg-emerald-100 text-emerald-800' :
                                      record.status === 'refusee' ? 'bg-rose-100 text-rose-800' :
                                      'bg-amber-100 text-amber-800'
                                    }`}>
                                      {record.status}
                                    </span>
                                    {record.status === 'en_attente' && (
                                      <div className="flex gap-1">
                                        <button onClick={() => reviewAttendanceRecord(record.id, 'validee')} className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px]">Valider</button>
                                        <button onClick={() => reviewAttendanceRecord(record.id, 'refusee', 'Presence refusee par le superviseur.')} className="px-2 py-1 bg-rose-600 text-white rounded text-[11px]">Refuser</button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-indigo-600" />
                          Conversation
                        </h5>
                        {(() => {
                          const conversationId = getOrCreateConversation(s.id, activeSupervisorId);
                          if (!conversationId) {
                            return (
                              <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                                Conversation disponible apres assignation officielle.
                              </div>
                            );
                          }
                          const threadMessages = messages.filter((message) => message.conversationId === conversationId);
                          return (
                            <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-3 space-y-3">
                              <div className="max-h-40 overflow-y-auto space-y-2">
                                {threadMessages.length === 0 ? (
                                  <p className="text-sm text-slate-500">Aucun message.</p>
                                ) : (
                                  threadMessages.map((message) => (
                                    <div key={message.id} className="rounded bg-white p-2 text-[12px] text-slate-700 border border-slate-100">
                                      <div className="font-bold text-slate-900">{message.senderRole}</div>
                                      <div>{message.body}</div>
                                      {message.attachmentName && <div className="text-slate-500 mt-1">Piece jointe: {message.attachmentName}</div>}
                                    </div>
                                  ))
                                )}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  value={messageDrafts[conversationId] || ''}
                                  onChange={(event) => setMessageDrafts({ ...messageDrafts, [conversationId]: event.target.value })}
                                  className="flex-1 rounded border border-slate-300 p-2 text-xs"
                                  placeholder={`Message pour ${s.name}`}
                                />
                                <button
                                  onClick={() => {
                                    sendMessage(conversationId, messageDrafts[conversationId] || '');
                                    setMessageDrafts({ ...messageDrafts, [conversationId]: '' });
                                  }}
                                  className="px-3 py-2 bg-indigo-600 text-white rounded text-xs font-bold"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            Connectez-vous en tant que superviseur (maître de stage) pour gérer rapports et notes.
          </div>
        )}
      </div>

      {/* Exports */}
      <div className="bg-white p-6 rounded-xl border border-slate-205 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Téléchargements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50/60 border rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs md:text-sm">Rapport annuel des stages</span>
                <span className="text-[10px] text-slate-400">Statistiques et synthèse</span>
              </div>
            </div>
            <button
              disabled={downloadingFormat !== null}
              onClick={() => triggerExport('pdf', 'Rapport_Stages_Academique')}
              className="px-3 py-2 bg-white border rounded-md text-slate-600 font-semibold text-[10px] hover:bg-slate-50"
            >
              PDF
            </button>
          </div>

          <div className="p-4 bg-slate-50/60 border rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs md:text-sm">Bilan candidatures</span>
                <span className="text-[10px] text-slate-400">Taux et tendances</span>
              </div>
            </div>
            <button
              disabled={downloadingFormat !== null}
              onClick={() => triggerExport('excel', 'Bilan_Candidatures_Excel')}
              className="px-3 py-2 bg-white border rounded-md text-slate-600 font-semibold text-[10px] hover:bg-slate-50"
            >
              EXCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddGradeForm({
  onAdd
}: {
  onAdd: (subject: string, grade: number, comment?: string) => void;
}) {
  const [subject, setSubject] = useState('Travail pratique');
  const [grade, setGrade] = useState<number>(15);
  const [comment, setComment] = useState('');

  return (
    <div className="space-y-2">
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 border rounded-md text-sm"
        placeholder="Sujet"
      />
      <div className="flex gap-2">
        <input
          type="number"
          value={grade}
          onChange={(e) => setGrade(Number(e.target.value))}
          className="w-28 p-2 border rounded-md text-sm"
          min={0}
          max={20}
          step={0.5}
        />
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 p-2 border rounded-md text-sm"
          placeholder="Commentaire (optionnel)"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => {
            onAdd(subject, grade, comment);
            setComment('');
          }}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
