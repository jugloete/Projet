const RoleType = {
  ADMIN: 'admin',
  STUDENT: 'student',
  COMPANY: 'company'
};

const ApplicationStatus = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptée',
  REJECTED: 'Refusée',
  INTERVIEW: 'Entretien programmé'
};

const INITIAL_USERS = [
  {
    id: 'user-admin-1',
    name: 'Jean Renaud (Admin)',
    email: 'admin@internship.com',
    role: RoleType.ADMIN,
    status: 'active',
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'user-supervisor-demo-1',
    name: 'M. Christian Kabange (Superviseur demo)',
    email: 'supervisor.demo@gecamines.cd',
    role: 'SUPERVISOR',
    status: 'active',
    createdAt: '2026-06-01T09:00:00Z',
    companyId: 'company-profile-1',
    position: 'Maitre de stage',
    departmentName: 'Maintenance',
    skills: ['Maintenance', 'Securite industrielle'],
    assignedStudentIds: ['student-profile-1']
  },
  {
    id: 'user-student-1',
    name: 'Sarah El Amrani',
    email: 'sarah.student@example.com',
    role: RoleType.STUDENT,
    status: 'active',
    createdAt: '2026-02-15T10:30:00Z'
  },
  {
    id: 'user-company-1',
    name: 'Gécamines S.A.',
    email: 'recrutement@gecamines.cd',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-02-01T14:20:00Z'
  },
  {
    id: 'user-company-2',
    name: 'Ruashi Mining',
    email: 'careers@ruashimining.com',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-03-10T11:00:00Z'
  },
  {
    id: 'user-company-3',
    name: 'Trust Merchant Bank (TMB)',
    email: 'rh@tmb.cd',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-03-12T10:00:00Z'
  },
  {
    id: 'user-company-4',
    name: 'Tenke Fungurume Mining (TFM)',
    email: 'hr@tfm.cd',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-04-10T08:00:00Z'
  },
  {
    id: 'user-company-5',
    name: 'Kamoa Copper S.A.',
    email: 'recruitment@kamoacopper.cd',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-04-15T09:00:00Z'
  },
  {
    id: 'user-company-6',
    name: 'Société Nationale d\'Électricité (SNEL)',
    email: 'stages@snel.cd',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-04-20T10:00:00Z'
  },
  {
    id: 'user-company-7',
    name: 'Rawbank S.A.',
    email: 'recruit@rawbank.cd',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-05-01T11:00:00Z'
  },
  {
    id: 'user-company-8',
    name: 'Vodacom Congo S.A.',
    email: 'stage@vodacom.cd',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-05-05T12:00:00Z'
  },
  {
    id: 'user-company-9',
    name: 'Orange RDC S.A.',
    email: 'careers@orange.cd',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-05-10T14:00:00Z'
  },
  {
    id: 'user-company-techcorp',
    name: 'TechCorp Solutions',
    email: 'recrutement@techcorp.com',
    role: RoleType.COMPANY,
    status: 'active',
    createdAt: '2026-01-15T12:00:00Z'
  }
];

const INITIAL_STUDENTS = [
  {
    id: 'student-profile-1',
    userId: 'user-student-1',
    name: 'Sarah El Amrani',
    email: 'sarah.student@example.com',
    phone: '+243 997 123 456',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    cvName: 'Sarah_El_Amrani_CV.pdf',
    cvUrl: '#',
    coverLetter: 'Étudiante en Polytechnique à l\'Université de Lubumbashi (UNILU), je recherche un stage de fin de cycle de 3 à 6 mois en électromécanique, automatisme ou systèmes d\'information.',
    bio: 'Passionnée de modélisation mécanique, automatique industrielle et développement informatique. Dynamique, rigoureuse et ancrée dans le Haut-Katanga.',
    skills: ['Électromécanique', 'Systèmes Automatisés', 'Rapports techniques', 'Python', 'Siemens PLC', 'SQL'],
    education: 'Faculté Polytechnique - Électromécanique - Université de Lubumbashi (UNILU)',
    favoriteInternships: ['internship-2']
  }
];

