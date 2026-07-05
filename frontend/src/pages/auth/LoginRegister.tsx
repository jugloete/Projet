import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RoleType } from '../../types';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  UserCheck, 
  AlertCircle, 
  ShieldCheck, 
  Terminal,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function LoginRegister() {
  const { login, register } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  // Sign in form inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInRole, setSignInRole] = useState<RoleType>(RoleType.STUDENT);

  // Common Registration inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<RoleType>(RoleType.STUDENT);
  const [regPassword, setRegPassword] = useState('');

  // Admin specific registration key (removed - admin signup disabled)

  // Student/Company metadata
  const [studPhone, setStudPhone] = useState('');
  const [studEducation, setStudEducation] = useState('');
  const [studSkills, setStudSkills] = useState('');
  const [compSector, setCompSector] = useState('');
  const [compAddress, setCompAddress] = useState('');
  const [compDesc, setCompDesc] = useState('');

  // Errors / Success messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signInEmail || !signInPassword) {
      setErrorMsg('Veuillez saisir votre adresse email et votre mot de passe.');
      return;
    }

    try {
      const match = await login(signInEmail, signInRole, signInPassword);
      if (!match) {
        setErrorMsg(`Aucun compte ${signInRole} trouvé avec ces identifiants.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'La connexion a échoué.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Admin signup is disabled; registration only supports Student and Company.
    if (regRole === RoleType.ADMIN) {
      setErrorMsg("La création de comptes administrateur via l'interface publique est désactivée.");
      return;
    }

    try {
      const details: any = {};
      if (regRole === RoleType.STUDENT) {
        details.phone = studPhone;
        details.education = studEducation;
        details.skills = studSkills ? studSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
      } else if (regRole === RoleType.COMPANY) {
        details.sector = compSector;
        details.address = compAddress;
        details.description = compDesc;
        details.phone = studPhone; 
      }

      await register(regName, regEmail, regRole, regPassword, details);
      setSuccessMsg('Compte créé avec succès ! Connectez-vous maintenant.');
      setIsSignUp(false);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur s'est produite lors de l'inscription.");
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotEmail) {
      setErrorMsg('Veuillez saisir votre adresse email.');
      return;
    }

    try {
      setSuccessMsg('Un lien de réinitialisation a été envoyé à votre adresse email.');
      setForgotEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible d'envoyer le lien de récupération.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#090d16] relative overflow-hidden text-xs md:text-sm font-sans antialiased">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:col-span-5 text-white flex-col justify-between p-12 relative overflow-hidden shadow-2xl border-r border-slate-800/40">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128]/95 via-[#071612]/90 to-[#0c2419]/95 mix-blend-multiply z-10" />
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-emerald-500/10 opacity-40 filter blur-3xl" />
        <div className="absolute bottom-20 right-0 h-96 w-96 rounded-full bg-blue-600/10 opacity-30 filter blur-3xl animate-pulse" />

        <div className="relative z-20">
          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit backdrop-blur-md">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-emerald-300 uppercase">Espace Académique</span>
          </div>
          
          <h1 className="text-4xl font-black tracking-tight mt-10 leading-tight bg-gradient-to-r from-white via-slate-200 to-emerald-300 bg-clip-text text-transparent">
            Propulsez votre <br />
            <span className="text-emerald-400">avenir numérique.</span>
          </h1>
          <p className="text-slate-400 mt-4 leading-relaxed max-w-sm text-xs">
            Connectez vos compétences aux meilleures entreprises à travers une infrastructure de stage moderne, fluide et sécurisée.
          </p>
        </div>

        <div className="relative z-20 space-y-4">
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/30 backdrop-blur-lg hover:border-emerald-500/20 transition-colors group">
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 group-hover:animate-spin" />
              <span className="text-[10px] font-bold text-slate-300 block uppercase font-mono tracking-wider">
                Pipeline de Validation
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Chaque offre est rigoureusement auditée par la coordination pour garantir sa conformité avec votre cursus.
            </p>
          </div>
          <div className="text-[10px] text-slate-600 font-mono">
            © 2026 Campus Connect • Plateforme de Stages.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-12 relative min-h-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-emerald-500/[0.02] rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#0f172a]/60 backdrop-blur-xl px-6 py-8 md:px-8 border border-slate-800/80 rounded-2xl shadow-2xl z-15 relative">
          
          <div className="text-center space-y-1.5 mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {forgotPasswordMode ? "Récupération" : isSignUp ? "Créer un profil" : "Espace Privé"}
            </h2>
            <p className="text-xs text-slate-400">
              {forgotPasswordMode ? "Entrez votre adresse de messagerie enregistrée." :
               isSignUp ? "Rejoignez le réseau d'insertion professionnelle." : "Saisissez vos accès pour manager votre tableau de bord."}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 text-xs rounded-lg flex items-center mb-4">
              <AlertCircle className="h-4 w-4 text-red-400 mr-2 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs rounded-lg flex items-center mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-400 mr-2 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FLOW A: FORGOT PASSWORD */}
          {forgotPasswordMode ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Email Universitaire ou Entreprise</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="exemple@domaine.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs shadow-lg shadow-emerald-900/20 cursor-pointer transition-colors"
              >
                Générer un lien de réinitialisation
              </button>

              <button
                type="button"
                onClick={() => { setForgotPasswordMode(false); setErrorMsg(''); setSuccessMsg(''); }}
                className="w-full text-center text-xs text-emerald-400 hover:text-emerald-300 font-medium mt-2 transition-colors"
              >
                Retour à la connexion
              </button>
            </form>
          ) : isSignUp ? (
            
            /* FLOW B: SIGN UP (WITH ADMIN OPTION CORRECTED) */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type de compte</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole(RoleType.STUDENT)}
                    className={`p-2 border rounded-lg flex items-center justify-center space-x-1.5 text-xs font-bold transition-all cursor-pointer ${
                      regRole === RoleType.STUDENT 
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-md' 
                        : 'bg-[#0b0f19] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Étudiant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole(RoleType.COMPANY)}
                    className={`p-2 border rounded-lg flex items-center justify-center space-x-1.5 text-xs font-bold transition-all cursor-pointer ${
                      regRole === RoleType.COMPANY 
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-md' 
                        : 'bg-[#0b0f19] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Entreprise</span>
                  </button>
                  {/* Only Student and Company registrations allowed. */}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {regRole === RoleType.STUDENT ? "Identité Complète" : regRole === RoleType.COMPANY ? "Raison Sociale de l'entreprise" : "Nom complet de l'Administrateur"}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden focus:border-emerald-500/50 transition-all"
                  placeholder={regRole === RoleType.STUDENT ? "Ex: Sarah El Amrani" : regRole === RoleType.COMPANY ? "Ex: Gecamines" : "Ex: Directeur Informatique"}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden focus:border-emerald-500/50 transition-all"
                    placeholder="sarah@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Clé Secrète (Mot de passe)</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden focus:border-emerald-500/50 transition-all"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* DYNAMIC METADATA INPUTS */}
              {regRole === RoleType.STUDENT && (
                <div className="space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden"
                        placeholder="+243..."
                        value={studPhone}
                        onChange={(e) => setStudPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Promotion / Cursus</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden"
                        placeholder="Ex: BAC 2 GLIA"
                        value={studEducation}
                        onChange={(e) => setStudEducation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Stack / Compétences (Virgules)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden"
                      placeholder="React, Laravel, Tailwind"
                      value={studSkills}
                      onChange={(e) => setStudSkills(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {regRole === RoleType.COMPANY && (
                <div className="space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Secteur</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden"
                        placeholder="Ex: Énergie / Banque"
                        value={compSector}
                        onChange={(e) => setCompSector(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Siège Social</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden"
                        placeholder="Ex: Kolwezi, RDC"
                        value={compAddress}
                        onChange={(e) => setCompAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {regRole === RoleType.ADMIN && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Téléphone de contact</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 outline-hidden"
                      placeholder="+243..."
                      value={studPhone}
                      onChange={(e) => setStudPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs shadow-lg shadow-emerald-900/20 cursor-pointer transition-colors"
              >
                Finaliser la création de compte
              </button>

              <p className="text-center text-xs text-slate-400 pt-1">
                Déjà membre ?{" "}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  Identifiez-vous
                </button>
              </p>
            </form>
          ) : (
            
            /* FLOW C: STANDARD SIGN IN */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Rôle applicatif</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSignInRole(RoleType.STUDENT)}
                    className={`py-2 px-1 border rounded-lg flex flex-col items-center justify-center font-bold tracking-tight transition-all cursor-pointer ${
                      signInRole === RoleType.STUDENT 
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-md' 
                        : 'bg-[#0b0f19] text-slate-400 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <User className="h-3.5 w-3.5 mb-0.5" />
                    <span>Étudiant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignInRole(RoleType.COMPANY)}
                    className={`py-2 px-1 border rounded-lg flex flex-col items-center justify-center font-bold tracking-tight transition-all cursor-pointer ${
                      signInRole === RoleType.COMPANY 
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-md' 
                        : 'bg-[#0b0f19] text-slate-400 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5 mb-0.5" />
                    <span>Entreprise</span>
                  </button>
                    {/* Supervisor login option removed: supervisors are created by companies and do not appear as a public role on the login page. */}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Identifiant Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="nom@exemple.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMode(true)}
                    className="text-[10px] text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
                  >
                    Clé perdue ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-900/20 cursor-pointer transition-colors"
              >
                Accéder à la plateforme
              </button>

              <p className="text-center text-xs text-slate-400 pt-1">
                Pas encore enregistré ?{" "}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  Créer un compte
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}