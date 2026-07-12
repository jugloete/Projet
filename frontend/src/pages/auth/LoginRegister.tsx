import React, { useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ApplicationStatus, RoleType } from '../../types';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  GraduationCap,
  Hourglass,
  Lock,
  Mail,
  MapPin,
  Phone,
  Send,
  UploadCloud,
  User,
  XCircle
} from 'lucide-react';

type PublicMode = 'company-login' | 'company-signup' | 'student-signup';

export default function LoginRegister() {
  const { companies, students, applications, login, register, showToast } = useApp();
  const [mode, setMode] = useState<PublicMode>('company-login');
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [studentStatusEmail, setStudentStatusEmail] = useState(() => localStorage.getItem('public_student_email') || '');
  const [studentStatusPassword, setStudentStatusPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [level, setLevel] = useState('');
  const [field, setField] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [skills, setSkills] = useState('');
  const [cvName, setCvName] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [companySector, setCompanySector] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId) || companies[0],
    [companies, selectedCompanyId]
  );

  const selectedDepartments = selectedCompany?.departments || [];
  const selectedSpecialties = selectedCompany?.acceptedSpecialties || [];
  const trackedStudentEmail = studentStatusEmail.trim().toLowerCase();
  const trackedStudent = trackedStudentEmail
    ? students.find((student) => student.email.toLowerCase() === trackedStudentEmail)
    : undefined;
  const trackedApplication = trackedStudent
    ? applications.find((application) => application.studentId === trackedStudent.id)
    : trackedStudentEmail
      ? applications.find((application) => application.studentEmail.toLowerCase() === trackedStudentEmail)
      : undefined;
  const trackedStatus = trackedStudent?.status || trackedApplication?.status;

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const openStudentSignupForCompany = (companyId: string) => {
    resetMessages();
    setSelectedCompanyId(companyId);
    const company = companies.find((item) => item.id === companyId);
    setDepartmentId(company?.departments?.[0]?.id || '');
    setSpecialty(company?.acceptedSpecialties?.[0] || '');
    setMode('student-signup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCompanyLogin = () => {
    resetMessages();
    setMode('company-login');
  };

  const openCompanySignup = () => {
    resetMessages();
    setMode('company-signup');
  };

  const handleSignInSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();

    if (!signInEmail || !signInPassword) {
      setErrorMsg('Veuillez saisir l email et le mot de passe de l entreprise.');
      return;
    }

    try {
      const ok = await login(signInEmail, RoleType.COMPANY, signInPassword);
      if (!ok) setErrorMsg('Aucun compte entreprise ne correspond a ces identifiants.');
    } catch (error: any) {
      setErrorMsg(error.message || 'La connexion entreprise a echoue.');
    }
  };

  const handleStudentSignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();

    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Nom, email et mot de passe sont obligatoires.');
      return;
    }
    if (!selectedCompany) {
      setErrorMsg('Choisissez une entreprise avant de creer un compte etudiant.');
      return;
    }
    if (!departmentId || !specialty || !cvName) {
      setErrorMsg('Departement, specialite et CV sont obligatoires pour postuler.');
      return;
    }

    try {
      const department = selectedDepartments.find((item) => item.id === departmentId);
      await register(regName, regEmail, RoleType.STUDENT, regPassword, {
        phone,
        university,
        faculty,
        level,
        field,
        specialty,
        departmentId,
        departmentName: department?.name,
        companyId: selectedCompany.id,
        cvName,
        skills,
        coverLetter,
        education: [faculty, level, field].filter(Boolean).join(' - ')
      });
      const message = 'Demande envoyee. Votre compte reste en attente jusqu a validation par l entreprise.';
      setSuccessMsg(message);
      setStudentStatusEmail(regEmail);
      localStorage.setItem('public_student_email', regEmail);
      showToast(message, 'success');
    } catch (error: any) {
      setErrorMsg(error.message || "Une erreur est survenue lors de l'inscription.");
    }
  };

  const handleCompanySignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();

    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Raison sociale, email et mot de passe sont obligatoires.');
      return;
    }

    try {
      await register(regName, regEmail, RoleType.COMPANY, regPassword, {
        phone,
        sector: companySector,
        address: companyAddress,
        description: companyDescription
      });
      showToast('Compte entreprise cree avec succes.', 'success');
    } catch (error: any) {
      setErrorMsg(error.message || "Une erreur est survenue lors de l'inscription entreprise.");
    }
  };

  const handleStudentStatusLookup = () => {
    resetMessages();
    if (!studentStatusEmail.trim()) {
      setErrorMsg('Saisissez votre email etudiant pour consulter l etat de votre demande.');
      return;
    }
    localStorage.setItem('public_student_email', studentStatusEmail.trim());
    if (!trackedStudent && !trackedApplication) {
      setErrorMsg('Aucune demande de stage ne correspond a cet email.');
    }
  };

  const handleStudentDashboardLogin = async () => {
    resetMessages();
    if (!studentStatusEmail.trim() || !studentStatusPassword) {
      setErrorMsg('Saisissez votre email et votre mot de passe etudiant.');
      return;
    }
    try {
      const ok = await login(studentStatusEmail.trim(), RoleType.STUDENT, studentStatusPassword);
      if (!ok) setErrorMsg('Aucun compte etudiant actif ne correspond a ces identifiants.');
    } catch (error: any) {
      setErrorMsg(error.message || 'Connexion etudiant impossible.');
    }
  };

  const renderStudentStatusNotice = () => {
    const accepted = trackedStatus && [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(trackedStatus);
    const rejected = trackedStatus === ApplicationStatus.REJECTED || trackedStatus === ApplicationStatus.ARCHIVED;
    const pending = trackedStatus === ApplicationStatus.PENDING || trackedStatus === ApplicationStatus.INTERVIEW;

    if (!trackedStatus || (!trackedStudent && !trackedApplication)) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-4">
          <div className="flex items-start gap-3">
            <Hourglass className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
            <div>
              <span className="block text-sm font-black text-white">Suivi de demande etudiant</span>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Entrez l email utilise lors de votre demande pour afficher son etat.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (accepted) {
      return (
        <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-4 shadow-lg shadow-emerald-950/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
            <div className="min-w-0 flex-1">
              <span className="block text-sm font-black text-emerald-100">Votre demande a ete acceptee.</span>
              <p className="mt-1 text-xs leading-5 text-emerald-50">
                Votre demande de stage a ete acceptee. Votre compte est maintenant active et pret a etre utilise. Vous pouvez vous connecter pour acceder a votre espace etudiant.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  type="password"
                  value={studentStatusPassword}
                  onChange={(event) => setStudentStatusPassword(event.target.value)}
                  className="rounded-md border border-emerald-300/40 bg-white px-3 py-2 text-xs font-semibold text-slate-950 placeholder:text-slate-500 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
                  placeholder="Mot de passe etudiant"
                />
                <button
                  type="button"
                  onClick={handleStudentDashboardLogin}
                  className="rounded-md bg-emerald-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-300"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (rejected) {
      return (
        <div className="rounded-lg border border-red-400/40 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
            <div>
              <span className="block text-sm font-black text-red-100">Votre demande a ete refusee.</span>
              <p className="mt-1 text-xs leading-5 text-red-50">
                Votre demande de stage n a pas ete retenue par l entreprise. Votre compte sera supprime automatiquement dans un delai de 24 heures. Vos informations resteront archivees.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (pending) {
      return (
        <div className="rounded-lg border border-amber-300/40 bg-amber-400/10 p-4">
          <div className="flex items-start gap-3">
            <Hourglass className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
            <div>
              <span className="block text-sm font-black text-amber-100">Votre demande est en cours d examen par l entreprise.</span>
              <p className="mt-1 text-xs leading-5 text-amber-50">
                Aucun acces etudiant n est ouvert tant que l entreprise n a pas valide votre compte.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#080d14] text-slate-100">
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80"
          alt="Etudiants en collaboration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/78" />

        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl space-y-6 pt-8 lg:pt-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              <Building2 className="h-4 w-4" />
              Plateforme de stages orientee entreprises
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Internship Hub
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 md:text-base">
                Consultez les entreprises partenaires, choisissez votre structure d accueil, puis envoyez une demande de compte etudiant rattachee a cette entreprise.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ['Entreprises', companies.length],
                ['Departements', companies.reduce((sum, company) => sum + (company.departments?.length || 0), 0)],
                ['Specialites', companies.reduce((sum, company) => sum + (company.acceptedSpecialties?.length || 0), 0)]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-2xl font-black text-white">{value}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-700/80 bg-[#101827]/92 p-5 shadow-2xl backdrop-blur-xl md:p-6">
            {errorMsg && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs font-semibold text-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-100">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'company-login' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-950/55 p-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                    <Field
                      icon={Mail}
                      label="Suivi etudiant"
                      value={studentStatusEmail}
                      onChange={setStudentStatusEmail}
                      type="email"
                      placeholder="email utilise pour la demande"
                    />
                    <button
                      type="button"
                      onClick={handleStudentStatusLookup}
                      className="self-end rounded-md border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-xs font-black text-sky-100 hover:bg-sky-400/20"
                    >
                      Verifier
                    </button>
                  </div>
                  {renderStudentStatusNotice()}
                </div>

                <div>
                  <span className="block text-sm font-black text-white">Connexion Entreprise</span>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Les etudiants et superviseurs n ont pas de connexion publique depuis l accueil.
                  </p>
                </div>
                <Field icon={Mail} label="Email entreprise" value={signInEmail} onChange={setSignInEmail} type="email" placeholder="entreprise@domaine.com" />
                <Field icon={Lock} label="Mot de passe" value={signInPassword} onChange={setSignInPassword} type="password" placeholder="********" />
                <button type="submit" className="w-full rounded-md bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-950/20 hover:bg-emerald-400">
                  Acceder au tableau de bord entreprise
                </button>
                <button type="button" onClick={openCompanySignup} className="w-full rounded-md border border-slate-600 bg-slate-950 px-4 py-2.5 text-xs font-black text-slate-100 hover:border-emerald-400">
                  Creer un compte entreprise
                </button>
              </form>
            )}

            {mode === 'company-signup' && (
              <form onSubmit={handleCompanySignUpSubmit} className="space-y-4">
                <button type="button" onClick={openCompanyLogin} className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                  Retour connexion entreprise
                </button>
                <div>
                  <span className="block text-sm font-black text-white">Creation entreprise</span>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Ce compte permet de traiter les demandes et de creer les superviseurs.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field icon={Building2} label="Raison sociale" value={regName} onChange={setRegName} placeholder="Nom de l entreprise" />
                  <Field icon={Mail} label="Email" value={regEmail} onChange={setRegEmail} type="email" placeholder="email@domaine.com" />
                  <Field icon={Lock} label="Mot de passe" value={regPassword} onChange={setRegPassword} type="password" placeholder="********" />
                  <Field icon={Phone} label="Telephone" value={phone} onChange={setPhone} placeholder="+243..." />
                  <Field icon={Building2} label="Secteur" value={companySector} onChange={setCompanySector} placeholder="Technologie, Finance..." />
                  <Field icon={MapPin} label="Adresse" value={companyAddress} onChange={setCompanyAddress} placeholder="Ville, pays" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">Description</label>
                  <textarea
                    value={companyDescription}
                    onChange={(event) => setCompanyDescription(event.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                    placeholder="Presentez votre entreprise..."
                  />
                </div>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400">
                  <Send className="h-4 w-4" />
                  Finaliser la creation
                </button>
              </form>
            )}

            {mode === 'student-signup' && (
              <form onSubmit={handleStudentSignUpSubmit} className="space-y-4">
                <button type="button" onClick={() => setMode('company-login')} className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                  Retour a l accueil
                </button>
                <div>
                  <span className="block text-sm font-black text-white">Demande de compte etudiant</span>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Le compte sera cree en attente. L acces etudiant ne sera ouvert qu apres acceptation par l entreprise.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">Entreprise choisie</label>
                  <select
                    value={selectedCompany?.id || ''}
                    onChange={(event) => openStudentSignupForCompany(event.target.value)}
                    className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field icon={User} label="Nom complet" value={regName} onChange={setRegName} placeholder="Nom complet" />
                  <Field icon={Mail} label="Email" value={regEmail} onChange={setRegEmail} type="email" placeholder="email@domaine.com" />
                  <Field icon={Lock} label="Mot de passe demande" value={regPassword} onChange={setRegPassword} type="password" placeholder="********" />
                  <Field icon={Phone} label="Telephone" value={phone} onChange={setPhone} placeholder="+243..." />
                  <Field icon={GraduationCap} label="Universite / institut" value={university} onChange={setUniversity} placeholder="Universite de Lubumbashi" />
                  <Field icon={GraduationCap} label="Faculte" value={faculty} onChange={setFaculty} placeholder="Faculte Polytechnique" />
                  <Field icon={GraduationCap} label="Promotion / niveau" value={level} onChange={setLevel} placeholder="BAC 2" />
                  <Field icon={GraduationCap} label="Filiere" value={field} onChange={setField} placeholder="Genie logiciel" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">Departement souhaite</label>
                    <select
                      value={departmentId}
                      onChange={(event) => setDepartmentId(event.target.value)}
                      className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                    >
                      <option value="">Choisir un departement</option>
                      {selectedDepartments.map((department) => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">Specialite</label>
                    <select
                      value={specialty}
                      onChange={(event) => setSpecialty(event.target.value)}
                      className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                    >
                      <option value="">Choisir une specialite</option>
                      {selectedSpecialties.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <CvUploadField value={cvName} onChange={setCvName} />
                  <Field icon={GraduationCap} label="Competences" value={skills} onChange={setSkills} placeholder="React, Excel, Maintenance" />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">Motivation</label>
                  <textarea
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                    placeholder="Expliquez votre demande de stage..."
                  />
                </div>

                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400">
                  <Send className="h-4 w-4" />
                  Envoyer la demande a l entreprise
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-black text-white">Entreprises partenaires</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Chaque demande etudiant commence par le choix d une entreprise. La validation et l activation du compte se font ensuite cote entreprise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {companies.map((company) => (
            <article key={company.id} className="rounded-lg border border-slate-800 bg-slate-950 p-5 shadow-lg shadow-black/10 transition hover:border-slate-700">
              <div className="flex gap-4">
                <img src={company.logoUrl} alt={company.name} className="h-16 w-16 shrink-0 object-cover" referrerPolicy="no-referrer" />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-white">{company.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-emerald-300">{company.sector}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{company.description}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
                <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Departements</span>
                  <p className="mt-1 text-slate-200">{(company.departments || []).slice(0, 4).map((item) => item.name).join(', ') || 'A definir'}</p>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Specialites</span>
                  <p className="mt-1 text-slate-200">{(company.acceptedSpecialties || []).slice(0, 4).join(', ') || 'A definir'}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-800 pt-4 md:flex-row md:items-center">
                <span className="text-xs text-slate-400">{company.eligibilityCriteria}</span>
                <button
                  type="button"
                  onClick={() => openStudentSignupForCompany(company.id)}
                  className="shrink-0 rounded-md bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400"
                >
                  Demander un stage
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = 'text',
  placeholder
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-950 py-2 pl-9 pr-3 text-xs font-semibold text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function CvUploadField({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">CV PDF/DOC</label>
      <label className="flex min-h-[2.25rem] cursor-pointer items-center gap-3 rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-100 outline-none transition hover:border-emerald-300 hover:bg-slate-900 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-300/20">
        <UploadCloud className="h-4 w-4 shrink-0 text-emerald-300" />
        <span className="min-w-0 flex-1 truncate">
          {value || 'Televerser un CV depuis vos documents'}
        </span>
        <span className="shrink-0 rounded bg-emerald-400/10 px-2 py-1 text-[10px] font-black uppercase text-emerald-200">
          Parcourir
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onChange(file.name);
          }}
        />
      </label>
      <p className="mt-1 text-[10px] font-medium text-slate-400">
        Formats acceptes : PDF, DOC ou DOCX.
      </p>
    </div>
  );
}