const INITIAL_COMPANIES = [
  {
    id: 'company-profile-1',
    userId: 'user-company-1',
    name: 'Gécamines S.A.',
    email: 'recrutement@gecamines.cd',
    logoUrl: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?auto=format&fit=crop&w=150&q=80',
    sector: 'Exploitation Minière, Électricité & Industrie',
    address: 'Boulevard Kamanyola, BP 450, Lubumbashi (Haut-Katanga)',
    contactName: 'M. Christian Kabange',
    contactEmail: 'c.kabange@gecamines.cd',
    contactPhone: '+243 812 345 678',
    description: 'La Générale des Carrières et des Mines (Gécamines S.A.) est le pilier public historique de l\'exploitation de cuivre et de cobalt en RDC, basée à Lubumbashi.'
  },
  {
    id: 'company-profile-2',
    userId: 'user-company-2',
    name: 'Ruashi Mining',
    email: 'careers@ruashimining.com',
    logoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&q=80',
    sector: 'Mines & Métallurgie',
    address: 'Avenue de la Ruashi, Commune Ruashi, Lubumbashi (Haut-Katanga)',
    contactName: 'Mme Nathalie Ngoy',
    contactEmail: 'n.ngoy@ruashimining.com',
    contactPhone: '+243 825 567 890',
    description: 'Ruashi Mining produit du cuivre raffiné de haute qualité et de l\'hydroxyde de cobalt. Une référence d\'excellence industrielle et de formation dans le Katanga.'
  },
  {
    id: 'company-profile-3',
    userId: 'user-company-3',
    name: 'Trust Merchant Bank (TMB)',
    email: 'rh@tmb.cd',
    logoUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=150&q=80',
    sector: 'Banque & Services Financiers',
    address: '1222 Avenue de l\'Équateur, Lubumbashi (Haut-Katanga)',
    contactName: 'M. Patrick Shimba',
    contactEmail: 'p.shimba@tmb.cd',
    contactPhone: '+243 998 765 432',
    description: 'La Trust Merchant Bank (TMB) est la banque leader de confiance en RDC, engagée pour l\'innovation des technologies mobiles "Pepele Mobile".'
  },
  {
    id: 'company-profile-4',
    userId: 'user-company-4',
    name: 'Tenke Fungurume Mining (TFM)',
    email: 'hr@tfm.cd',
    logoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=150&q=80',
    sector: 'Géologie, Mines & Hydrométallurgie',
    address: 'Route Nationale 39, Fungurume (Lualaba / Grand Katanga)',
    contactName: 'M. Olivier Ilunga',
    contactEmail: 'o.ilunga@tfm.cd',
    contactPhone: '+243 819 876 543',
    description: 'TFM est l\'un des plus grands producteurs mondiaux de cuivre et de cobalt, offrant des opportunités de stage inégalées en traitement minier et géo-ingénierie.'
  },
  {
    id: 'company-profile-5',
    userId: 'user-company-5',
    name: 'Kamoa Copper S.A.',
    email: 'recruitment@kamoacopper.cd',
    logoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=150&q=80',
    sector: 'Exploitation Souterraine & Traitement de Minerais',
    address: 'Région de Kolwezi, Commune de Dilolo (Lualaba / Grand Katanga)',
    contactName: 'Mme Charlyne Kanybo',
    contactEmail: 'c.kanybo@kamoacopper.cd',
    contactPhone: '+243 995 112 233',
    description: 'Kamoa Copper est le projet d\'extraction minière verte à la plus forte expansion globale, opérant l\'une des mines souterraines de cuivre à plus haute teneur au monde.'
  },
  {
    id: 'company-profile-6',
    userId: 'user-company-6',
    name: 'Société Nationale d\'Électricité (SNEL)',
    email: 'stages@snel.cd',
    logoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=150&q=80',
    sector: 'Génie Électrique, Énergétique & Dispatching',
    address: 'Complexe Centrale Inga, Lubumbashi (Haut-Katanga)',
    contactName: 'M. Robert Katondo',
    contactEmail: 'r.katondo@snel.cd',
    contactPhone: '+243 813 445 566',
    description: 'La SNEL est le distributeur d\'électricité étatique de la RDC, gérant le transport de l\'énergie depuis Inga jusqu\'aux réseaux industriels katangais.'
  },
  {
    id: 'company-profile-7',
    userId: 'user-company-7',
    name: 'Rawbank S.A.',
    email: 'recruit@rawbank.cd',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
    sector: 'Fintech, Base de Données & Informatique financière',
    address: 'Avenue Allées Vertes, Lubumbashi (Haut-Katanga)',
    contactName: 'Mme Sarah Mwamba',
    contactEmail: 's.mwamba@rawbank.cd',
    contactPhone: '+243 821 112 234',
    description: 'Première institution bancaire de la République Démocratique du Congo, Rawbank soutient l\'insertion professionnelle de la jeunesse à travers des stages d\'excellence technologique.'
  },
  {
    id: 'company-profile-8',
    userId: 'user-company-8',
    name: 'Vodacom Congo S.A.',
    email: 'stage@vodacom.cd',
    logoUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=150&q=80',
    sector: 'Télécommunications, Réseaux & IA',
    address: 'Boulevard du 30 Juin, Kinshasa / Direction Régionale Haut-Katanga, Lubumbashi (Haut-Katanga)',
    contactName: 'Mme Linda Kalunga',
    contactEmail: 'l.kalunga@vodacom.cd',
    contactPhone: '+243 811 000 123',
    description: 'Leader de la technologie cellulaire 4G/5G en RDC, Vodacom Congo propose des programmes de stages de haut vol axés sur l\'optimisation de fréquences et le Big Data.'
  },
  {
    id: 'company-profile-9',
    userId: 'user-company-9',
    name: 'Orange RDC S.A.',
    email: 'careers@orange.cd',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80',
    sector: 'Réseaux informatiques, Sécurité & Cloud',
    address: 'Avenue de la Révolution, Lubumbashi (Haut-Katanga)',
    contactName: 'M. Patrick Ngosa',
    contactEmail: 'p.ngosa@orange.cd',
    contactPhone: '+243 898 900 850',
    description: 'Acteur majeur de l\'écosystème numérique en RDC, Orange accélère le déploiement du Très Haut Débit et de la fibre optique dans les pôles miniers.'
  },
  {
    id: 'company-profile-techcorp',
    userId: 'user-company-techcorp',
    name: 'TechCorp Solutions',
    email: 'recrutement@techcorp.com',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
    sector: 'Technologies de l\'Information, Informatique & Services',
    address: 'Boulevard du 30 Juin, Immeuble Onatra, Kinshasa',
    contactName: 'Mme Jeanne Dupond',
    contactEmail: 'j.dupond@techcorp.com',
    contactPhone: '+243 812 345 999',
    description: 'TechCorp Solutions est une entreprise de premier plan spécialisée dans la transformation numérique, le développement de logiciels sur mesure et le conseil en technologies innovantes en RDC.'
  }
];

