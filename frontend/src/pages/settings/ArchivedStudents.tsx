import { Archive, Building2, CalendarDays, Mail, UserRoundX } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ApplicationStatus, RoleType } from '../../types';

const statusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'En attente',
  [ApplicationStatus.INTERVIEW]: 'Entretien demande',
  [ApplicationStatus.ACCEPTED]: 'Accepte',
  [ApplicationStatus.REJECTED]: 'Rejete',
  [ApplicationStatus.IN_INTERNSHIP]: 'En stage',
  [ApplicationStatus.COMPLETED]: 'Termine',
  [ApplicationStatus.ARCHIVED]: 'Archive'
};

const reasonLabels = {
  rejected: 'Candidature rejetee',
  expired: 'Stage termine ou expire',
  manual: 'Archivage manuel'
};

export default function ArchivedStudents() {
  const { archives, companyProfile, currentUser } = useApp();
  const visibleArchives = currentUser?.role === RoleType.COMPANY
    ? archives.filter((archive) => archive.companyId === companyProfile?.id)
    : archives;
  const sortedArchives = [...visibleArchives].sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 md:text-base">
              <Archive className="h-5 w-5 text-slate-500" />
              Etudiants archives
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Liste persistante des dossiers retires des tableaux de bord actifs apres rejet ou fin de stage.
            </p>
          </div>
          <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
            {sortedArchives.length} dossier{sortedArchives.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {sortedArchives.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <UserRoundX className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">Aucun etudiant archive pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sortedArchives.map((archive) => {
            const snapshot = archive.snapshot || {};
            const rejectionReason = archive.rejectionReason || snapshot.rejectionReason;
            return (
              <article key={archive.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{archive.studentName}</h4>
                    <div className="mt-2 space-y-1 text-[11px] font-medium text-slate-500">
                      {archive.studentEmail && (
                        <p className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          {archive.studentEmail}
                        </p>
                      )}
                      {(archive.companyName || snapshot.companyName) && (
                        <p className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5" />
                          {archive.companyName || snapshot.companyName}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Archive le {new Date(archive.archivedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black uppercase text-rose-700">
                    {statusLabels[archive.status] || archive.status}
                  </span>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                  <p className="font-bold text-slate-800">{reasonLabels[archive.reason]}</p>
                  <p className="mt-1 text-slate-600">
                    {rejectionReason || 'Aucune raison detaillee n a ete renseignee.'}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 text-[11px] text-slate-500 sm:grid-cols-2">
                  <span>Niveau: {snapshot.level || 'Non renseigne'}</span>
                  <span>Specialite: {snapshot.specialty || 'Non renseignee'}</span>
                  <span>Departement: {snapshot.departmentName || 'Non renseigne'}</span>
                  <span>Telephone: {snapshot.phone || 'Non renseigne'}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
