import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ApplicationStatus, RoleType, User } from '../../types';
import { ArrowLeft, Briefcase, Edit2, LayoutDashboard, Plus, Save, UserCheck, Users, X } from 'lucide-react';
import ReportsPage from '../../pages/reports/ReportsPage';

export default function CompanySupervisors() {
  const {
    users,
    students,
    dailyReports,
    studentGrades,
    companyProfile,
    createSupervisorAccount,
    updateSupervisorAccount,
    assignStudentToSupervisor
  } = useApp();

  const [selectedSupervisor, setSelectedSupervisor] = useState<User | null>(null);
  const [dashboardSupervisor, setDashboardSupervisor] = useState<User | null>(null);
  const [editingSupervisor, setEditingSupervisor] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'password123',
    position: 'Maitre de stage',
    departmentId: '',
    skills: ''
  });

  if (!companyProfile) return <div className="p-6 text-sm text-slate-600">Aucun profil entreprise trouve.</div>;

  const supervisors = users.filter((user) => user.role === RoleType.SUPERVISOR && user.companyId === companyProfile.id);
  const assignableStudents = students.filter((student) =>
    student.companyId === companyProfile.id &&
    !student.isArchived &&
    [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(student.status || ApplicationStatus.PENDING)
  );

  const openCreate = () => {
    setEditingSupervisor(null);
    setFormOpen(true);
    setSelectedStudentIds([]);
    setForm({
      name: '',
      email: '',
      phone: '',
      password: 'password123',
      position: 'Maitre de stage',
      departmentId: companyProfile.departments?.[0]?.id || '',
      skills: ''
    });
  };

  const openEdit = (supervisor: User) => {
    setEditingSupervisor(supervisor);
    setFormOpen(true);
    setSelectedStudentIds(students.filter((student) =>
      student.supervisorId === supervisor.id &&
      !student.isArchived &&
      [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(student.status || ApplicationStatus.PENDING) &&
      (supervisor.assignedStudentIds || []).includes(student.id)
    ).map((student) => student.id));
    setForm({
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone || '',
      password: '',
      position: supervisor.position || 'Maitre de stage',
      departmentId: supervisor.departmentId || companyProfile.departments?.[0]?.id || '',
      skills: (supervisor.skills || []).join(', ')
    });
  };

  const submitForm = () => {
    const department = companyProfile.departments?.find((item) => item.id === form.departmentId);
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password || 'password123',
      position: form.position,
      departmentId: form.departmentId,
      departmentName: department?.name,
      skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      assignedStudentIds: selectedStudentIds
    };

    if (editingSupervisor) {
      updateSupervisorAccount(editingSupervisor.id, payload);
      selectedStudentIds.forEach((studentId) => assignStudentToSupervisor(editingSupervisor.id, studentId));
    } else {
      createSupervisorAccount(payload);
    }

    setFormOpen(false);
    setEditingSupervisor(null);
    setSelectedStudentIds([]);
  };

  const countForSupervisor = (supervisorId: string) => {
    const supervisor = supervisors.find((item) => item.id === supervisorId);
    const assigned = students.filter((student) =>
      supervisor &&
      student.supervisorId === supervisorId &&
      !student.isArchived &&
      [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(student.status || ApplicationStatus.PENDING) &&
      (supervisor.assignedStudentIds || []).includes(student.id)
    );
    return {
      assigned,
      reports: dailyReports.filter((report) => assigned.some((student) => student.id === report.studentId)).length,
      grades: studentGrades.filter((grade) => assigned.some((student) => student.id === grade.studentId)).length
    };
  };

  return (
    <div className="space-y-6 text-xs md:text-sm animate-fade-in">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Superviseurs / maitres de stage</h3>
            <p className="mt-1 text-xs text-slate-500">
              Creez les comptes superviseurs, assignez les etudiants acceptes et ouvrez leur tableau de bord de suivi.
            </p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 self-start rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Nouveau superviseur
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {supervisors.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
              Aucun superviseur cree.
            </div>
          ) : (
            supervisors.map((supervisor) => {
              const stats = countForSupervisor(supervisor.id);
              return (
                <div key={supervisor.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900">{supervisor.name}</h4>
                      <p className="text-[12px] text-slate-500">{supervisor.email}</p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-600">{supervisor.position || 'Maitre de stage'} - {supervisor.departmentName || 'Departement non precise'}</p>
                    </div>
                    <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Stat label="Etudiants" value={stats.assigned.length} icon={Users} />
                    <Stat label="Rapports" value={stats.reports} icon={Briefcase} />
                    <Stat label="Notes" value={stats.grades} icon={Save} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => setDashboardSupervisor(supervisor)} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
                      <LayoutDashboard className="h-4 w-4" />
                      Tableau de bord
                    </button>
                    <button onClick={() => openEdit(supervisor)} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100">
                      <Edit2 className="h-4 w-4" />
                      Modifier
                    </button>
                    <button onClick={() => setSelectedSupervisor(supervisor)} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100">
                      <Users className="h-4 w-4" />
                      Assigner etudiants
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {(formOpen || selectedSupervisor) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h4 className="font-bold text-slate-900">
                {selectedSupervisor ? `Assigner des etudiants a ${selectedSupervisor.name}` : editingSupervisor ? 'Modifier le superviseur' : 'Creer un superviseur'}
              </h4>
              <button onClick={() => { setFormOpen(false); setSelectedSupervisor(null); }} className="text-slate-500 hover:text-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {!selectedSupervisor && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input label="Nom complet" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
                  <Input label="Email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} type="email" />
                  <Input label="Telephone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
                  <Input label="Mot de passe temporaire" value={form.password} onChange={(value) => setForm({ ...form, password: value })} type="password" />
                  <Input label="Fonction / poste" value={form.position} onChange={(value) => setForm({ ...form, position: value })} />
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">Departement</label>
                    <select value={form.departmentId} onChange={(event) => setForm({ ...form, departmentId: event.target.value })} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs">
                      <option value="">Choisir</option>
                      {(companyProfile.departments || []).map((department) => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Input label="Competences" value={form.skills} onChange={(value) => setForm({ ...form, skills: value })} placeholder="React, Maintenance, Communication" />
                  </div>
                </div>
              )}

              <div>
                <h5 className="mb-2 font-bold text-slate-900">Etudiants acceptes / en stage assignables</h5>
                {assignableStudents.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                    Aucun etudiant accepte ou en stage pour le moment.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {assignableStudents.map((student) => (
                      <label key={student.id} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-xs">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={(event) => {
                            setSelectedStudentIds((prev) =>
                              event.target.checked ? [...prev, student.id] : prev.filter((id) => id !== student.id)
                            );
                          }}
                          className="mt-1"
                        />
                        <span>
                          <strong className="block text-slate-900">{student.name}</strong>
                          <span className="text-slate-500">{student.departmentName || 'Departement non precise'} - {student.specialty || 'Specialite non precisee'}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button onClick={() => { setFormOpen(false); setSelectedSupervisor(null); }} className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (selectedSupervisor) {
                      selectedStudentIds.forEach((studentId) => assignStudentToSupervisor(selectedSupervisor.id, studentId));
                      setSelectedSupervisor(null);
                      setSelectedStudentIds([]);
                    } else {
                      submitForm();
                    }
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {dashboardSupervisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Tableau de bord - {dashboardSupervisor.name}</h4>
                <p className="text-xs text-slate-500">{dashboardSupervisor.email}</p>
              </div>
              <button
                onClick={() => setDashboardSupervisor(null)}
                className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 sm:self-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux superviseurs
              </button>
            </div>
            <div className="p-5">
              <ReportsPage impersonateSupervisorId={dashboardSupervisor.id} />
            </div>
            <div className="sticky bottom-0 flex justify-end border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
              <button
                onClick={() => setDashboardSupervisor(null)}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-xs font-bold text-white hover:bg-slate-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux superviseurs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
      <Icon className="mb-2 h-4 w-4 text-slate-400" />
      <span className="block text-lg font-black text-slate-900">{value}</span>
      <span className="text-[10px] font-bold uppercase text-slate-400">{label}</span>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