const INITIAL_INTERNSHIPS = [
  {
    id: 'internship-1',
    companyId: 'company-profile-1',
    companyName: 'Gécamines S.A.',
    companyLogo: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?auto=format&fit=crop&w=150&q=80',
    title: 'Stagiaire en Maintenance Électromécanique - Concentrateur',
    description: 'Rattaché à l\'équipe de maintenance du Concentrateur de Kipushi/Lubumbashi, vous participerez activement au suivi des pompes centrifuges, au calibrage des broyeurs à boulets et à la maintenance préventive des convoyeurs à bande. Vos missions : diagnostic de pannes hydrauliques et électriques.',
    city: 'Lubumbashi (Kipushi)',
    duration: '3 mois',
    remuneration: '250 $ / mois',
    deadline: '2026-08-15',
    skillsRequired: ['Hydro-pneumatique', 'Électromécanique', 'Lecture de plans', 'Sécurité industrielle'],
    status: 'published',
    createdAt: '2026-05-01T09:00:00Z'
  },
  {
    id: 'internship-2',
    companyId: 'company-profile-3',
    companyName: 'Trust Merchant Bank (TMB)',
    companyLogo: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=150&q=80',
    title: 'Développeur d\'Applications & Fintech Junior',
    description: 'Rejoignez notre Direction informatique à Lubumbashi pour concevoir des composants web réactifs intégrés à nos services d\'inclusion bancaire Pepele Mobile. Établissement de diagnostics d\'API et optimisation SQL.',
    city: 'Lubumbashi (Centre-ville)',
    duration: '6 mois',
    remuneration: '350 $ / mois',
    deadline: '2026-07-30',
    skillsRequired: ['TypeScript', 'React', 'REST API', 'PostgreSQL', 'Git'],
    status: 'published',
    createdAt: '2026-05-10T14:30:00Z'
  },
  {
    id: 'internship-3',
    companyId: 'company-profile-2',
    companyName: 'Ruashi Mining',
    companyLogo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&q=80',
    title: 'Stagiaire Métallurgiste en Optimisation d\'Électrolyse',
    description: 'Intégrant notre laboratoire métallurgique à Ruashi, vous travaillerez sur l\'optimisation du rendement d\'extraction par solvant (SX) et d\'electro-obtention (EW) du cuivre de l\'usine. Bilans de masse et rapports quotidiens.',
    city: 'Lubumbashi (Ruashi)',
    duration: '6 mois',
    remuneration: '300 $ / mois',
    deadline: '2026-09-01',
    skillsRequired: ['Métallurgie extractive', 'Chimie minérale', 'Excel avancé', 'Rigueur'],
    status: 'published',
    createdAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'internship-4',
    companyId: 'company-profile-1',
    companyName: 'Gécamines S.A.',
    companyLogo: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?auto=format&fit=crop&w=150&q=80',
    title: 'Stagiaire en Génie Électrique & Supervision SCADA',
    description: 'Support de l\'enginerie réseaux à Likasi, vous aiderez à configurer et superviser la télémétrie des sous-stations de dispatching de l\'énergie électrique critique vers nos concentrateurs.',
    city: 'Likasi (Haut-Katanga)',
    duration: '4 mois',
    remuneration: '200 $ / mois',
    deadline: '2026-07-15',
    skillsRequired: ['Automates Programmables', 'SCADA', 'Sous-stations MT/HT'],
    status: 'pending',
    createdAt: '2026-06-15T15:00:00Z'
  },
  {
    id: 'internship-5',
    companyId: 'company-profile-4',
    companyName: 'Tenke Fungurume Mining (TFM)',
    companyLogo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=150&q=80',
    title: 'Stagiaire en Cartographie Géologique & SIG',
    description: 'Au sein du département Planification Géologique, vous serez chargé de la mise à jour de la base de données de sondages carottés, de la digitalisation des cartes géologiques de surface et de l\'interprétation des structures minérales par outil SIG (ArcGIS/Surpac).',
    city: 'Fungurume (Lualaba)',
    duration: '6 mois',
    remuneration: '450 $ / mois',
    deadline: '2026-09-15',
    skillsRequired: ['ArcGIS', 'Surpac', 'Géologie structurale', 'Autonomie'],
    status: 'published',
    createdAt: '2026-06-18T11:00:00Z'
  },
  {
    id: 'internship-6',
    companyId: 'company-profile-5',
    companyName: 'Kamoa Copper S.A.',
    companyLogo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=150&q=80',
    title: 'Stagiaire ingénieur en Automatisation de Procédés Industriels',
    description: 'Sous la direction du Lead Engineer du concentrateur ultra-moderne de Kamoa, vous participerez au calibrage de l\'instrumentation, à la maintenance des API Siemens S7 et à l\'adaptation des interfaces IHM pour optimiser le taux de récupération du Cuivre.',
    city: 'Kolwezi (Lualaba)',
    duration: '6 mois',
    remuneration: '500 $ / mois',
    deadline: '2026-08-30',
    skillsRequired: ['Siemens S7', 'TIA Portal', 'Régulation PID', 'Instrumentation'],
    status: 'published',
    createdAt: '2026-06-19T08:00:00Z'
  },
  {
    id: 'internship-7',
    companyId: 'company-profile-6',
    companyName: 'Société Nationale d\'Électricité (SNEL)',
    companyLogo: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=150&q=80',
    title: 'Stage d\'Étude - Analyse de Stabilité de la Ligne Inga-Katanga',
    description: 'Rattaché à la Direction d\'Exploitation Katanga, vous analyserez les surtensions transitoires et modéliserez les plans de charge industriels pour prévenir les délestages intempestifs sur les boucles de distribution du secteur minier.',
    city: 'Lubumbashi (Haut-Katanga)',
    duration: '3 mois',
    remuneration: '300 $ / mois',
    deadline: '2026-10-10',
    skillsRequired: ['Simulation électrique', 'MATLAB', 'Réseaux de transport MT/HT'],
    status: 'published',
    createdAt: '2026-06-19T10:00:00Z'
  },
  {
    id: 'internship-8',
    companyId: 'company-profile-8',
    companyName: 'Vodacom Congo S.A.',
    companyLogo: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=150&q=80',
    title: 'Junior Network Opti Analyst (Stage)',
    description: 'Participez à l\'évaluation de la qualité de service (QoS) radio pour la région du Katanga, à l\'analyse des indicateurs de perte de paquets et à l\'assistance de déploiement de micro-cellulaires d\'intérieur (Femtocells).',
    city: 'Lubumbashi (Haut-Katanga)',
    duration: '6 mois',
    remuneration: '400 $ / mois',
    deadline: '2026-08-20',
    skillsRequired: ['Protocoles LTE/5G', 'Wireshark', 'Python', 'Analyse IP'],
    status: 'published',
    createdAt: '2026-06-20T10:00:00Z'
  },
  {
    id: 'internship-techcorp-1',
    companyId: 'company-profile-techcorp',
    companyName: 'TechCorp Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
    title: 'Stagiaire Développeur Master Full-Stack (React & Node.js)',
    description: 'Au sein de l\'équipe technique de TechCorp à Kinshasa, vous participerez au développement d\'applications de gestion logistique et commerciale en concevant des API Rest robustes et des interfaces utilisateur modernes.',
    city: 'Kinshasa (Gombe)',
    duration: '6 mois',
    remuneration: '400 $ / mois',
    deadline: '2026-09-01',
    skillsRequired: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'SQL'],
    status: 'published',
    createdAt: '2026-06-18T10:00:00Z'
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    internshipId: 'internship-1',
    internshipTitle: 'Stagiaire en Maintenance Électromécanique - Concentrateur',
    companyName: 'Gécamines S.A.',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    studentEmail: 'sarah.student@example.com',
    cvName: 'Sarah_El_Amrani_CV.pdf',
    cvUrl: '#',
    coverLetter: 'Étudiante en Faculté Polytechnique à Lubumbashi, je souhaite intégrer la division maintenance mécanique de la Gécamines de Kipushi pour allier théorie et rigoureuse pratique industrielle.',
    status: ApplicationStatus.ACCEPTED,
    createdAt: '2026-06-05T14:00:00Z'
  },
  {
    id: 'app-techcorp-1',
    internshipId: 'internship-techcorp-1',
    internshipTitle: 'Stagiaire Développeur Master Full-Stack (React & Node.js)',
    companyName: 'TechCorp Solutions',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    studentEmail: 'sarah.student@example.com',
    cvName: 'Sarah_El_Amrani_CV.pdf',
    cvUrl: '#',
    coverLetter: 'Passionnée de technologies web réactives et habitant Kinshasa, j\'aimerais collaborer étroitement avec les ingénieurs d\'élite de TechCorp pour concevoir des outils d\'automatisation de données à fort impact local.',
    status: ApplicationStatus.PENDING,
    createdAt: '2026-06-19T14:00:00Z'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user-admin-1',
    title: 'Nouveau stage en attente de validation',
    message: 'L\'entreprise Gécamines S.A. a publié une offre "Stagiaire en Génie Électrique & Supervision SCADA" nécessitant votre approbation.',
    read: false,
    createdAt: '2026-06-15T15:02:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Candidature Acceptée 🎉',
    message: 'Félicitations ! Votre candidature pour l\'offre "Stagiaire en Maintenance Électromécanique" a été acceptée par la Gécamines S.A. Votre note d\'acceptation est disponible.',
    read: false,
    createdAt: '2026-06-06T09:00:00Z'
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    userId: 'user-admin-1',
    userName: 'Jean Renaud (Admin)',
    action: 'CONNEXION',
    details: 'Connexion réussie au panneau d\'administration académique de l\'Université',
    ipAddress: '192.168.1.50',
    createdAt: '2026-06-18T08:30:00Z'
  },
  {
    id: 'log-2',
    userId: 'user-company-1',
    userName: 'Gécamines S.A.',
    action: 'OFFRE_CREEE',
    details: 'Création de l\'offre "Stagiaire en Maintenance Électromécanique - Concentrateur"',
    ipAddress: '10.0.4.15',
    createdAt: '2026-05-01T09:00:00Z'
  }
];

