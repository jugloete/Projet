import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RoleType, CompanyProfile } from '../../types';
import { 
  Building2, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Tag, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  X, 
  Send,
  Briefcase,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function PartnersPage() {
  const { 
    currentUser, 
    companies, 
    internships, 
    addPartnerCompanyByAdmin, 
    updatePartnerCompanyByAdmin, 
    deletePartnerCompanyByAdmin,
    showToast 
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Modals / Form States
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyProfile | null>(null);

  // Form Fields
  const [formFields, setFormFields] = useState({
    name: '',
    sector: '',
    address: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: ''
  });

  if (!currentUser) return null;

  const isAdmin = currentUser.role === RoleType.ADMIN;

  // Extract unique sectors and cities for filter dropdowns
  const sectors = Array.from(new Set(companies.map(c => c.sector).filter(Boolean)));
  
  // Custom helper to extract city from Address (e.g. Lubumbashi, Kolwezi, Likasi)
  const getCityFromAddress = (address: string) => {
    const addr = address.toLowerCase();
    if (addr.includes('lubumbashi')) return 'Lubumbashi';
    if (addr.includes('kolwezi')) return 'Kolwezi';
    if (addr.includes('likasi')) return 'Likasi';
    if (addr.includes('kipushi')) return 'Kipushi';
    return 'Autre';
  };

  const cities = Array.from(new Set(companies.map(c => getCityFromAddress(c.address))));

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      company.name.toLowerCase().includes(query) ||
      company.sector.toLowerCase().includes(query) ||
      company.description.toLowerCase().includes(query) ||
      company.address.toLowerCase().includes(query);

    const matchesSector = !selectedSector || company.sector === selectedSector;
    const matchesCity = !selectedCity || getCityFromAddress(company.address) === selectedCity;

    return matchesSearch && matchesSector && matchesCity;
  });

  // Handle Form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name.trim()) {
      showToast('Le nom de l\'entreprise est obligatoire.', 'error');
      return;
    }
    if (!formFields.sector.trim()) {
      showToast('Le domaine d\'expertise/secteur est obligatoire.', 'error');
      return;
    }
    if (!formFields.address.trim()) {
      showToast('L\'adresse physique est obligatoire.', 'error');
      return;
    }

    const defaultLogo = formFields.logoUrl.trim() || `https://images.unsplash.com/photo-${1560000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&w=150&q=80`;

    const dataToSave = {
      userId: editingCompany ? editingCompany.userId : `user-custom-${Date.now()}`,
      name: formFields.name,
      email: formFields.contactEmail,
      logoUrl: defaultLogo,
      sector: formFields.sector,
      address: formFields.address,
      contactName: formFields.contactName,
      contactEmail: formFields.contactEmail,
      contactPhone: formFields.contactPhone,
      description: formFields.description
    };

    if (editingCompany) {
      updatePartnerCompanyByAdmin(editingCompany.id, dataToSave);
    } else {
      addPartnerCompanyByAdmin(dataToSave);
    }

    // Reset
    setShowFormModal(false);
    setEditingCompany(null);
    setFormFields({
      name: '',
      sector: '',
      address: '',
      description: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      logoUrl: ''
    });
  };

  // Open modal for editing
  const handleEditClick = (company: CompanyProfile) => {
    setEditingCompany(company);
    setFormFields({
      name: company.name,
      sector: company.sector,
      address: company.address,
      description: company.description,
      contactName: company.contactName,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      logoUrl: company.logoUrl
    });
    setShowFormModal(true);
  };

  // Open modal for creating empty
  const handleCreateClick = () => {
    setEditingCompany(null);
    setFormFields({
      name: '',
      sector: '',
      address: 'Lubumbashi (Haut-Katanga)',
      description: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      logoUrl: ''
    });
    setShowFormModal(true);
  };

  // Count active/published internships for a specific company profile
  const getCompanyInternshipsCount = (companyProfileId: string) => {
    return internships.filter(i => i.companyId === companyProfileId && i.status === 'published').length;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="partners-page-root">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 md:p-8 rounded-2xl text-white shadow-md border border-blue-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1 bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Building2 className="h-3 w-3" />
            <span>Réseau Industriel & Académique</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Répertoire des Entreprises Partenaires</h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Consultez la liste officielle de nos établissements d'accueil agréés de la région du <strong>Haut-Katanga</strong>. Découvrez leurs expertises clés, adresses physiques de chantiers et coordonnées de contact.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center shadow-md transition self-start md:self-auto"
            id="add-partner-btn"
          >
            <PlusCircle className="mr-1.5 h-4 w-4" /> Enregistrer un partenaire
          </button>
        )}
      </div>

      {/* Filter panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, expertise, description ou adresse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            id="partner-search-input"
          />
        </div>

        {/* Sector Filter */}
        <div className="relative">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            id="partner-sector-filter"
          >
            <option value="">Tous les secteurs</option>
            {sectors.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            id="partner-city-filter"
          >
            <option value="">Toutes les villes</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Counters */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>{filteredCompanies.length} entreprise(s) partenaire(s) affichée(s)</span>
        {(searchQuery || selectedSector || selectedCity) && (
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedSector('');
              setSelectedCity('');
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="bg-white p-16 rounded-xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <Building2 className="h-12 w-12 text-slate-350 mx-auto" />
          <h3 className="font-bold text-slate-850">Aucune entreprise trouvée</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Nous n'avons pas trouvé de partenaire correspondant à vos critères de recherche. Essayez de modifier la requête ou sélectionnez une autre option de filtrage régional.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="partners-grid-layout">
          {filteredCompanies.map((company) => {
            const jobsCount = getCompanyInternshipsCount(company.id);
            return (
              <div 
                key={company.id} 
                className="bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-350 transition-all flex flex-col overflow-hidden group"
                id={`partner-card-${company.id}`}
              >
                {/* Upper banner section */}
                <div className="p-5 flex gap-4 border-b border-slate-100 flex-1">
                  {/* Photo Logo */}
                  <img 
                    src={company.logoUrl} 
                    alt={company.name} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-150 shrink-0 shadow-2xs mt-1"
                  />

                  {/* Meta / Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 leading-tight group-hover:text-blue-850 transition-colors text-sm md:text-base truncate">
                        {company.name}
                      </h4>
                      {jobsCount > 0 && (
                        <span className="shrink-0 bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center">
                          <Briefcase className="h-2.5 w-2.5 mr-1" />
                          {jobsCount} offre(s) active(s)
                        </span>
                      )}
                    </div>

                    {/* Sector / Expertise tag */}
                    <div className="flex items-center space-x-1.5 text-xs text-slate-650">
                      <Tag className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="font-bold text-slate-800 line-clamp-1">{company.sector}</span>
                    </div>

                    {/* Short address */}
                    <div className="flex items-start space-x-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{company.address}</span>
                    </div>
                  </div>
                </div>

                {/* Description and Contacts Section */}
                <div className="px-5 py-4 bg-slate-50/50 flex-1 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                    "{company.description || 'Aucune description disponible pour cette entité partenaire.'}"
                  </p>

                  {/* Contacts info grid */}
                  <div className="p-3 bg-white rounded-lg border border-slate-150 space-y-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block border-b pb-1 mb-1">
                      Informations de Contact Officiel
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {/* Contact Person Name */}
                      <div className="flex items-center space-x-2 text-slate-700">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate"><strong>Rep :</strong> {company.contactName || 'Non renseigné'}</span>
                      </div>

                      {/* Contact Email */}
                      <div className="flex items-center space-x-2 text-slate-700 min-w-0">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <a 
                          href={`mailto:${company.contactEmail}`} 
                          className="hover:text-blue-600 transition-colors truncate"
                          title={company.contactEmail}
                        >
                          {company.contactEmail || company.email || 'Non renseigné'}
                        </a>
                      </div>

                      {/* Contact Phone */}
                      <div className="flex items-center space-x-2 text-slate-700 md:col-span-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span><strong>Tél :</strong> {company.contactPhone || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin controls and visual footer */}
                <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400">ID: {company.id}</span>
                  
                  {isAdmin ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(company)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                        title="Modifier les informations"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise partenaire "${company.name}" ?`)) {
                            deletePartnerCompanyByAdmin(company.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                        title="Supprimer le partenaire"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center text-[11px] text-blue-600 font-bold hover:underline cursor-pointer">
                      <span>Agréée par le Secrétariat Académique</span>
                      <CheckCircle className="h-3.5 w-3.5 ml-1 text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER NOTICE */}
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-700 block">Note de certification</span>
          Toutes les entreprises listées dans ce répertoire disposent d'un accord-cadre actif avec notre faculté au Katanga. Si vous êtes promoteur industriel d'une entité non répertoriée, merci d'adresser une requête officielle d'intégration d'organisation au bureau de l'administrateur.
        </div>
      </div>

      {/* REGISTER / EDIT MODAL FORM */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="partner-form-modal">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col animate-slide-up">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center">
                <Building2 className="h-5 w-5 mr-1.5 text-blue-600" />
                {editingCompany ? 'Modifier l\'entreprise partenaire' : 'Enregistrer une nouvelle entreprise'}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom commercial de l'entreprise *</label>
                <input
                  type="text"
                  required
                  value={formFields.name}
                  onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                  placeholder="Ex : Tenke Fungurume Mining, Kamoa Copper"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                />
              </div>

              {/* Sector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Domaines d'expertise / Secteur d'activité *</label>
                <input
                  type="text"
                  required
                  value={formFields.sector}
                  onChange={(e) => setFormFields({ ...formFields, sector: e.target.value })}
                  placeholder="Ex : Hydrologie, Énergétique, Génie Électrique, Exploitation Minière"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Adresse physique (Haut-Katanga) *</label>
                <input
                  type="text"
                  required
                  value={formFields.address}
                  onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                  placeholder="Ex : Avenue Laurent-Désiré Kabila, Likasi (Haut-Katanga)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description concise (Vibe, missions, etc.)</label>
                <textarea
                  value={formFields.description}
                  onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                  placeholder="Présentation générale de l'entreprise d'accueil pour susciter de l'intérêt..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL du Logo (Image Unsplash ou hébergée)</label>
                <input
                  type="url"
                  value={formFields.logoUrl}
                  onChange={(e) => setFormFields({ ...formFields, logoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... (Laisser vide pour une image aléatoire)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                />
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] text-indigo-650 font-extrabold uppercase tracking-wider block mb-2">
                  Contact et Référence Institutionnelle
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Contact Person */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nom du Représentant</label>
                    <input
                      type="text"
                      value={formFields.contactName}
                      onChange={(e) => setFormFields({ ...formFields, contactName: e.target.value })}
                      placeholder="Ex : M. Charles Chinyemba"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Numéro de Téléphone</label>
                    <input
                      type="tel"
                      value={formFields.contactPhone}
                      onChange={(e) => setFormFields({ ...formFields, contactPhone: e.target.value })}
                      placeholder="Ex : +243 812 345 678"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Adresse Email Institutionnelle</label>
                    <input
                      type="email"
                      value={formFields.contactEmail}
                      onChange={(e) => setFormFields({ ...formFields, contactEmail: e.target.value })}
                      placeholder="Ex : contact@kamoacopper.cd"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky bottom save bar inside form */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center shadow-xs transition"
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" /> Enregistrer les informations
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
