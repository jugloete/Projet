import { useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Application, ApplicationStatus, RoleType } from '../../types';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  MessageSquare,
  UserCheck,
  XCircle
} from 'lucide-react';

const statusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'En attente',
  [ApplicationStatus.INTERVIEW]: 'Entretien demande',
  [ApplicationStatus.ACCEPTED]: 'Accepte',
  [ApplicationStatus.REJECTED]: 'Rejete',
  [ApplicationStatus.IN_INTERNSHIP]: 'En stage',
  [ApplicationStatus.COMPLETED]: 'Termine',
  [ApplicationStatus.ARCHIVED]: 'Archive'
};

function statusTheme(status: ApplicationStatus) {
  if (status === ApplicationStatus.ACCEPTED || status === ApplicationStatus.IN_INTERNSHIP) {
    return { box: 'bg-emerald-50 text-emerald-800 border-emerald-100', icon: CheckCircle2 };
  }
  if (status === ApplicationStatus.REJECTED || status === ApplicationStatus.ARCHIVED) {
    return { box: 'bg-red-50 text-red-800 border-red-100', icon: XCircle };
  }
  if (status === ApplicationStatus.INTERVIEW) {
    return { box: 'bg-indigo-50 text-indigo-800 border-indigo-100', icon: Calendar };
  }
  return { box: 'bg-amber-50 text-amber-800 border-amber-100', icon: Clock };
}

