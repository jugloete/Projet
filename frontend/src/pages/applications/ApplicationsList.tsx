import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RoleType, ApplicationStatus, Application } from '../../types';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  MessageSquare, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Edit3
} from 'lucide-react';

export default function ApplicationsList() {
  const { currentUser, applications, studentProfile, companyProfile, updateApplicationStatus, internships, companies, showToast } = useApp();
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    currentUser?.role === RoleType.COMPANY && companyProfile?.id ? companyProfile.id : 'all'
  );

  // Status notes update form states
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  if (!currentUser) return null;

  // Render variables according to role
  let filteredApps: Application[] = [];

  if (currentUser.role === RoleType.STUDENT) {
    filteredApps = applications.filter(a => a.studentId === studentProfile?.id);
  } else {
    // Admin and Company see all applications initially but can select the concerned company
    filteredApps = applications;
  }

  // Filter display applications based on selection
  let displayApps = filteredApps;
  if (currentUser.role !== RoleType.STUDENT && selectedCompanyId !== 'all') {
    displayApps = filteredApps.filter(app => {
      const cId = internships.find(i => i.id === app.internshipId)?.companyId;
      return cId === selectedCompanyId;
    });
  }

  const toggleExpand = (id: string) => {
    if (expandedAppId === id) {
      setExpandedAppId(null);
    } else {
      setExpandedAppId(id);
    }
  };

  const handleStatusDecision = (id: string, newStatus: ApplicationStatus) => {
    setEditingAppId(id);
    setDecisionNotes('');
    // Automate a template response note depending on the chosen outcome
    if (newStatus === ApplicationStatus.ACCEPTED) {
      setDecisionNotes('Félicitations, après étude de votre dossier de candidature, nous avons le plaisir de vous informer que votre profil a été retenu pour ce stage académique.');
    } else if (newStatus === ApplicationStatus.INTERVIEW) {
      setDecisionNotes('Nous apprécions beaucoup votre candidature et souhaiterions planifier un entretien téléphonique d\'environ 30 minutes cette semaine.');
    } else if (newStatus === ApplicationStatus.REJECTED) {
      setDecisionNotes('Nous vous remercions pour l\'intérêt porté à notre offre. Malheureusement, après examen attentif, nous avons fait le choix de poursuivre avec d\'autres profils.');
    }
  };

  const submitStatusChange = (id: string, status: ApplicationStatus) => {
    updateApplicationStatus(id, status, decisionNotes);
    setEditingAppId(null);
    setDecisionNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-sm text-slate-500 font-medium">
        {currentUser.role === RoleType.STUDENT 
          ? "Suivez l'état de traitement de vos candidatures déposées en temps réel."
          : "Examinez les dossiers scolaires des candidats, postez vos remarques et informez-les de votre décision."}
      </p>

      {/* Select Concern Company Dropdown for Admins and Companies */}
      {currentUser.role !== RoleType.STUDENT && (
        <div className="bg-white border text-xs gap-3 border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <label className="block text-xs font-extrabold text-blue-900 tracking-wide uppercase">
              🏭 Entreprise concernée :
            </label>
            <p className="text-[11px] text-slate-400 font-medium">
              Sélectionnez une entreprise spécifique pour traiter ses demandes de stage.
            </p>
          </div>
          <div className="w-full md:w-80">
            <select
              value={selectedCompanyId}
              onChange={(e) => {
                setSelectedCompanyId(e.target.value);
                setExpandedAppId(null);
                setEditingAppId(null);
              }}
              className="w-full text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="all">🌐 Toutes les entreprises ({applications.length})</option>
              {companies.map((c) => {
                const count = applications.filter(app => {
                  return internships.find(i => i.id === app.internshipId)?.companyId === c.id;
                }).length;
                return (
                  <option key={c.id} value={c.id}>
                    🏢 {c.name} ({count} demande{count > 1 ? 's' : ''})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      {displayApps.length === 0 ? (
        <div className="p-16 text-center bg-white border rounded-xl shadow-2xs">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-sm md:text-base">Aucune candidature disponible</h3>
          <p className="text-slate-400 mt-1 max-w-sm mx-auto text-xs">
            {selectedCompanyId !== 'all' 
              ? "Aucune demande de stage n'a été déposée pour cette entreprise."
              : currentUser.role === RoleType.STUDENT 
                ? "Commencez par parcourir les offres de stages actives pour postuler."
                : "Les candidatures soumises par les étudiants s'afficheront instantanément."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayApps.map((app) => {
            const isExpanded = expandedAppId === app.id;
            const isEditing = editingAppId === app.id;

            // Simple status theme selector
            const statusStyle = 
              app.status === ApplicationStatus.ACCEPTED ? { bg: 'bg-emerald-50 text-emerald-800 border-emerald-100', text: 'text-emerald-500', icon: CheckCircle2 } :
              app.status === ApplicationStatus.REJECTED ? { bg: 'bg-red-50 text-red-800 border-red-100', text: 'text-red-500', icon: XCircle } :
              app.status === ApplicationStatus.INTERVIEW ? { bg: 'bg-indigo-50 text-indigo-800 border-indigo-100', text: 'text-indigo-500', icon: Calendar } :
              { bg: 'bg-amber-50 text-amber-800 border-amber-100', text: 'text-amber-500', icon: Clock };

            const StatusIcon = statusStyle.icon;

            return (
              <div 
                key={app.id} 
                className="bg-white border rounded-xl border-slate-205 shadow-2xs hover:shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion view header Summary bar */}
                <div 
                  onClick={() => toggleExpand(app.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/40 select-none"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-bold block">{new Date(app.createdAt).toLocaleDateString()}</span>
                    <h3 className="font-extrabold text-sm md:text-base text-slate-900 truncate">
                      {app.internshipTitle}
                    </h3>
                    <p className="text-xs font-semibold text-slate-655 text-slate-555">{app.companyName}</p>
                    
                    {currentUser.role !== RoleType.STUDENT && (
                      <span className="text-xs font-medium text-slate-600 tracking-tight block mt-1">
                        Candidat : <strong className="text-blue-600 font-bold">{app.studentName}</strong> ({app.studentEmail})
                      </span>
                    )}
                  </div>

                  {/* Right tags & toggler indicator */}
                  <div className="flex items-center space-x-3 justify-between sm:justify-end shrink-0">
                    <div className={`px-3 py-1 text-xs font-bold rounded-full border ${statusStyle.bg} flex items-center space-x-1.5`}>
                      <StatusIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{app.status}</span>
                    </div>
                    <div>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Extended Details Dropdown Pane */}
                {isExpanded && (
                  <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-5 animate-fade-in text-xs md:text-sm">
                    {/* Cover Letter text area */}
                    <div className="space-y-1.5 bg-white p-4 rounded-lg border border-slate-150">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-indigo-500" />
                        Lettre de motivation & Introduction :
                      </span>
                      <p className="text-slate-700 italic text-xs leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-md border border-slate-100">
                        {app.coverLetter || "Aucune lettre de motivation rédigée."}
                      </p>
                    </div>

                    {/* Resume attachments mock link */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-150">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <span className="block font-bold text-xs text-slate-800">Curriculum Vitae (CV)</span>
                          <span className="text-[10px] text-slate-400">{app.cvName || 'sarah_cv.pdf'} (Attachement Universitaire)</span>
                        </div>
                      </div>
                      <a 
                        href="#download-simulation"
                        onClick={(e) => { e.preventDefault(); showToast("Téléchargement du fichier CV simulé avec succès.", "success"); }}
                        className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <span>Ouvrir PDF</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {/* Decision comments or feedback notes */}
                    {app.notes && (
                      <div className="p-4 bg-blue-50/40 border border-blue-150 rounded-lg text-xs">
                        <span className="block font-bold text-blue-900 uppercase">Commentaire du Recruteur :</span>
                        <p className="text-blue-950 mt-1.5 italic font-medium whitespace-pre-wrap">{app.notes}</p>
                      </div>
                    )}

                    {/* State workflow form inputs (Only visible for Company or Admin roles) */}
                    {currentUser.role !== RoleType.STUDENT && !isEditing && (
                      <div className="pt-4 border-t border-dash border-slate-200">
                        <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Choisir une décision de recrutement :</span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleStatusDecision(app.id, ApplicationStatus.ACCEPTED)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                          >
                            Accepter le candidat
                          </button>
                          <button
                            onClick={() => handleStatusDecision(app.id, ApplicationStatus.INTERVIEW)}
                            className="px-3.5 py-2 bg-purple-650 hover:bg-purple-700 text-purple-900 bg-purple-100 text-xs font-bold rounded-lg cursor-pointer hover:bg-purple-200 transition-colors"
                          >
                            Planifier un Entretien
                          </button>
                          <button
                            onClick={() => handleStatusDecision(app.id, ApplicationStatus.REJECTED)}
                            className="px-3.5 py-2 bg-red-650 hover:bg-red-700 text-red-900 bg-red-50 text-xs font-bold rounded-lg cursor-pointer hover:bg-red-105 transition-colors"
                          >
                            Décliner la candidature
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Interactive Editor for deciding notes */}
                    {isEditing && (
                      <div className="pt-4 border-t border-slate-200 bg-white p-4 rounded-lg border space-y-3">
                        <span className="block text-xs font-bold text-slate-700 uppercase">Rédiger un mémo / Note explicative (Transmise à l'étudiant) :</span>
                        <textarea
                          rows={3}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                          placeholder="Décrivez les prochaines étapes, les dates suggérées ou donnez un feed-back qualitatif..."
                          value={decisionNotes}
                          onChange={(e) => setDecisionNotes(e.target.value)}
                        ></textarea>
                        
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingAppId(null)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-650 rounded-md font-bold text-xs"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              // Identify which status was selected based on notes templates:
                              let nextStatus = ApplicationStatus.PENDING;
                              if (decisionNotes.includes('Félicitations')) nextStatus = ApplicationStatus.ACCEPTED;
                              else if (decisionNotes.includes('entretien')) nextStatus = ApplicationStatus.INTERVIEW;
                              else nextStatus = ApplicationStatus.REJECTED;

                              submitStatusChange(app.id, nextStatus);
                            }}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-xs shadow-xs"
                          >
                            Soumettre & Envoyer l'Email
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