const INITIAL_DAILY_REPORTS = [
  {
    id: 'report-1',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    date: '2026-06-15',
    activity: 'Prise de contact avec mon maître de stage M. Christian Kabange à l\'usine de Kipushi. Séance d\'induction générale sur les consignes de sécurité, équipement en EPI de protection lourde et visite de la salle de contrôle.',
    hoursWorked: 8,
    status: 'validated',
    adminComment: 'Très bien. C\'est crucial de prioriser la sécurité dès le début.',
    createdAt: '2026-06-15T16:00:00Z'
  },
  {
    id: 'report-2',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    date: '2026-06-16',
    activity: 'Observation active de l\'arrêt programmé du Broyeur n°2. Participation au contrôle de l\'usure des blindages intérieurs en acier au manganèse et examen visuel des paliers de palonnier.',
    hoursWorked: 8,
    status: 'validated',
    adminComment: 'Sujet techniquement très enrichissant pour votre cursus polytechnique !',
    createdAt: '2026-06-16T17:00:00Z'
  },
  {
    id: 'report-3',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    date: '2026-06-17',
    activity: 'Remplacement d\'un flexible hydraulique défectueux sur la station d\'excitation de la motopompe principale. Aide à la purge d\'air et tests de mise sous pression.',
    hoursWorked: 8,
    status: 'pending',
    createdAt: '2026-06-17T16:30:00Z'
  }
];

