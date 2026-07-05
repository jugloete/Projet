import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RoleType, User } from '../../types';
import { 
  Users, 
  UserX, 
  UserCheck, 
  Plus, 
  ShieldAlert, 
  Mail, 
  Search, 
  AlertCircle,
  X,
  UserPlus
} from 'lucide-react';

export default function UsersManagement() {
  const { users, students, suspendUser, reactivateUser, createUserByAdmin, assignStudentToSupervisor } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // New admin-created user inputs
  const [formOpen, setFormOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<RoleType>(RoleType.STUDENT);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newName || !newEmail) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      createUserByAdmin({
        name: newName,
        email: newEmail,
        role: newRole,
        status: 'active'
      });
      setSuccessMsg(`L'utilisateur "${newName}" a bien été créé !`);
      setNewName('');
      setNewEmail('');
      setNewRole(RoleType.STUDENT);
      setTimeout(() => {
        setFormOpen(false);
        setSuccessMsg('');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue.");
    }
  };

  // Filter users based on input parameters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs md:text-sm">
      {/* Table Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-sm text-slate-500 font-medium">Attribuez des rôles, gérez les comptes utilisateurs et suspendez les profils si nécessaire.</p>
        
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs md:text-sm cursor-pointer shadow-md transition-all self-start"
        >
          <UserPlus className="h-4.5 w-4.5" />
          <span>Créer un utilisateur</span>
        </button>
      </div>

      {/* FILTER SEARCH CRITERIA */}
      <div className="bg-white p-4 rounded-xl border border-slate-205 shadow-xs flex flex-col md:flex-row gap-4">
        {/* Input box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email d'utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-220 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
          />
        </div>

        {/* select dropdown */}
        <div className="w-full md:w-64">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-220 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-xs"
          >
            <option value="all">Tous les rôles</option>
            <option value={RoleType.SUPERVISOR}>Maîtres de stage (Superviseurs)</option>
            <option value={RoleType.STUDENT}>Étudiants</option>
            <option value={RoleType.COMPANY}>Entreprises</option>
          </select>
        </div>
      </div>

      {/* MODAL / ROW DRAWER TO CREATE USERS */}
      {formOpen && (
        <div className="bg-white p-5 rounded-xl border border-blue-150 shadow-md space-y-4 animate-slide-up relative">
          <button 
            onClick={() => setFormOpen(false)}
            className="absolute top-4 right-4 text-slate-405 hover:text-slate-600 bg-slate-50 p-1.5 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
          
          <h4 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center">
            <UserPlus className="h-5 w-5 text-blue-500 mr-2" />
            Créer un nouveau compte utilisateur
          </h4>

          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom complet / Raison sociale *</label>
              <input
                type="text"
                placeholder="Ex : Sarah El Amrani"
                className="w-full px-3 py-2 border rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Adresse email *</label>
              <input
                type="email"
                placeholder="Ex : sarah.student@example.com"
                className="w-full px-3 py-2 border rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rôle d'accès système *</label>
              <select
                className="w-full px-3 py-2 border rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as RoleType)}
              >
                <option value={RoleType.STUDENT}>Étudiant universitaire</option>
                <option value={RoleType.COMPANY}>Entreprise Partenaire</option>
                <option value={RoleType.SUPERVISOR}>Maître de stage (Superviseur)</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-205 rounded-lg text-xs font-medium"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs"
              >
                Enregistrer l'utilisateur
              </button>
            </div>
            {errorMsg && <p className="md:col-span-3 text-red-600 font-semibold">{errorMsg}</p>}
            {successMsg && <p className="md:col-span-3 text-emerald-600 font-semibold">{successMsg}</p>}
          </form>
        </div>
      )}

      {/* TABLE DATA LISTING */}
      <div className="bg-white border rounded-xl border-slate-205 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <th className="p-4 md:p-5">Nom d'utilisateur</th>
                <th className="p-4 md:p-5">Rôle</th>
                <th className="p-4 md:p-5">Date d'inscription</th>
                <th className="p-4 md:p-5">Statut du compte</th>
                <th className="p-4 md:p-5 text-right font-bold pr-6">Modifier l'accès</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/40 text-xs">
                  <td className="p-4 md:p-5">
                    <div>
                      <span className="font-extrabold text-slate-900 block">{user.name}</span>
                      <span className="text-slate-450 text-[11px] block mt-0.5">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4 md:p-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === RoleType.SUPERVISOR ? 'bg-amber-100 text-amber-800' :
                      user.role === RoleType.COMPANY ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-105 text-blue-900 bg-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 md:p-5">
                    <span className="text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4 md:p-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'active' ? 'bg-green-105 text-green-800 bg-green-100' : 'bg-red-100 text-red-800 border-red-200 border'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="p-4 md:p-5 text-right pr-6 shrink-0">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => suspendUser(user.id)}
                        disabled={user.role === RoleType.SUPERVISOR}
                        className={`text-[11px] font-bold border rounded-lg px-3 py-1.5 transition-colors border-red-200 ${
                          user.role === RoleType.SUPERVISOR 
                            ? 'text-slate-300 border-slate-100 cursor-not-allowed' 
                            : 'text-red-600 hover:bg-red-500 hover:text-white cursor-pointer'
                        }`}
                      >
                        Suspendre
                      </button>
                    ) : (
                      <button
                        onClick={() => reactivateUser(user.id)}
                        className="text-[11px] font-bold tracking-tight text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-250 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        Réactiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border rounded-xl border-slate-205 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Affecter un étudiant à un maître de stage</h3>
            <p className="text-xs text-slate-500">Sélectionnez un superviseur et un étudiant pour effectuer l'affectation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Maître de stage</label>
            <select
              className="w-full px-3 py-2 border rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
              value={selectedSupervisorId}
              onChange={(e) => setSelectedSupervisorId(e.target.value)}
            >
              <option value="">-- Aucun --</option>
              {users.filter(u => u.role === RoleType.SUPERVISOR).map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name} ({sup.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Étudiant</label>
            <select
              className="w-full px-3 py-2 border rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">-- Aucun --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name} ({student.email})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setSelectedSupervisorId('');
              setSelectedStudentId('');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium"
          >
            Réinitialiser
          </button>
          <button
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              if (!selectedSupervisorId || !selectedStudentId) {
                setErrorMsg('Sélectionnez un maître de stage et un étudiant pour affecter.');
                return;
              }
              assignStudentToSupervisor(selectedSupervisorId, selectedStudentId);
              setSuccessMsg('Étudiant affecté au maître de stage avec succès !');
              setSelectedSupervisorId('');
              setSelectedStudentId('');
            }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
          >
            Affecter l'étudiant
          </button>
        </div>

        {errorMsg && <p className="text-red-600 font-semibold text-xs">{errorMsg}</p>}
        {successMsg && <p className="text-emerald-600 font-semibold text-xs">{successMsg}</p>}
      </div>
    </div>
  );
}
