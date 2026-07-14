import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RoleType, Internship, ApplicationStatus } from '../../types';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Coins, 
  CalendarDays, 
  Search, 
  PlusCircle, 
  ThumbsUp, 
  ThumbsDown, 
  X, 
  Heart,
  Edit2,
  FileText,
  BookmarkCheck,
  Check,
  AlertCircle
} from 'lucide-react';

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ''));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

export default function InternshipsList() {
  const { 
    currentUser, 
    internships, 
    studentProfile, 
    companyProfile, 
    createInternship, 
    updateInternship, 
    validateInternship, 
    applyToInternship,
    toggleFavoriteInternship,
    applications
  } = useApp();

  // Search filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals visibility states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  // Success notifications inside modal
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Application & Job Posting Form inputs
  const [cvName, setCvName] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [cvFileLoading, setCvFileLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  // New internship fields
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newRemuneration, setNewRemuneration] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newSkills, setNewSkills] = useState('');

  if (!currentUser) return null;

  // Filter internships depending on role permissions
  let filteredInternships = internships;

  if (currentUser.role === RoleType.STUDENT) {
    // Students only see published internships
    filteredInternships = internships.filter(i => i.status === 'published');
  } else if (currentUser.role === RoleType.COMPANY) {
    // Companies see all internships by default, filtered globally below
    filteredInternships = internships;
  }

  // Filter by search terms, city and status selection
  filteredInternships = filteredInternships.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          i.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCity = cityFilter === '' || i.city.toLowerCase().includes(cityFilter.toLowerCase());
    
    // Fixed: Handle "my-posts" specifically for companies, otherwise match the direct status string
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'my-posts' ? i.companyId === companyProfile?.id : i.status === statusFilter);

    return matchesSearch && matchesCity && matchesStatus;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!cvName) {
      setErrorMsg('Veuillez choisir le fichier de votre CV.');
      return;
    }

    if (!cvUrl || cvUrl === '#') {
      setErrorMsg('Veuillez choisir un fichier CV ouvrable avant d envoyer la candidature.');
      return;
    }

    if (cvFileLoading) {
      setErrorMsg('Le CV est encore en cours de chargement, patientez un instant.');
      return;
    }

    try {
      if (selectedInternship) {
        await applyToInternship(selectedInternship.id, cvName, coverLetter, { cvUrl });
        setSuccessMsg(`Votre candidature a ete envoyee avec succes a ${selectedInternship.companyName}.`);
        setTimeout(() => {
          setApplyModalOpen(false);
          setSelectedInternship(null);
          setCvName('');
          setCvUrl('');
          setCvFileLoading(false);
          setCoverLetter('');
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue.');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newCity || !newDuration || !newRemuneration || !newDeadline) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const skillsArr = newSkills ? newSkills.split(',').map(s => s.trim()).filter(Boolean) : [];

    createInternship({
      title: newTitle,
      description: newDesc,
      city: newCity,
      duration: newDuration,
      remuneration: newRemuneration,
      deadline: newDeadline,
      skillsRequired: skillsArr
    });

    setSuccessMsg('Votre offre de stage a été créée avec succès et attend l\'approbation de l\'administrateur !');
    setTimeout(() => {
      setCreateModalOpen(false);
      resetCreateForm();
    }, 2500);
  };

  const resetCreateForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewCity('');
    setNewDuration('');
    setNewRemuneration('');
    setNewDeadline('');
    setNewSkills('');
    setSuccessMsg('');
    setErrorMsg('');
  };

  const openApplyModal = (internship: Internship) => {
    setSelectedInternship(internship);
    setCvName(studentProfile?.cvName || '');
    setCvUrl(studentProfile?.cvUrl || '');
    setCvFileLoading(false);
    setCoverLetter(studentProfile?.coverLetter || '');
    setApplyModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* List Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium">Parcourez et gérez les offres de stages académiques de la plateforme.</p>
        </div>

        {currentUser.role === RoleType.COMPANY && (
          <button
            onClick={() => { resetCreateForm(); setCreateModalOpen(true); }}
            className="flex items-center space-x-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs md:text-sm shadow-md transition-colors self-start cursor-pointer"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Publier un nouveau stage</span>
          </button>
        )}
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (poste, mot-clé, compétence)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* City selection filter */}
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrer par ville..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status role customized filters */}
        <div className="flex items-center gap-2">
          {currentUser.role === RoleType.COMPANY ? (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">Toutes les offres système</option>
              <option value="my-posts">Mes offres exclusivement</option>
              <option value="published">En ligne uniquement</option>
              <option value="pending">En attente de validation</option>
            </select>
          ) : currentUser.role === RoleType.ADMIN ? (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">Toutes les offres</option>
              <option value="pending">🔑 En attente d'approbation</option>
              <option value="published">Acceptées & En ligne</option>
              <option value="rejected">Refusées</option>
            </select>
          ) : (
            <div className="text-slate-500 text-xs font-semibold px-2 py-2">
              Affichage des offres approuvées ({filteredInternships.length})
            </div>
          )}
        </div>
      </div>

      {/* RENDER INTERNSHIP GRID ITEMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.length === 0 ? (
          <div className="col-span-full py-16 bg-white border border-dashed text-center rounded-xl">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold text-sm">Aucune offre de stage ne correspond à vos filtres de recherche.</p>
          </div>
        ) : (
          filteredInternships.map((job) => {
            const isFav = studentProfile?.favoriteInternships?.includes(job.id);
            const userHasApplied = applications.some(a => a.internshipId === job.id && a.studentId === studentProfile?.id);
            return (
              <div 
                key={job.id} 
                className="bg-white border border-slate-200 rounded-xl shadow-2xs hover:shadow-md transition-all flex flex-col hover:border-blue-200 overflow-hidden relative"
              >
                {/* Visual Card Header */}
                <div className="p-5 border-b border-slate-100 flex items-start gap-4">
                  <img
                    src={job.companyLogo || "https://picsum.photos/seed/company/64/64"}
                    alt={job.companyName}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 rounded-lg bg-slate-50 border border-slate-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {job.duration}
                      </span>
                      {currentUser.role === RoleType.STUDENT && (
                        <button 
                          onClick={() => toggleFavoriteInternship(job.id)}
                          className="text-rose-500 hover:scale-110 transition-transform p-1 rounded-full hover:bg-rose-50 cursor-pointer"
                        >
                          <Heart className={`h-5 w-5 ${isFav ? 'fill-rose-500' : 'text-slate-400'}`} />
                        </button>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm md:text-base mt-2 leading-snug truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 tracking-tight mt-0.5">{job.companyName}</p>
                  </div>
                </div>

                {/* Card details information */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* description truncated */}
                  <div className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {job.description}
                  </div>

                  {/* properties badges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{job.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Coins className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{job.remuneration}</span>
                    </div>
                    <div className="flex items-center space-x-1 col-span-2">
                      <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Clôture: <span className="text-red-600 font-bold">{job.deadline}</span></span>
                    </div>
                  </div>

                  {/* Skills tags required */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.skillsRequired.map((skill, index) => (
                      <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[9px] rounded-md tracking-tight uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Admin review information state */}
                  {currentUser.role === RoleType.ADMIN && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Statut de l'offre:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        job.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                        job.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {job.status === 'published' ? 'En ligne' :
                         job.status === 'pending' ? 'En attente' : 'Refusée'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom interactive action button */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  {currentUser.role === RoleType.STUDENT && (
                    <button
                      onClick={() => openApplyModal(job)}
                      disabled={userHasApplied}
                      className={`w-full py-2 rounded-lg text-xs font-bold text-center transition-colors shadow-2xs ${
                        userHasApplied 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed flex items-center justify-center space-x-1' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      }`}
                    >
                      {userHasApplied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Déjà postulé</span>
                        </>
                      ) : (
                        "Postuler à cette offre"
                      )}
                    </button>
                  )}

                  {currentUser.role === RoleType.ADMIN && job.status === 'pending' && (
                    <div className="w-full grid grid-cols-2 gap-2">
                      <button
                        onClick={() => validateInternship(job.id, 'published')}
                        className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>Approuver</span>
                      </button>
                      <button
                        onClick={() => validateInternship(job.id, 'rejected')}
                        className="py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        <span>Refuser</span>
                      </button>
                    </div>
                  )}

                  {currentUser.role === RoleType.COMPANY && job.companyId === companyProfile?.id && (
                    <div className="w-full flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-[10px] uppercase">
                        Statut : {job.status === 'published' ? 'En ligne' : 'En examen'}
                      </span>
                      <button
                        onClick={() => updateInternship(job.id, { status: job.status === 'published' ? 'archived' : 'published' })}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        {job.status === 'published' ? 'Archiver' : 'Activer'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: STUDENT APPLY TO INTERNSHIP */}
      {applyModalOpen && selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
              <div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Postuler en ligne
                </span>
                <h3 className="font-extrabold text-slate-900 text-base md:text-lg mt-1 truncate">
                  {selectedInternship.title}
                </h3>
              </div>
              <button 
                onClick={() => setApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-full shadow-xs cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-semibold flex items-center space-x-1">
                  <AlertCircle className="h-4.5 w-4.5 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-semibold flex items-center space-x-1">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <p className="text-xs text-slate-500">
                L'entreprise <strong>{selectedInternship.companyName}</strong> recevra instantanément une notification système contenant vos éléments ci-dessous.
              </p>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs font-semibold leading-5 text-blue-900">
                Cette candidature sera dirigee vers <strong>{selectedInternship.companyName}</strong> pour l'offre <strong>{selectedInternship.title}</strong>.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Fichier CV attaché *
                </label>
                <label className="flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50/50 focus-within:ring-2 focus-within:ring-blue-500">
                  <FileText className="h-4.5 w-4.5 shrink-0 text-blue-500" />
                  <span className="min-w-0 flex-1 truncate">
                    {cvFileLoading ? 'Chargement du CV...' : cvName || 'Choisir un CV PDF, DOC ou DOCX'}
                  </span>
                  <span className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase text-white">
                    Parcourir
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    required={!cvUrl || cvUrl === '#'}
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setErrorMsg('');
                      setCvName(file.name);
                      setCvFileLoading(true);
                      try {
                        setCvUrl(await readFileAsDataUrl(file));
                      } catch {
                        setCvUrl('');
                        setErrorMsg('Impossible de charger ce CV. Veuillez choisir un autre fichier.');
                      } finally {
                        setCvFileLoading(false);
                      }
                    }}
                  />
                </label>
                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  Formats acceptes : PDF, DOC ou DOCX.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Lettre de motivation (Max 1000 mots)
                </label>
                <textarea
                  rows={5}
                  placeholder="Pourquoi souhaitez-vous postuler à ce stage ? Présentez rapidement votre motivation..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-md cursor-pointer transition-colors"
                >
                  Envoyer la candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPANY REGISTER NEW INTERNSHIP POSTING */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div>
                <h3 className="font-extrabold text-base md:text-lg">Créer une offre de stage académique</h3>
                <p className="text-[10px] text-slate-400">Soumettez votre projet pour validation auprès des instances universitaires.</p>
              </div>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full shadow-xs cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-semibold">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-semibold">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Intitulé du stage *</label>
                  <input
                    type="text"
                    placeholder="Ex: Développeur front React"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Durée du stage *</label>
                  <input
                    type="text"
                    placeholder="Ex: 6 mois"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ville / Location *</label>
                  <input
                    type="text"
                    placeholder="Ex: Lyon (69002)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rémunération / Gratification *</label>
                  <input
                    type="text"
                    placeholder="Ex: 350 $ / mois"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    value={newRemuneration}
                    onChange={(e) => setNewRemuneration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date limite de candidature *</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Compétences techniques requises (séparées par des virgules) *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Figma, React, TypeScript, Tailwind"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description détaillée du poste *</label>
                <textarea
                  rows={4}
                  placeholder="Décrivez précisément les rôles, les responsabilités de l'étudiant et l'environnement technique..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-md cursor-pointer transition-colors"
                >
                  Soumettre pour validation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