export default function ApplicationsList() {
  const {
    currentUser,
    applications,
    studentProfile,
    companyProfile,
    internships,
    companies,
    users,
    updateApplicationStatus,
    showToast
  } = useApp();

  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState('all');
  const [decisionStatus, setDecisionStatus] = useState<ApplicationStatus>(ApplicationStatus.PENDING);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionStartDate, setDecisionStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [decisionEndDate, setDecisionEndDate] = useState('');
  const [decisionDepartmentId, setDecisionDepartmentId] = useState('');
  const [decisionSpecialty, setDecisionSpecialty] = useState('');
  const [decisionSupervisorId, setDecisionSupervisorId] = useState('');

  const companyDepartments = companyProfile?.departments || [];
  const companySupervisors = users.filter((user) => user.role === RoleType.SUPERVISOR && user.companyId === companyProfile?.id);

  const displayApps = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === RoleType.STUDENT) {
      return applications.filter((app) => app.studentId === studentProfile?.id);
    }
    if (currentUser.role === RoleType.COMPANY) {
      return applications.filter((app) => {
        const companyId = app.companyId || internships.find((internship) => internship.id === app.internshipId)?.companyId;
        return companyId === companyProfile?.id;
      });
    }
    if (selectedCompanyId !== 'all') {
      return applications.filter((app) => {
        const companyId = app.companyId || internships.find((internship) => internship.id === app.internshipId)?.companyId;
        return companyId === selectedCompanyId;
      });
    }
    return applications;
  }, [applications, companyProfile?.id, currentUser, internships, selectedCompanyId, studentProfile?.id]);

  if (!currentUser) return null;

  const beginDecision = (app: Application, status: ApplicationStatus) => {
    const firstDepartment = companyDepartments[0];
    setEditingAppId(app.id);
    setDecisionStatus(status);
    setDecisionDepartmentId(app.departmentId || firstDepartment?.id || '');
    setDecisionSpecialty(app.specialty || companyProfile?.acceptedSpecialties?.[0] || '');
    setDecisionSupervisorId(status === ApplicationStatus.REJECTED ? '' : app.supervisorId || companySupervisors[0]?.id || '');
    setDecisionStartDate(app.startDate || new Date().toISOString().slice(0, 10));
    setDecisionEndDate(app.endDate || '');

    if (status === ApplicationStatus.ACCEPTED) {
      setDecisionNotes('Felicitations, votre profil est retenu pour ce stage. Consultez les informations de debut, de fin et de supervision.');
    } else if (status === ApplicationStatus.INTERVIEW) {
      setDecisionNotes('Votre candidature nous interesse. Merci de vous rendre disponible pour un entretien de validation.');
    } else if (status === ApplicationStatus.REJECTED) {
      setDecisionNotes('Merci pour votre candidature. Apres examen, votre profil n est pas retenu pour cette periode.');
    }
  };

  const submitDecision = (app: Application) => {
    const department = companyDepartments.find((item) => item.id === decisionDepartmentId);
    updateApplicationStatus(app.id, decisionStatus, decisionNotes, {
      departmentId: decisionDepartmentId,
      departmentName: department?.name || app.departmentName,
      specialty: decisionSpecialty,
      supervisorId: decisionStatus === ApplicationStatus.REJECTED ? undefined : decisionSupervisorId,
      startDate: decisionStartDate,
      endDate: decisionEndDate,
      acceptanceNote: decisionStatus === ApplicationStatus.ACCEPTED ? decisionNotes : undefined,
      interviewNote: decisionStatus === ApplicationStatus.INTERVIEW ? decisionNotes : undefined,
      rejectionReason: decisionStatus === ApplicationStatus.REJECTED ? decisionNotes : undefined
    });
    setEditingAppId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-sm font-medium text-slate-500">
        {currentUser.role === RoleType.STUDENT
          ? "Suivez l'etat de vos demandes de stage."
          : 'Traitez les candidatures, planifiez les entretiens, acceptez ou rejetez les etudiants.'}
      </p>

      {currentUser.role === RoleType.ADMIN && (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-2xs md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-extrabold uppercase tracking-wide text-slate-800">Entreprise concernee</h3>
            <p className="text-slate-500">Filtre administratif de consultation.</p>
          </div>
          <select
            value={selectedCompanyId}
            onChange={(event) => setSelectedCompanyId(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 md:w-80"
          >
            <option value="all">Toutes les entreprises ({applications.length})</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>
      )}

      {displayApps.length === 0 ? (
        <div className="rounded-xl border bg-white p-16 text-center shadow-2xs">
          <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">Aucune candidature disponible</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
            Les demandes liees a votre espace apparaitront ici automatiquement.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayApps.map((app) => {
            const expanded = expandedAppId === app.id;
            const editing = editingAppId === app.id;
            const theme = statusTheme(app.status);
            const StatusIcon = theme.icon;
            const supervisor = users.find((user) => user.id === app.supervisorId);

            return (
              <div key={app.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setExpandedAppId(expanded ? null : app.id)}
                  className="flex w-full flex-col gap-4 p-5 text-left hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                    <h3 className="truncate text-sm font-extrabold text-slate-900 md:text-base">{app.internshipTitle}</h3>
                    <p className="text-xs font-semibold text-slate-500">{app.companyName}</p>
                    {currentUser.role !== RoleType.STUDENT && (
                      <span className="block text-xs text-slate-600">
                        Candidat: <strong className="text-blue-700">{app.studentName}</strong> ({app.studentEmail})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${theme.box}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusLabels[app.status] || app.status}
                    </span>
                    {expanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                  </div>
                </button>

                {expanded && (
                  <div className="space-y-5 border-t border-slate-100 bg-slate-50/60 p-6 text-xs md:text-sm">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <InfoTile label="Departement" value={app.departmentName || 'Non precise'} />
                      <InfoTile label="Specialite" value={app.specialty || 'Non precisee'} />
                      <InfoTile label="Superviseur" value={supervisor?.name || 'Non assigne'} />
                      <InfoTile label="Debut" value={app.startDate || 'A definir'} />
                      <InfoTile label="Fin" value={app.endDate || 'A definir'} />
                      <InfoTile label="Archivage" value={app.expiresAt ? new Date(app.expiresAt).toLocaleDateString() : 'Non programme'} />
                    </div>

                    <div className="rounded-lg border border-slate-150 bg-white p-4">
                      <span className="mb-2 flex items-center text-xs font-bold uppercase tracking-wide text-slate-600">
                        <MessageSquare className="mr-1 h-4 w-4 text-indigo-500" />
                        Motivation
                      </span>
                      <p className="whitespace-pre-line rounded-md border border-slate-100 bg-slate-50 p-3 text-xs italic leading-relaxed text-slate-700">
                        {app.coverLetter || 'Aucune lettre de motivation.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-slate-150 bg-white p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <span className="block text-xs font-bold text-slate-800">CV soumis</span>
                          <span className="text-[10px] text-slate-400">{app.cvName || 'CV non renseigne'}</span>
                        </div>
                      </div>
                      <a
                        href={app.cvUrl && app.cvUrl !== '#' ? app.cvUrl : '#cv'}
                        target={app.cvUrl && app.cvUrl !== '#' ? '_blank' : undefined}
                        rel={app.cvUrl && app.cvUrl !== '#' ? 'noreferrer' : undefined}
                        onClick={(event) => {
                          if (!app.cvUrl || app.cvUrl === '#') {
                            event.preventDefault();
                            showToast('Aucun fichier CV ouvrable pour cette candidature.', 'error');
                          }
                        }}
                        className={`flex items-center gap-1 text-xs font-bold ${app.cvUrl && app.cvUrl !== '#' ? 'text-blue-600 hover:text-blue-800' : 'text-slate-400 cursor-not-allowed'}`}
                      >
                        Ouvrir <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {app.notes && (
                      <div className="rounded-lg border border-blue-150 bg-blue-50/60 p-4 text-xs">
                        <span className="block font-bold uppercase text-blue-900">Message entreprise</span>
                        <p className="mt-1.5 whitespace-pre-wrap font-medium italic text-blue-950">{app.notes}</p>
                      </div>
                    )}

                    {currentUser.role === RoleType.COMPANY && !editing && (
                      <div className="border-t border-slate-200 pt-4">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Decision</span>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => beginDecision(app, ApplicationStatus.INTERVIEW)} className="rounded-lg bg-indigo-100 px-3.5 py-2 text-xs font-bold text-indigo-900 hover:bg-indigo-200">
                            Demander un entretien
                          </button>
                          <button onClick={() => beginDecision(app, ApplicationStatus.ACCEPTED)} className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                            Accepter
                          </button>
                          <button onClick={() => beginDecision(app, ApplicationStatus.REJECTED)} className="rounded-lg bg-red-50 px-3.5 py-2 text-xs font-bold text-red-900 hover:bg-red-100">
                            Rejeter
                          </button>
                        </div>
                      </div>
                    )}

                    {editing && (
                      <div className="space-y-3 rounded-lg border bg-white p-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700">
                          <UserCheck className="h-4 w-4 text-emerald-600" />
                          Parametres de decision
                        </div>

                        {(decisionStatus === ApplicationStatus.ACCEPTED || decisionStatus === ApplicationStatus.IN_INTERNSHIP) && (
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <DecisionField label="Date de debut" type="date" value={decisionStartDate} onChange={setDecisionStartDate} />
                            <DecisionField label="Date de fin" type="date" value={decisionEndDate} onChange={setDecisionEndDate} />
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">Departement</label>
                              <select value={decisionDepartmentId} onChange={(event) => setDecisionDepartmentId(event.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 text-xs">
                                <option value="">Choisir</option>
                                {companyDepartments.map((department) => (
                                  <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">Superviseur</label>
                              <select value={decisionSupervisorId} onChange={(event) => setDecisionSupervisorId(event.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 text-xs">
                                <option value="">Aucun</option>
                                {companySupervisors.map((supervisor) => (
                                  <option key={supervisor.id} value={supervisor.id}>{supervisor.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {(decisionStatus === ApplicationStatus.ACCEPTED || decisionStatus === ApplicationStatus.INTERVIEW) && (
                          <DecisionField label="Specialite confirmee" value={decisionSpecialty} onChange={setDecisionSpecialty} />
                        )}

                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">Message officiel</label>
                          <textarea
                            rows={3}
                            value={decisionNotes}
                            onChange={(event) => setDecisionNotes(event.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingAppId(null)} className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                            Annuler
                          </button>
                          <button onClick={() => submitDecision(app)} className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                            Valider la decision
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="mt-1 block text-xs font-bold text-slate-800">{value}</span>
    </div>
  );
}

function DecisionField({
  label,
  value,
  onChange,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
