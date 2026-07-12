import { 
  User, 
  RoleType, 
  StudentProfile, 
  CompanyProfile, 
  Internship, 
  Application, 
  ApplicationStatus, 
  Notification, 
  AuditLog,
  DailyReport,
  StudentGrade,
  StudentAcceptance,
  AttendanceRecord,
  Conversation,
  Message,
  ArchiveRecord
} from '../types';

const USERS_KEY = 'internship_users';
const STUDENTS_KEY = 'internship_students';
const COMPANIES_KEY = 'internship_companies';
const INTERNSHIPS_KEY = 'internship_internships';
const APPLICATIONS_KEY = 'internship_applications';
const NOTIFICATIONS_KEY = 'internship_notifications';
const AUDIT_LOGS_KEY = 'internship_audit_logs';
const REPORTS_KEY = 'internship_daily_reports';
const GRADES_KEY = 'internship_student_grades';
const ACCEPTANCE_KEY = 'internship_student_acceptance';
const ATTENDANCE_KEY = 'internship_attendance_records';
const CONVERSATIONS_KEY = 'internship_conversations';
const MESSAGES_KEY = 'internship_messages';
const ARCHIVES_KEY = 'internship_archives';

const INITIAL_USERS: User[] = [
  {
    id: 'user-supervisor-demo-1',
    name: 'M. Christian Kabange (Superviseur démo)',
    email: 'supervisor.demo@gecamines.cd',
    role: RoleType.SUPERVISOR,
    status: 'active',
    createdAt: '2026-06-01T09:00:00Z',
    companyId: 'company-profile-1'
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

const INITIAL_STUDENTS: StudentProfile[] = [
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

const INITIAL_COMPANIES: CompanyProfile[] = [
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

const INITIAL_INTERNSHIPS: Internship[] = [
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

const INITIAL_APPLICATIONS: Application[] = [
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

const INITIAL_NOTIFICATIONS: Notification[] = [
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

const INITIAL_AUDIT_LOGS: AuditLog[] = [
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

const INITIAL_DAILY_REPORTS: DailyReport[] = [
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

const INITIAL_GRADES: StudentGrade[] = [
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

const INITIAL_ACCEPTANCE: StudentAcceptance[] = [
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

const DEFAULT_DEPARTMENTS = [
  { id: 'dept-informatique', name: 'Informatique', description: 'Applications, support, donnees et outils numeriques.' },
  { id: 'dept-rh', name: 'Ressources humaines', description: 'Administration du personnel et recrutement.' },
  { id: 'dept-finance', name: 'Finance', description: 'Tresorerie, audit, budget et controle.' },
  { id: 'dept-maintenance', name: 'Maintenance', description: 'Maintenance industrielle, reseaux et equipements.' },
  { id: 'dept-communication', name: 'Communication', description: 'Communication interne, marketing et relations publiques.' }
];

const DEFAULT_SKILLS = ['React', 'Node.js', 'Excel avance', 'Maintenance', 'Communication', 'Analyse de donnees'];
const DEFAULT_SPECIALTIES = ['Genie logiciel', 'Reseaux informatiques', 'Finance', 'Comptabilite', 'Electromecanique', 'Marketing'];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
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

const INITIAL_CONVERSATIONS: Conversation[] = [
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

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'message-1',
    conversationId: 'conversation-1',
    senderId: 'user-supervisor-demo-1',
    senderRole: RoleType.SUPERVISOR,
    body: 'Bienvenue Sarah. Deposez votre rapport quotidien avant la fin de chaque journee.',
    createdAt: '2026-06-18T09:15:00Z'
  }
];

const INITIAL_ARCHIVES: ArchiveRecord[] = [];

const statusAliases: Record<string, ApplicationStatus> = {
  'En attente': ApplicationStatus.PENDING,
  'AcceptÃ©e': ApplicationStatus.ACCEPTED,
  'Acceptée': ApplicationStatus.ACCEPTED,
  'RefusÃ©e': ApplicationStatus.REJECTED,
  'Refusée': ApplicationStatus.REJECTED,
  'Entretien programmÃ©': ApplicationStatus.INTERVIEW,
  'Entretien programmé': ApplicationStatus.INTERVIEW,
  pending: ApplicationStatus.PENDING,
  accepted: ApplicationStatus.ACCEPTED,
  rejected: ApplicationStatus.REJECTED,
  interview: ApplicationStatus.INTERVIEW
};

function normalizeApplicationStatus(status: any): ApplicationStatus {
  if (Object.values(ApplicationStatus).includes(status)) return status;
  return statusAliases[String(status)] || ApplicationStatus.PENDING;
}

function hashPassword(password?: string) {
  if (!password) return undefined;
  try {
    return `local:${btoa(unescape(encodeURIComponent(password)))}`;
  } catch {
    return `local:${password.length}`;
  }
}

function parseList(value?: string | string[]) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function defaultDepartmentsForCompany(companyId: string) {
  return DEFAULT_DEPARTMENTS.map((dept, index) => ({
    ...dept,
    id: `${companyId}-${dept.id}-${index}`
  }));
}

function parseStored<T>(key: string, fallback: T[]): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return fallback;
  }
}

function normalizeUser(user: any): User {
  const role =
    user.role === 'student' ? RoleType.STUDENT :
    user.role === 'company' ? RoleType.COMPANY :
    user.role === 'supervisor' ? RoleType.SUPERVISOR :
    user.role === 'admin' ? RoleType.ADMIN :
    user.role;

  return {
    ...user,
    role,
    status: user.status || 'active',
    passwordHash: user.passwordHash,
    assignedStudentIds: role === RoleType.SUPERVISOR
      ? Array.from(new Set([...(user.assignedStudentIds || []), ...(user.id === 'user-supervisor-demo-1' ? ['student-profile-1'] : [])]))
      : user.assignedStudentIds
  };
}

function normalizeCompany(company: any): CompanyProfile {
  return {
    ...company,
    departments: company.departments?.length ? company.departments : defaultDepartmentsForCompany(company.id),
    requiredSkills: company.requiredSkills?.length ? company.requiredSkills : DEFAULT_SKILLS,
    acceptedSpecialties: company.acceptedSpecialties?.length ? company.acceptedSpecialties : DEFAULT_SPECIALTIES,
    eligibilityCriteria: company.eligibilityCriteria || 'Etre inscrit dans un etablissement reconnu, fournir un CV lisible et choisir un departement compatible.'
  };
}

function normalizeStudent(student: any): StudentProfile {
  const status = normalizeApplicationStatus(student.applicationStatus || student.status || ApplicationStatus.PENDING);
  return {
    ...student,
    university: student.university || 'Universite de Lubumbashi',
    faculty: student.faculty || 'Faculte Polytechnique',
    level: student.level || 'BAC 2',
    field: student.field || student.education || 'Electromecanique',
    specialty: student.specialty || 'Electromecanique',
    companyId: student.companyId || (student.id === 'student-profile-1' ? 'company-profile-1' : undefined),
    companyName: student.companyName || (student.id === 'student-profile-1' ? 'Gecamines S.A.' : undefined),
    departmentId: student.departmentId || (student.id === 'student-profile-1' ? 'company-profile-1-dept-maintenance-3' : undefined),
    departmentName: student.departmentName || (student.id === 'student-profile-1' ? 'Maintenance' : undefined),
    supervisorId: student.supervisorId || (student.id === 'student-profile-1' ? 'user-supervisor-demo-1' : undefined),
    applicationStatus: status,
    status,
    isArchived: Boolean(student.isArchived || status === ApplicationStatus.ARCHIVED),
    favoriteInternships: student.favoriteInternships || [],
    skills: student.skills || []
  };
}

function normalizeApplication(app: any): Application {
  const internship = INITIAL_INTERNSHIPS.find((item) => item.id === app.internshipId);
  const company = INITIAL_COMPANIES.find((item) => item.name === app.companyName || item.id === app.companyId);
  return {
    ...app,
    status: normalizeApplicationStatus(app.status),
    companyId: app.companyId || internship?.companyId || company?.id,
    targetCompanyNote: app.targetCompanyNote || `Cette candidature est dirigee vers ${app.companyName || company?.name || 'l entreprise choisie'}.`,
    departmentName: app.departmentName || 'Non precise',
    specialty: app.specialty || 'Non precise'
  };
}

function archiveExpiredStudentsInStorage() {
  const users = parseStored<User>(USERS_KEY, []).map(normalizeUser);
  const students = parseStored<StudentProfile>(STUDENTS_KEY, []).map(normalizeStudent);
  const applications = parseStored<Application>(APPLICATIONS_KEY, []).map(normalizeApplication);
  const archives = parseStored<ArchiveRecord>(ARCHIVES_KEY, []);
  const now = new Date();
  let changed = false;
  const archivedUserIds = new Set<string>();

  const updatedStudents = students.map((student) => {
    if (student.isArchived) return student;
    const rejectedExpired =
      student.status === ApplicationStatus.REJECTED &&
      student.rejectedAt &&
      now.getTime() - new Date(student.rejectedAt).getTime() >= 24 * 60 * 60 * 1000;
    const stageExpired =
      [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP, ApplicationStatus.COMPLETED].includes(student.status || ApplicationStatus.PENDING) &&
      (student.expiresAt || student.endDate) &&
      new Date(student.expiresAt || student.endDate || '').getTime() < now.getTime();

    if (!rejectedExpired && !stageExpired) return student;

    const archivedStudent = {
      ...student,
      status: ApplicationStatus.ARCHIVED,
      applicationStatus: stageExpired ? ApplicationStatus.COMPLETED : ApplicationStatus.REJECTED,
      supervisorId: stageExpired ? student.supervisorId : undefined,
      isArchived: true,
      archivedAt: new Date().toISOString()
    };

    if (!archives.some((archive) => archive.studentId === student.id)) {
      archives.unshift({
        id: `archive-${Date.now()}-${student.id}`,
        companyId: student.companyId,
        companyName: student.companyName,
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        status: archivedStudent.applicationStatus || ApplicationStatus.ARCHIVED,
        reason: rejectedExpired ? 'rejected' : 'expired',
        rejectionReason: student.rejectionReason,
        archivedAt: archivedStudent.archivedAt,
        snapshot: archivedStudent
      });
    }

    archivedUserIds.add(student.userId);
    changed = true;
    return archivedStudent;
  });

  const updatedApplications = applications.map((app) => {
    const student = updatedStudents.find((item) => item.id === app.studentId);
    if (!student?.isArchived || app.archivedAt) return app;
    return { ...app, archivedAt: student.archivedAt, status: student.applicationStatus || ApplicationStatus.ARCHIVED };
  });

  if (changed) {
    const updatedUsers = users
      .filter((user) => !archivedUserIds.has(user.id))
      .map((user) =>
        user.role === RoleType.SUPERVISOR
          ? { ...user, assignedStudentIds: (user.assignedStudentIds || []).filter((studentId) => !updatedStudents.some((student) => student.id === studentId && student.isArchived)) }
          : user
      );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(updatedStudents));
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updatedApplications));
    localStorage.setItem(ARCHIVES_KEY, JSON.stringify(archives));
  }
}



// Database initialization helper functions
export const mockDb = {
  initialize: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    } else {
      try {
        const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const storedUserIds = new Set(storedUsers.map((u: any) => u.id));
        const archivedStudentUserIds = new Set(
          parseStored<StudentProfile>(STUDENTS_KEY, [])
            .filter((student) => student.isArchived || student.status === ApplicationStatus.ARCHIVED)
            .map((student) => student.userId)
        );
        const missingUsers = INITIAL_USERS.filter(u => !storedUserIds.has(u.id) && !archivedStudentUserIds.has(u.id));
        if (missingUsers.length > 0) {
          localStorage.setItem(USERS_KEY, JSON.stringify([...storedUsers, ...missingUsers]));
        }
      } catch (e) {
        console.error('Error migrating users:', e);
      }
    }
    if (!localStorage.getItem(STUDENTS_KEY)) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(COMPANIES_KEY)) {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(INITIAL_COMPANIES));
    } else {
      try {
        const storedCompanies = JSON.parse(localStorage.getItem(COMPANIES_KEY) || '[]');
        const storedIds = new Set(storedCompanies.map((c: any) => c.id));
        const missingCompanies = INITIAL_COMPANIES.filter(c => !storedIds.has(c.id));
        if (missingCompanies.length > 0) {
          localStorage.setItem(COMPANIES_KEY, JSON.stringify([...storedCompanies, ...missingCompanies]));
        }
      } catch (e) {
        console.error('Error migrating companies:', e);
      }
    }
    if (!localStorage.getItem(INTERNSHIPS_KEY)) {
      localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(INITIAL_INTERNSHIPS));
    } else {
      // Migrate existing local storage from Euro to Dollar & merge missing records
      let raw = localStorage.getItem(INTERNSHIPS_KEY) || '[]';
      if (raw.includes('€')) {
        raw = raw.replace(/€/g, '$');
      }
      try {
        const storedInternships = JSON.parse(raw);
        const storedIds = new Set(storedInternships.map((i: any) => i.id));
        const missingInternships = INITIAL_INTERNSHIPS.filter(i => !storedIds.has(i.id));
        if (missingInternships.length > 0) {
          localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify([...storedInternships, ...missingInternships]));
        } else {
          localStorage.setItem(INTERNSHIPS_KEY, raw);
        }
      } catch (e) {
        console.error('Error migrating internships:', e);
        localStorage.setItem(INTERNSHIPS_KEY, raw);
      }
    }
    if (!localStorage.getItem(APPLICATIONS_KEY)) {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(AUDIT_LOGS_KEY)) {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(REPORTS_KEY)) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_DAILY_REPORTS));
    }
    if (!localStorage.getItem(GRADES_KEY)) {
      localStorage.setItem(GRADES_KEY, JSON.stringify(INITIAL_GRADES));
    }
    if (!localStorage.getItem(ACCEPTANCE_KEY)) {
      localStorage.setItem(ACCEPTANCE_KEY, JSON.stringify(INITIAL_ACCEPTANCE));
    }
    if (!localStorage.getItem(ATTENDANCE_KEY)) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(INITIAL_ATTENDANCE));
    }
    if (!localStorage.getItem(CONVERSATIONS_KEY)) {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    }
    if (!localStorage.getItem(MESSAGES_KEY)) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem(ARCHIVES_KEY)) {
      localStorage.setItem(ARCHIVES_KEY, JSON.stringify(INITIAL_ARCHIVES));
    }
    mockDb.migrate();
  },

  migrate: () => {
    localStorage.setItem(USERS_KEY, JSON.stringify(parseStored<User>(USERS_KEY, INITIAL_USERS).map(normalizeUser)));
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(parseStored<CompanyProfile>(COMPANIES_KEY, INITIAL_COMPANIES).map(normalizeCompany)));
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(parseStored<StudentProfile>(STUDENTS_KEY, INITIAL_STUDENTS).map(normalizeStudent)));
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(parseStored<Application>(APPLICATIONS_KEY, INITIAL_APPLICATIONS).map(normalizeApplication)));
    archiveExpiredStudentsInStorage();
  },

  getUsers: (): User[] => {
    mockDb.initialize();
    return parseStored<User>(USERS_KEY, []).map(normalizeUser);
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getStudents: (): StudentProfile[] => {
    mockDb.initialize();
    return parseStored<StudentProfile>(STUDENTS_KEY, []).map(normalizeStudent);
  },

  saveStudents: (students: StudentProfile[]) => {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  },

  getCompanies: (): CompanyProfile[] => {
    mockDb.initialize();
    return parseStored<CompanyProfile>(COMPANIES_KEY, []).map(normalizeCompany);
  },

  saveCompanies: (companies: CompanyProfile[]) => {
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
  },

  getInternships: (): Internship[] => {
    mockDb.initialize();
    const raw = localStorage.getItem(INTERNSHIPS_KEY) || '[]';
    if (raw.includes('€')) {
      const migrated = raw.replace(/€/g, '$');
      localStorage.setItem(INTERNSHIPS_KEY, migrated);
      return JSON.parse(migrated);
    }
    return JSON.parse(raw);
  },

  saveInternships: (internships: Internship[]) => {
    localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(internships));
  },

  getApplications: (): Application[] => {
    mockDb.initialize();
    return parseStored<Application>(APPLICATIONS_KEY, []).map(normalizeApplication);
  },

  saveApplications: (applications: Application[]) => {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  },

  getNotifications: (): Notification[] => {
    mockDb.initialize();
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  },

  saveNotifications: (notifications: Notification[]) => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  },

  getDailyReports: (): DailyReport[] => {
    mockDb.initialize();
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
  },

  saveDailyReports: (reports: DailyReport[]) => {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  },

  getStudentGrades: (): StudentGrade[] => {
    mockDb.initialize();
    return JSON.parse(localStorage.getItem(GRADES_KEY) || '[]');
  },

  saveStudentGrades: (grades: StudentGrade[]) => {
    localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
  },

  getStudentAcceptance: (): StudentAcceptance[] => {
    mockDb.initialize();
    return JSON.parse(localStorage.getItem(ACCEPTANCE_KEY) || '[]');
  },

  saveStudentAcceptance: (acceptance: StudentAcceptance[]) => {
    localStorage.setItem(ACCEPTANCE_KEY, JSON.stringify(acceptance));
  },

  getAttendanceRecords: (): AttendanceRecord[] => {
    mockDb.initialize();
    return parseStored<AttendanceRecord>(ATTENDANCE_KEY, []);
  },

  saveAttendanceRecords: (attendance: AttendanceRecord[]) => {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
  },

  getConversations: (): Conversation[] => {
    mockDb.initialize();
    return parseStored<Conversation>(CONVERSATIONS_KEY, []);
  },

  saveConversations: (conversations: Conversation[]) => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  },

  getMessages: (): Message[] => {
    mockDb.initialize();
    return parseStored<Message>(MESSAGES_KEY, []);
  },

  saveMessages: (messages: Message[]) => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  },

  getArchives: (): ArchiveRecord[] => {
    mockDb.initialize();
    return parseStored<ArchiveRecord>(ARCHIVES_KEY, []);
  },

  saveArchives: (archives: ArchiveRecord[]) => {
    localStorage.setItem(ARCHIVES_KEY, JSON.stringify(archives));
  },

  getAuditLogs: (): AuditLog[] => {
    mockDb.initialize();
    return JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]');
  },

  addAuditLog: (userId: string, userName: string, action: string, details: string) => {
    const logs = mockDb.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId,
      userName,
      action,
      details,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
      createdAt: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  },


  exportSnapshot: () => ({
    users: mockDb.getUsers(),
    students: mockDb.getStudents(),
    companies: mockDb.getCompanies(),
    internships: mockDb.getInternships(),
    applications: mockDb.getApplications(),
    notifications: mockDb.getNotifications(),
    auditLogs: mockDb.getAuditLogs(),
    dailyReports: mockDb.getDailyReports(),
    studentGrades: mockDb.getStudentGrades(),
    studentAcceptances: mockDb.getStudentAcceptance(),
    attendanceRecords: mockDb.getAttendanceRecords(),
    conversations: mockDb.getConversations(),
    messages: mockDb.getMessages(),
    archives: mockDb.getArchives()
  }),

  importSnapshot: (snapshot: Partial<{
    users: User[];
    students: StudentProfile[];
    companies: CompanyProfile[];
    internships: Internship[];
    applications: Application[];
    notifications: Notification[];
    auditLogs: AuditLog[];
    dailyReports: DailyReport[];
    studentGrades: StudentGrade[];
    studentAcceptances: StudentAcceptance[];
    attendanceRecords: AttendanceRecord[];
    conversations: Conversation[];
    messages: Message[];
    archives: ArchiveRecord[];
  }>) => {
    if (snapshot.users) mockDb.saveUsers(snapshot.users);
    if (snapshot.students) mockDb.saveStudents(snapshot.students);
    if (snapshot.companies) mockDb.saveCompanies(snapshot.companies);
    if (snapshot.internships) mockDb.saveInternships(snapshot.internships);
    if (snapshot.applications) mockDb.saveApplications(snapshot.applications);
    if (snapshot.notifications) mockDb.saveNotifications(snapshot.notifications);
    if (snapshot.auditLogs) localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(snapshot.auditLogs));
    if (snapshot.dailyReports) mockDb.saveDailyReports(snapshot.dailyReports);
    if (snapshot.studentGrades) mockDb.saveStudentGrades(snapshot.studentGrades);
    if (snapshot.studentAcceptances) mockDb.saveStudentAcceptance(snapshot.studentAcceptances);
    if (snapshot.attendanceRecords) mockDb.saveAttendanceRecords(snapshot.attendanceRecords);
    if (snapshot.conversations) mockDb.saveConversations(snapshot.conversations);
    if (snapshot.messages) mockDb.saveMessages(snapshot.messages);
    if (snapshot.archives) mockDb.saveArchives(snapshot.archives);
    mockDb.migrate();
  },

  addNotification: (userId: string, title: string, message: string) => {
    const notifications = mockDb.getNotifications();
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(newNotification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }
};