const INITIAL_GRADES = [
  {
    id: 'grade-1',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    subject: 'Assiduité & Aptitudes Pratiques',
    grade: 18,
    maxGrade: 20,
    gradedBy: 'M. Christian Kabange (Gécamines)',
    comment: 'Excellente discipline d\'ingénieur, fort intérêt technique et respect absolu des consignes de sécurité.',
    createdAt: '2026-06-10T11:00:00Z'
  },
  {
    id: 'grade-2',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    subject: 'Rapports Journaliers de Stage',
    grade: 17,
    maxGrade: 20,
    gradedBy: 'Secrétariat Supérieur Académique (Admin)',
    comment: 'Les rapports de chantiers sont denses, réguliers et illustrent une brillante intégration théorique.',
    createdAt: '2026-06-15T15:00:00Z'
  },
  {
    id: 'grade-3',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    subject: 'Rapport de mi-parcours académique',
    grade: 16,
    maxGrade: 20,
    gradedBy: 'Doyen Polytechnique (Admin)',
    comment: 'Sujet d\'ingénierie sur l\'hydraulique de Kipushi très stimulant. Continuez ainsi.',
    createdAt: '2026-06-18T09:00:00Z'
  }
];

const INITIAL_ACCEPTANCE = [
  {
    id: 'accept-1',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    companyName: 'Gécamines S.A.',
    internshipTitle: 'Stagiaire en Maintenance Électromécanique - Concentrateur',
    status: 'approved',
    documentUrl: '#telecharge-acceptation',
    issueDate: '2026-06-03',
    receivedAt: '2026-06-03T10:00:00Z'
  }
];

