import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RoleType } from '../../types';
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Figma, 
  FileText, 
  Save, 
  Check, 
  Building2, 
  Code,
  Camera,
  AlertTriangle,
  Trash2
} from 'lucide-react';

const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024;
const PROFILE_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const prepareProfilePhoto = (file: File) => new Promise<string>((resolve, reject) => {
  const imageUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const outputSize = Math.min(512, sourceSize);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context || !outputSize) {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Image invalide.'));
      return;
    }

    canvas.width = outputSize;
    canvas.height = outputSize;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, outputSize, outputSize);
    context.drawImage(
      image,
      (image.naturalWidth - sourceSize) / 2,
      (image.naturalHeight - sourceSize) / 2,
      sourceSize,
      sourceSize,
      0,
      0,
      outputSize,
      outputSize
    );

    URL.revokeObjectURL(imageUrl);
    resolve(canvas.toDataURL('image/jpeg', 0.86));
  };

  image.onerror = () => {
    URL.revokeObjectURL(imageUrl);
    reject(new Error('Impossible de lire cette image.'));
  };

  image.src = imageUrl;
});

export default function ProfileSettings() {
  const { currentUser, studentProfile, companyProfile, updateStudentProfile, updateCompanyProfile, withdrawCurrentCompany } = useApp();

  const [savingMsg, setSavingMsg] = useState('');

  // 1. STUDENT FORM WORKFLOW INPUTS
  const [studPhone, setStudPhone] = useState(studentProfile?.phone || '');
  const [studEducation, setStudEducation] = useState(studentProfile?.education || '');
  const [studBio, setStudBio] = useState(studentProfile?.bio || '');
  const [studCvName, setStudCvName] = useState(studentProfile?.cvName || '');
  const [studSkills, setStudSkills] = useState(studentProfile?.skills?.join(', ') || '');
  const [studAvatarUrl, setStudAvatarUrl] = useState(studentProfile?.avatarUrl || '');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  // 2. COMPANY FORM WORKFLOW INPUTS
  const [compSector, setCompSector] = useState(companyProfile?.sector || '');
  const [compAddress, setCompAddress] = useState(companyProfile?.address || '');
  const [compContactName, setCompContactName] = useState(companyProfile?.contactName || '');
  const [compContactPhone, setCompContactPhone] = useState(companyProfile?.contactPhone || '');
  const [compDescription, setCompDescription] = useState(companyProfile?.description || '');
  const [compDepartments, setCompDepartments] = useState(companyProfile?.departments?.map((department) => department.name).join(', ') || '');
  const [compRequiredSkills, setCompRequiredSkills] = useState(companyProfile?.requiredSkills?.join(', ') || '');
  const [compSpecialties, setCompSpecialties] = useState(companyProfile?.acceptedSpecialties?.join(', ') || '');
  const [compEligibilityCriteria, setCompEligibilityCriteria] = useState(companyProfile?.eligibilityCriteria || '');
  const [compLogoUrl, setCompLogoUrl] = useState(companyProfile?.logoUrl || '');
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoError, setLogoError] = useState('');

  if (!currentUser) return null;

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!PROFILE_PHOTO_TYPES.includes(file.type)) {
      setAvatarError('Choisissez une image JPG, PNG ou WebP.');
      return;
    }

    if (file.size > MAX_PROFILE_PHOTO_SIZE) {
      setAvatarError('La photo ne peut pas dépasser 5 Mo.');
      return;
    }

    setAvatarLoading(true);
    setAvatarError('');
    setSavingMsg('Enregistrement de la photo...');
    try {
      const avatarUrl = await prepareProfilePhoto(file);
      updateStudentProfile({ avatarUrl });
      setStudAvatarUrl(avatarUrl);
      setSavingMsg('✓ Photo enregistrée avec succès !');
      setTimeout(() => setSavingMsg(''), 2000);
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : 'Impossible de modifier la photo.');
      setSavingMsg('');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleCompanyLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!PROFILE_PHOTO_TYPES.includes(file.type)) {
      setLogoError('Choisissez une image JPG, PNG ou WebP.');
      return;
    }

    if (file.size > MAX_PROFILE_PHOTO_SIZE) {
      setLogoError('La photo ne peut pas depasser 5 Mo.');
      return;
    }

    setLogoLoading(true);
    setLogoError('');
    setSavingMsg('Enregistrement de la photo...');
    try {
      const logoUrl = await prepareProfilePhoto(file);
      updateCompanyProfile({ logoUrl });
      setCompLogoUrl(logoUrl);
      setSavingMsg('Photo enregistree avec succes !');
      setTimeout(() => setSavingMsg(''), 2000);
    } catch (error) {
      setLogoError(error instanceof Error ? error.message : 'Impossible de modifier la photo.');
      setSavingMsg('');
    } finally {
      setLogoLoading(false);
    }
  };

  const handleStudentSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMsg('Mise à jour de votre profil étudiant...');
    
    const skillsArr = studSkills ? studSkills.split(',').map(s => s.trim()).filter(Boolean) : [];

    setTimeout(() => {
      updateStudentProfile({
        phone: studPhone,
        education: studEducation,
        bio: studBio,
        cvName: studCvName,
        skills: skillsArr,
        avatarUrl: studAvatarUrl || studentProfile.avatarUrl
      });
      setSavingMsg('✓ Informations enregistrées avec succès !');
      setTimeout(() => setSavingMsg(''), 2000);
    }, 1000);
  };

  const handleCompanySave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMsg('Mise à jour de l\'identité de votre entreprise...');

    setTimeout(() => {
      updateCompanyProfile({
        sector: compSector,
        address: compAddress,
        contactName: compContactName,
        contactPhone: compContactPhone,
        description: compDescription,
        departments: compDepartments
          .split(',')
          .map((name, index) => name.trim())
          .filter(Boolean)
          .map((name, index) => ({
            id: `${companyProfile?.id || currentUser.id}-dept-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
            name
          })),
        requiredSkills: compRequiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean),
        acceptedSpecialties: compSpecialties.split(',').map((specialty) => specialty.trim()).filter(Boolean),
        eligibilityCriteria: compEligibilityCriteria,
        logoUrl: compLogoUrl || companyProfile?.logoUrl
      });
      setSavingMsg('✓ Informations enregistrées avec succès !');
      setTimeout(() => setSavingMsg(''), 2000);
    }, 1000);
  };

  const handleCompanyWithdrawal = () => {
    if (!companyProfile) return;
    const firstConfirm = window.confirm(
      `Voulez-vous vraiment retirer "${companyProfile.name}" de la plateforme ? Vos offres seront archivees et le compte entreprise sera supprime.`
    );
    if (!firstConfirm) return;
    const secondConfirm = window.confirm('Cette action deconnectera le compte entreprise. Confirmez-vous le retrait ?');
    if (!secondConfirm) return;
    withdrawCurrentCompany();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-slate-205 shadow-xs animate-fade-in text-xs md:text-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div>
          <h2 className="text-base md:text-xl font-extrabold text-slate-900">Configurer mes informations de profil</h2>
          <p className="text-xs text-slate-450 font-medium">Maintenez vos dossiers d'accréditations et coordonnées à jour.</p>
        </div>
        
        {savingMsg && (
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold animate-pulse">
            {savingMsg}
          </span>
        )}
      </div>

      {currentUser.role === RoleType.STUDENT && studentProfile && (
        <form onSubmit={handleStudentSave} className="space-y-5">
          {/* Avatar & identity teaser */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50/50 rounded-xl border">
            <img 
              src={studAvatarUrl || studentProfile.avatarUrl}
              alt={currentUser.name} 
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-full object-cover ring-4 ring-slate-100"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base">{currentUser.name}</h3>
              <p className="text-xs text-slate-450 mt-0.5">{currentUser.email}</p>
              <div className="mt-3 flex items-center gap-2">
                <label
                  htmlFor="student-profile-photo"
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 transition-colors ${
                    avatarLoading ? 'cursor-wait opacity-60' : 'cursor-pointer hover:bg-slate-100'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>{avatarLoading ? 'Traitement...' : 'Modifier la photo'}</span>
                </label>
                <input
                  id="student-profile-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={avatarLoading}
                  onChange={handleAvatarChange}
                />
              </div>
              {avatarError && <p className="mt-2 text-xs font-medium text-rose-600">{avatarError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center">
                <Phone className="h-4 w-4 mr-1 text-slate-400" /> Numéro de téléphone
              </label>
              <input
                type="text"
                placeholder="Ex : +33 6 12 34 56 78"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={studPhone}
                onChange={(e) => setStudPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center">
                <GraduationCap className="h-4 w-4 mr-1 text-slate-400" /> Diplômes / Formation académique
              </label>
              <input
                type="text"
                placeholder="Ex : Master d'Informatique, Univ Lyon 1"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={studEducation}
                onChange={(e) => setStudEducation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center">
              <FileText className="h-4 w-4 mr-1 text-slate-400" /> CV en ligne (Nom du fichier PDF téléchargé)
            </label>
            <input
              type="text"
              placeholder="Ex : Sarah_El_Amrani_CV.pdf"
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              value={studCvName}
              onChange={(e) => setStudCvName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center">
              <Code className="h-4 w-4 mr-1 text-slate-400" /> Vos compétences techniques (Séparées par des virgules)
            </label>
            <input
              type="text"
              placeholder="Ex : React, TypeScript, PHP, Docker, Git"
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              value={studSkills}
              onChange={(e) => setStudSkills(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phrase d'introduction / Biographie (Bio)</label>
            <textarea
              rows={4}
              placeholder="Exprimez votre projet professionnel, vos forces principales..."
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              value={studBio}
              onChange={(e) => setStudBio(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md cursor-pointer flex items-center space-x-1.5 transition-colors bg-blue-600"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer mon dossier</span>
            </button>
          </div>
        </form>
      )}

      {currentUser.role === RoleType.COMPANY && (
        <form onSubmit={handleCompanySave} className="space-y-5">
          {/* Logo & identity teaser */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50/50 rounded-xl border">
            <img 
              src={compLogoUrl || companyProfile?.logoUrl || `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=150&q=80`} 
              alt={companyProfile?.name || currentUser.name} 
              className="h-16 w-16 rounded-xl object-cover ring-4 ring-slate-100 border bg-white"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base">{companyProfile?.name || currentUser.name}</h3>
              <p className="text-xs text-slate-450 mt-0.5">{companyProfile?.email || currentUser.email}</p>
              <div className="mt-3 flex items-center gap-2">
                <label
                  htmlFor="company-profile-photo"
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 transition-colors ${
                    logoLoading ? 'cursor-wait opacity-60' : 'cursor-pointer hover:bg-slate-100'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>{logoLoading ? 'Traitement...' : 'Modifier la photo'}</span>
                </label>
                <input
                  id="company-profile-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={logoLoading}
                  onChange={handleCompanyLogoChange}
                />
              </div>
              {logoError && <p className="mt-2 text-xs font-medium text-rose-600">{logoError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center">
                <Building2 className="h-4 w-4 mr-0.5 text-slate-400" /> Secteur d'activité principal
              </label>
              <input
                type="text"
                placeholder="Ex : Éditeur de logiciels cloud"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={compSector}
                onChange={(e) => setCompSector(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-0.5 text-slate-400" /> Adresse physique du siège
              </label>
              <input
                type="text"
                placeholder="Ex : 42 avenue de l'innovation, Paris"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={compAddress}
                onChange={(e) => setCompAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom complet du recruteur référent</label>
              <input
                type="text"
                placeholder="Ex : Marc Depont"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={compContactName}
                onChange={(e) => setCompContactName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ligne de contact téléphone</label>
              <input
                type="text"
                placeholder="Ex : +33 1 45 67 89 01"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={compContactPhone}
                onChange={(e) => setCompContactPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Raison sociale de l'entreprise</label>
            <textarea
              rows={4}
              placeholder="Présentez l'entreprise, ses valeurs, son équipe technique et ses projets de croissance..."
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              value={compDescription}
              onChange={(e) => setCompDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departements disponibles</label>
              <textarea
                rows={3}
                placeholder="Informatique, Finance, Maintenance"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={compDepartments}
                onChange={(e) => setCompDepartments(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Competences recherchees</label>
              <textarea
                rows={3}
                placeholder="React, Excel avance, Communication"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={compRequiredSkills}
                onChange={(e) => setCompRequiredSkills(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialites acceptees</label>
              <textarea
                rows={3}
                placeholder="Genie logiciel, Comptabilite, Reseaux"
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={compSpecialties}
                onChange={(e) => setCompSpecialties(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Criteres d'eligibilite</label>
              <textarea
                rows={3}
                placeholder="CV obligatoire, niveau minimum, disponibilite..."
                className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                value={compEligibilityCriteria}
                onChange={(e) => setCompEligibilityCriteria(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md cursor-pointer flex items-center space-x-1.5 transition-colors bg-blue-600"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer l'identité</span>
            </button>
          </div>
        </form>
      )}

      {currentUser.role === RoleType.COMPANY && companyProfile && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <h3 className="text-sm font-extrabold text-red-950">Retirer mon entreprise de la plateforme</h3>
                <p className="mt-1 text-xs leading-5 text-red-800">
                  Cette action retire l'entreprise des partenaires, archive ses offres et ferme l'acces de ses superviseurs.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCompanyWithdrawal}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Se retirer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
