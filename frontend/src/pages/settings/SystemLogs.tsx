import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ShieldAlert, Search, RefreshCw, Smartphone } from 'lucide-react';

export default function SystemLogs() {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-xs md:text-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-sm text-slate-500 font-medium">Historique d'audit légal et technique relatant chaque action sensible opérée sur la plateforme.</p>
      </div>

      {/* FILTER SEARCH CRITERIA */}
      <div className="bg-white p-4 rounded-xl border border-slate-205 shadow-xs flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrer par action, nom d'utilisateur référent, détails d'audit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-220 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-550 text-xs"
          />
        </div>
      </div>

      {/* LOGS DATAGRID */}
      <div className="bg-white border rounded-xl border-slate-205 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="p-4">Horodateur (UTC)</th>
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Opération / Action</th>
                <th className="p-4">Détails de l'événement</th>
                <th className="p-4 text-right pr-6">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 italic">
                    Aucune ligne d'audit trouvée.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/45 transition-colors">
                    <td className="p-4 text-slate-500 font-semibold shrink-0">
                      {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {log.userName}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[9px] ${
                        log.action.includes('CONNEXION') ? 'bg-blue-100 text-blue-800' :
                        log.action.includes('SUPPR') || log.action.includes('SUSPEN') ? 'bg-red-100 text-red-800' :
                        log.action.includes('CREEE') || log.action.includes('VALIDATION') ? 'bg-green-100 text-green-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-sans max-w-sm break-words leading-relaxed">
                      {log.details}
                    </td>
                    <td className="p-4 text-right pr-6 text-slate-450">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