const INITIAL_ATTENDANCE = [
  {
    id: 'attendance-1',
    studentId: 'student-profile-1',
    studentName: 'Sarah El Amrani',
    companyId: 'company-profile-1',
    supervisorId: 'user-supervisor-demo-1',
    date: '2026-06-18',
    arrivalTime: '08:00',
    departureTime: '16:00',
    status: 'validee',
    comment: 'Presence validee lors de la visite atelier.',
    reviewedBy: 'user-supervisor-demo-1',
    createdAt: '2026-06-18T16:05:00Z'
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'conversation-1',
    companyId: 'company-profile-1',
    studentId: 'student-profile-1',
    supervisorId: 'user-supervisor-demo-1',
    subject: 'Suivi du stage',
    createdAt: '2026-06-18T09:00:00Z',
    updatedAt: '2026-06-18T09:15:00Z'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'message-1',
    conversationId: 'conversation-1',
    senderId: 'user-supervisor-demo-1',
    senderRole: 'SUPERVISOR',
    body: 'Bienvenue Sarah. Deposez votre rapport quotidien avant la fin de chaque journee.',
    createdAt: '2026-06-18T09:15:00Z'
  }
];

const INITIAL_ARCHIVES = [];

export const seedData = {
  users: INITIAL_USERS,
  students: INITIAL_STUDENTS,
  companies: INITIAL_COMPANIES,
  internships: INITIAL_INTERNSHIPS,
  applications: INITIAL_APPLICATIONS,
  notifications: INITIAL_NOTIFICATIONS,
  auditLogs: INITIAL_AUDIT_LOGS,
  dailyReports: INITIAL_DAILY_REPORTS,
  studentGrades: INITIAL_GRADES,
  studentAcceptances: INITIAL_ACCEPTANCE,
  attendanceRecords: INITIAL_ATTENDANCE,
  conversations: INITIAL_CONVERSATIONS,
  messages: INITIAL_MESSAGES,
  archives: INITIAL_ARCHIVES
};
