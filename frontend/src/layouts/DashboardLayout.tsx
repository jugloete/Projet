import { useState, ReactNode } from 'react';
import { useApp } from '../contexts/AppContext';
import { RoleType } from '../types';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Building2, 
  ShieldAlert, 
  CalendarClock,
  User,
  Terminal
} from 'lucide-react';

interface SidebarItem {
  id: string;
  name: string;
  icon: any;
  rolesAllowed: RoleType[];
}

interface DashboardLayoutProps {
  currentView: string;
  onViewChange: (view: string) => void;
  children: ReactNode;
}

export default function DashboardLayout({ currentView, onViewChange, children }: DashboardLayoutProps) {
  const { currentUser, logout, notifications, markNotificationAsRead } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  if (!currentUser) return null;

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      name: 'Tableau de bord',
      icon: LayoutDashboard,
      rolesAllowed: [RoleType.ADMIN, RoleType.STUDENT, RoleType.COMPANY]
    },
    {
      id: 'internships',
      name: 'Offres de stages',
      icon: Briefcase,
      rolesAllowed: [RoleType.ADMIN, RoleType.COMPANY] // 👈 Retiré RoleType.STUDENT pour le cacher à l'étudiant
    },
    {
      id: 'partners',
      name: 'Entreprises Partenaires',
      icon: Building2,
      rolesAllowed: [RoleType.ADMIN, RoleType.COMPANY] // 👈 Retiré RoleType.STUDENT pour le cacher à l'étudiant
    },
    {
      id: 'applications',
      name: 'Candidatures',
      icon: FileText,
      rolesAllowed: [RoleType.COMPANY] // 👈 Retiré RoleType.STUDENT pour le cacher à l'étudiant
    },
    {
      id: 'users',
      name: 'Utilisateurs',
      icon: Users,
      rolesAllowed: [RoleType.ADMIN]
    },
    {
      id: 'reports',
      name: 'Rapports & Stats',
      icon: CalendarClock,
      rolesAllowed: [RoleType.ADMIN, RoleType.COMPANY] // 👈 Retiré RoleType.STUDENT pour le cacher à l'étudiant
    },
    {
      id: 'profile',
      name: 'Mon Profil',
      icon: User,
      rolesAllowed: [RoleType.STUDENT, RoleType.COMPANY] // Accès maintenu pour le profil
    },
    {
      id: 'system-logs',
      name: 'Logs d\'audit',
      icon: ShieldAlert,
      rolesAllowed: [RoleType.ADMIN]
    }
  ];

  const filteredItems = sidebarItems.filter(item => item.rolesAllowed.includes(currentUser.role));
  const unreadNotifications = notifications.filter(n => n.userId === currentUser.id && !n.read);

  return (
    <div className="min-h-screen flex bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0b0f19] border-r border-slate-900 text-slate-400 shrink-0 z-20">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-900/60">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mr-2.5">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white block">
              Internship <span className="text-emerald-400">Hub</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono tracking-wider block uppercase">
              UPL • BAC 2
            </span>
          </div>
        </div>

        {/* User Quick Identity */}
        <div className="mx-3 my-3 p-3 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white uppercase text-xs shrink-0 shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden truncate">
            <h4 className="font-bold text-xs text-slate-200 truncate">{currentUser.name}</h4>
            <div className="flex items-center mt-0.5">
              <span className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-md border uppercase tracking-wider ${
                currentUser.role === RoleType.ADMIN ? 'bg-red-950/60 border-red-500/20 text-red-400' :
                currentUser.role === RoleType.COMPANY ? 'bg-blue-950/60 border-blue-500/20 text-blue-400' :
                'bg-emerald-950/60 border-emerald-500/20 text-emerald-400'
              }`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 shadow-xs' 
                    : 'hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-900">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-red-950/20 hover:text-red-400 transition-all cursor-pointer group"
          >
            <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR */}
        <header className="h-16 bg-[#090d16]/80 border-b border-slate-900/60 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10">
          {/* Mobile Menu Trigger & Title */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-200 md:hidden focus:outline-hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="ml-2 md:ml-0 font-black text-sm md:text-base text-slate-100 uppercase tracking-wider font-mono">
              {sidebarItems.find(item => item.id === currentView)?.name || 'Espace Stages'}
            </h1>
          </div>

          {/* User controls / Alerts */}
          <div className="flex items-center space-x-4">
            
            {/* NOTIFICATIONS BAR */}
            <div className="relative">
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className={`p-2 rounded-full relative transition-colors focus:outline-hidden cursor-pointer ${
                  notifMenuOpen ? 'bg-slate-900 text-emerald-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Menu Panel */}
              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0f172a]/95 border border-slate-800 rounded-xl shadow-2xl z-30 overflow-hidden backdrop-blur-xl">
                  <div className="p-3 border-b border-slate-800/60 bg-slate-900/50 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Notifications ({unreadNotifications.length})</span>
                    <button 
                      onClick={() => setNotifMenuOpen(false)}
                      className="text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40">
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        Aucune notification disponible
                      </div>
                    ) : (
                      notifications
                        .filter(n => n.userId === currentUser.id)
                        .map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-3.5 text-[11px] transition-colors ${notif.read ? 'text-slate-400' : 'bg-emerald-500/5 text-slate-200 font-medium'}`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold block text-slate-200">{notif.title}</span>
                              {!notif.read && (
                                <button 
                                  onClick={() => markNotificationAsRead(notif.id)}
                                  className="text-emerald-400 hover:text-emerald-300 font-mono text-[9px] font-bold tracking-wider uppercase cursor-pointer shrink-0"
                                >
                                  Lu
                                </button>
                              )}
                            </div>
                            <p className="mt-1 text-slate-400 leading-relaxed">{notif.message}</p>
                            <span className="text-[9px] text-slate-600 font-mono mt-1.5 block">
                              {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick role display banner for testing */}
            <div className="hidden sm:flex items-center px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400 font-bold uppercase tracking-wider">{currentUser.role}</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#090d16]">
          {children}
        </main>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          
          {/* Drawer Menu pane */}
          <div className="fixed top-0 bottom-0 left-0 w-72 bg-[#0b0f19] text-slate-400 border-r border-slate-900 flex flex-col z-50">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900/60">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="font-black text-sm text-white tracking-tight">
                  Internship <span className="text-emerald-400">Hub</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-900/60 bg-slate-900/30 flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white uppercase text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-slate-200 truncate">{currentUser.name}</h4>
                <span className="text-[9px] font-mono font-bold text-slate-500 capitalize">{currentUser.role}</span>
              </div>
            </div>

            {/* Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'hover:bg-slate-900/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-900">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-red-950/20 hover:text-red-400 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}