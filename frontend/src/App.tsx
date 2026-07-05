import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import LoginRegister from './pages/auth/LoginRegister';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import InternshipsList from './pages/internships/InternshipsList';
import ApplicationsList from './pages/applications/ApplicationsList';
import UsersManagement from './pages/settings/UsersManagement';
import ProfileSettings from './pages/settings/ProfileSettings';
import ReportsPage from './pages/reports/ReportsPage';
import SystemLogs from './pages/settings/SystemLogs';
import PartnersPage from './pages/partners/PartnersPage';
import CompanySupervisors from './pages/settings/CompanySupervisors';
import { CheckCircle, AlertOctagon, Info, X } from 'lucide-react';


function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full p-4 md:p-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-xl shadow-2xl border backdrop-blur-xl flex items-start space-x-3 pointer-events-auto transform transition-all duration-300 animate-slide-in-right ${
            toast.type === 'success'
              ? 'bg-[#0f172a]/80 border-emerald-500/30 text-emerald-300 shadow-emerald-950/20'
              : toast.type === 'error'
              ? 'bg-[#0f172a]/80 border-red-500/30 text-red-300 shadow-red-950/20'
              : 'bg-[#0f172a]/80 border-blue-500/30 text-blue-300 shadow-blue-950/20'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertOctagon className="h-5 w-5 text-red-400" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-blue-400" />}
          </div>
          <div className="flex-1 text-xs font-semibold leading-relaxed">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded-full hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function MainAppContent() {
  const { currentUser } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Sécurité et vérification d'accès à l'initialisation du lien URL
  useEffect(() => {
    if (currentUser) {
      // Si l'utilisateur est un étudiant, on restreint ses pages autorisées
      if (currentUser.role === 'student') {
        const allowedViews = ['dashboard', 'internships', 'profile'];
        if (!allowedViews.includes(currentView)) {
          setCurrentView('dashboard');
        }
      }
    }
    setLoading(false);
  }, [currentView, currentUser]);

  // Pendant la vérification du compte ou de la session, on affiche un écran d'attente neutre
  if (loading) {
    return (
      <div className="bg-[#090d16] min-h-screen w-full flex items-center justify-center text-slate-400 text-xs font-semibold">
        Chargement des accès sécurisés...
      </div>
    );
  }

  // FORCE LA REDIRECTION : Si aucun compte n'est connecté, on demande obligatoirement le mot de passe
  if (!currentUser) {
    return <LoginRegister />;
  }

  // Rendu des vues avec contrôle strict des rôles applicatifs
  const renderViewContent = () => {
    if (currentUser.role === 'student') {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard onViewChange={setCurrentView} />;
        case 'internships':
          return <InternshipsList />;
        case 'profile':
          return <ProfileSettings />;
        default:
          return <Dashboard onViewChange={setCurrentView} />;
      }
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'internships':
        return <InternshipsList />;
      case 'partners':
        return <PartnersPage />;
      case 'applications':
        return <ApplicationsList />;
      case 'users':
        return <UsersManagement />;
      case 'reports':
        return <ReportsPage />;
      case 'supervisors':
        return <CompanySupervisors />;
      case 'profile':
        return <ProfileSettings />;
      case 'system-logs':
        return <SystemLogs />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };


  return (
    <div className="bg-[#090d16] min-h-screen w-full text-slate-100 antialiased font-sans">
      <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
        {renderViewContent()}
      </DashboardLayout>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
      <ToastContainer />
    </AppProvider>
  );
}