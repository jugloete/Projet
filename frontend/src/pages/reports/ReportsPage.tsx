import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ApplicationStatus } from '../../types';
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

export default function ReportsPage() {
  const { internships, applications, users, showToast } = useApp();
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'excel' | null>(null);

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
    </div>
  );
}
