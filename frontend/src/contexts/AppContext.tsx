import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  Application,
  ApplicationStatus,
  ArchiveRecord,
  AttendanceRecord,
  AuditLog,
  CompanyProfile,
  Conversation,
  DailyReport,
  Department,
  Internship,
  Message,
  Notification,
  RoleType,
  StudentAcceptance,
  StudentGrade,
  StudentProfile,
  User
} from '../types';
import { mockDb } from '../services/mockDb';
import { apiClient } from '../services/apiClient';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ApplicationDecisionDetails {
  departmentId?: string;
  departmentName?: string;
  specialty?: string;
  supervisorId?: string;
  startDate?: string;
  endDate?: string;
  acceptanceNote?: string;
  interviewNote?: string;
  rejectionReason?: string;
}

interface SupervisorInput {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  position?: string;
  departmentId?: string;
  departmentName?: string;
  skills?: string[];
  assignedStudentIds?: string[];
}

interface AppContextType {
  currentUser: User | null;
  studentProfile: StudentProfile | null;
  companyProfile: CompanyProfile | null;
  users: User[];
  students: StudentProfile[];
  companies: CompanyProfile[];
  internships: Internship[];
  applications: Application[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  toasts: Toast[];
  dailyReports: DailyReport[];
  studentGrades: StudentGrade[];
  studentAcceptances: StudentAcceptance[];
  attendanceRecords: AttendanceRecord[];
  conversations: Conversation[];
  messages: Message[];
  archives: ArchiveRecord[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (email: string, role: RoleType, password?: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, role: RoleType, password?: string, details?: any) => Promise<boolean>;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  assignStudentToSupervisor: (supervisorId: string, studentId?: string) => void;
  createInternship: (internship: Omit<Internship, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'status' | 'createdAt'>) => void;
  updateInternship: (id: string, internship: Partial<Internship>) => void;
  validateInternship: (id: string, action: 'published' | 'rejected') => void;
  applyToInternship: (internshipId: string, cvName: string, coverLetter: string, details?: Partial<Application>) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string, details?: ApplicationDecisionDetails) => void;
  markNotificationAsRead: (id: string) => void;
  toggleFavoriteInternship: (id: string) => void;
  suspendUser: (id: string) => void;
  reactivateUser: (id: string) => void;
  createUserByAdmin: (user: Omit<User, 'id' | 'createdAt'>) => void;
  addDailyReport: (activity: string, date: string, hoursWorked: number, details?: Partial<DailyReport>) => void;
  updateDailyReportByAdmin: (id: string, updates: Partial<DailyReport>) => void;
  addStudentGrade: (studentId: string, studentName: string, subject: string, grade: number, comment?: string, details?: Partial<StudentGrade>) => void;
  updateStudentGrade: (id: string, updates: Partial<StudentGrade>) => void;
  updateAcceptanceStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  addPartnerCompanyByAdmin: (company: Omit<CompanyProfile, 'id'>) => void;
  updatePartnerCompanyByAdmin: (id: string, updates: Partial<CompanyProfile>) => void;
  deletePartnerCompanyByAdmin: (id: string) => void;
  withdrawCurrentCompany: () => void;
  createSupervisorAccount: (input: SupervisorInput | string, email?: string, password?: string, details?: Partial<SupervisorInput>) => void;
  updateSupervisorAccount: (id: string, updates: Partial<SupervisorInput>) => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'studentId' | 'studentName' | 'companyId' | 'supervisorId' | 'status' | 'createdAt'>) => void;
  reviewAttendanceRecord: (id: string, status: 'validee' | 'refusee', comment?: string) => void;
  sendMessage: (conversationId: string, body: string, attachmentName?: string) => void;
  getOrCreateConversation: (studentId: string, supervisorId: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'informatique', name: 'Informatique' },
  { id: 'ressources-humaines', name: 'Ressources humaines' },
  { id: 'finance', name: 'Finance' },
  { id: 'maintenance', name: 'Maintenance' },
  { id: 'communication', name: 'Communication' }
];

const DEFAULT_SPECIALTIES = ['Genie logiciel', 'Reseaux informatiques', 'Finance', 'Comptabilite', 'Electromecanique'];
const DEFAULT_SKILLS = ['React', 'Node.js', 'Excel avance', 'Communication', 'Maintenance', 'Analyse de donnees'];
let mongoSyncTimer: ReturnType<typeof setTimeout> | undefined;

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function hashPassword(password?: string) {
  if (!password) return undefined;
  try {
    return `local:${btoa(unescape(encodeURIComponent(password)))}`;
  } catch {
    return `local:${password.length}`;
  }
}

function passwordMatches(user: User, password?: string) {
  if (!password) return false;
  if (user.passwordHash) return user.passwordHash === hashPassword(password);
  return true;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isActiveStudent(student: StudentProfile) {
  return !student.isArchived && student.status !== ApplicationStatus.ARCHIVED;
}

function canStudentAccessWorkspace(student?: StudentProfile) {
  return Boolean(
    student &&
    !student.isArchived &&
    [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(student.status || ApplicationStatus.PENDING)
  );
}

function isOfficiallyAssignedToSupervisor(student: StudentProfile, supervisor?: User) {
  return Boolean(
    supervisor &&
    supervisor.role === RoleType.SUPERVISOR &&
    !student.isArchived &&
    [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(student.status || ApplicationStatus.PENDING) &&
    student.supervisorId === supervisor.id &&
    (supervisor.assignedStudentIds || []).includes(student.id)
  );
}

function splitCsv(value?: string | string[]) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCompanyDefaults(companyId: string) {
  return DEFAULT_DEPARTMENTS.map((department, index) => ({
    ...department,
    id: `${companyId}-${department.id}-${index}`
  }));
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [studentAcceptances, setStudentAcceptances] = useState<StudentAcceptance[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [archives, setArchives] = useState<ArchiveRecord[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const loadUserProfiles = (user: User | null) => {
    if (!user) {
      setStudentProfile(null);
      setCompanyProfile(null);
      return;
    }

    if (user.role === RoleType.STUDENT) {
      setStudentProfile(mockDb.getStudents().find((profile) => profile.userId === user.id) || null);
      setCompanyProfile(null);
      return;
    }

    if (user.role === RoleType.COMPANY) {
      setCompanyProfile(mockDb.getCompanies().find((profile) => profile.userId === user.id) || null);
      setStudentProfile(null);
      return;
    }

    setStudentProfile(null);
    setCompanyProfile(null);
  };

  const syncToMongo = () => {
    if (mongoSyncTimer) clearTimeout(mongoSyncTimer);
    mongoSyncTimer = setTimeout(() => {
      apiClient.saveSnapshot(mockDb.exportSnapshot()).catch(() => {
        // The UI remains local-first when the API or MongoDB is unavailable.
      });
    }, 350);
  };

  const loadAllData = (sync = false) => {
    mockDb.initialize();
    setUsers(mockDb.getUsers());
    setStudents(mockDb.getStudents());
    setCompanies(mockDb.getCompanies());
    setInternships(mockDb.getInternships());
    setApplications(mockDb.getApplications());
    setNotifications(mockDb.getNotifications());
    setAuditLogs(mockDb.getAuditLogs());
    setDailyReports(mockDb.getDailyReports());
    setStudentGrades(mockDb.getStudentGrades());
    setStudentAcceptances(mockDb.getStudentAcceptance());
    setAttendanceRecords(mockDb.getAttendanceRecords());
    setConversations(mockDb.getConversations());
    setMessages(mockDb.getMessages());
    setArchives(mockDb.getArchives());

    if (currentUser) {
      const refreshedUser = mockDb.getUsers().find((user) => user.id === currentUser.id);
      if (!refreshedUser) {
        setCurrentUser(null);
        setStudentProfile(null);
        setCompanyProfile(null);
        localStorage.removeItem('session_user');
        if (sync) syncToMongo();
        return;
      }
      setCurrentUser(refreshedUser);
      loadUserProfiles(refreshedUser);
    }

    if (sync) syncToMongo();
  };

  useEffect(() => {
    mockDb.initialize();
    loadAllData();
    localStorage.removeItem('session_user');

    apiClient.getSnapshot()
      .then((snapshot) => {
        if (snapshot?.users?.length) {
          mockDb.importSnapshot(snapshot);
          loadAllData();
        }
      })
      .catch(() => undefined);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = makeId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 4500);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  const login = async (email: string, role: RoleType, password?: string) => {
    const user = mockDb.getUsers().find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.role === role
    );

    if (!user) return false;
    if (!passwordMatches(user, password)) throw new Error('Mot de passe incorrect.');
    if (!user.passwordHash && password) {
      mockDb.saveUsers(mockDb.getUsers().map((candidate) =>
        candidate.id === user.id ? { ...candidate, passwordHash: hashPassword(password) } : candidate
      ));
      user.passwordHash = hashPassword(password);
    }
    if (user.status === 'suspended' && role !== RoleType.STUDENT) throw new Error('Votre compte est suspendu. Contactez votre entreprise.');
    if (user.status === 'archived') throw new Error('Ce compte est archive et ne peut plus acceder a la plateforme.');

    if (role === RoleType.STUDENT) {
      const profile = mockDb.getStudents().find((student) => student.userId === user.id);
      if (!profile || profile.isArchived) {
        throw new Error('Votre compte etudiant est archive ou introuvable.');
      }
      if (profile.status === ApplicationStatus.PENDING || profile.status === ApplicationStatus.INTERVIEW) {
        throw new Error('Votre demande est encore en attente de validation par l entreprise.');
      }
      if (profile.status === ApplicationStatus.REJECTED) {
        throw new Error('Votre demande a ete refusee. Votre dossier reste conserve dans les archives.');
      }
      if (!canStudentAccessWorkspace(profile)) {
        throw new Error('Votre compte etudiant doit etre accepte par une entreprise avant acces.');
      }
    }

    setCurrentUser(user);
    loadUserProfiles(user);
    mockDb.addAuditLog(user.id, user.name, 'CONNEXION', `Connexion reussie en tant que ${role}`);
    loadAllData(true);
    return true;
  };

  const logout = () => {
    if (currentUser) mockDb.addAuditLog(currentUser.id, currentUser.name, 'DECONNEXION', 'Deconnexion reussie');
    setCurrentUser(null);
    setStudentProfile(null);
    setCompanyProfile(null);
    localStorage.removeItem('session_user');
  };

  const register = async (name: string, email: string, role: RoleType, password?: string, details?: any) => {
    const metadata = typeof password === 'object' ? password : details || {};
    const rawPassword = typeof password === 'string' ? password : metadata?.password;

    if (!name.trim() || !email.trim() || !rawPassword) {
      throw new Error('Nom, email et mot de passe sont obligatoires.');
    }
    if (role === RoleType.ADMIN || role === RoleType.SUPERVISOR) {
      throw new Error('Ce type de compte ne peut pas etre cree depuis la partie publique.');
    }
    if (mockDb.getUsers().some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Cette adresse email est deja enregistree.');
    }

    const newUser: User = {
      id: makeId('user'),
      name,
      email,
      role,
      status: role === RoleType.STUDENT ? 'suspended' : 'active',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(rawPassword),
      companyId: metadata.companyId
    };

    mockDb.saveUsers([newUser, ...mockDb.getUsers()]);

    if (role === RoleType.COMPANY) {
      const newCompanyId = makeId('company');
      const newCompany: CompanyProfile = {
        id: newCompanyId,
        userId: newUser.id,
        name,
        email,
        logoUrl: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80`,
        sector: metadata.sector || 'Non specifie',
        address: metadata.address || 'Non specifie',
        contactName: name,
        contactEmail: email,
        contactPhone: metadata.phone || '',
        description: metadata.description || '',
        departments: buildCompanyDefaults(newCompanyId),
        requiredSkills: DEFAULT_SKILLS,
        acceptedSpecialties: DEFAULT_SPECIALTIES,
        eligibilityCriteria: 'CV lisible, specialite compatible et disponibilite pendant la duree du stage.'
      };
      mockDb.saveCompanies([newCompany, ...mockDb.getCompanies()]);
    }

    if (role === RoleType.STUDENT) {
      const company = mockDb.getCompanies().find((item) => item.id === metadata.companyId);
      if (!company) {
        mockDb.saveUsers(mockDb.getUsers().filter((user) => user.id !== newUser.id));
        throw new Error('Choisissez une entreprise avant de creer un compte etudiant.');
      }

      const department =
        company.departments?.find((item) => item.id === metadata.departmentId || item.name === metadata.departmentName) ||
        company.departments?.[0];
      const studentId = makeId('student');
      const newStudent: StudentProfile = {
        id: studentId,
        userId: newUser.id,
        name,
        email,
        phone: metadata.phone || '',
        avatarUrl: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80`,
        cvName: metadata.cvName || '',
        cvUrl: metadata.cvName ? '#' : '',
        coverLetter: metadata.coverLetter || '',
        bio: metadata.bio || '',
        skills: splitCsv(metadata.skills),
        education: metadata.education || [metadata.faculty, metadata.level, metadata.field].filter(Boolean).join(' - '),
        favoriteInternships: [],
        university: metadata.university || '',
        faculty: metadata.faculty || '',
        level: metadata.level || '',
        field: metadata.field || '',
        specialty: metadata.specialty || '',
        companyId: company.id,
        companyName: company.name,
        departmentId: department?.id,
        departmentName: department?.name || metadata.departmentName || '',
        applicationStatus: ApplicationStatus.PENDING,
        status: ApplicationStatus.PENDING,
        isArchived: false
      };
      mockDb.saveStudents([newStudent, ...mockDb.getStudents()]);

      const matchingInternship = mockDb.getInternships().find((item) => item.companyId === company.id && item.status === 'published');
      const newApplication: Application = {
        id: makeId('app'),
        internshipId: matchingInternship?.id || `direct-${company.id}`,
        internshipTitle: matchingInternship?.title || `Demande de stage - ${company.name}`,
        companyId: company.id,
        companyName: company.name,
        studentId,
        studentName: name,
        studentEmail: email,
        cvName: newStudent.cvName || 'CV a fournir',
        cvUrl: newStudent.cvUrl || '#',
        coverLetter: metadata.coverLetter || '',
        status: ApplicationStatus.PENDING,
        targetCompanyNote: `Demande de stage destinee a ${company.name}.`,
        departmentId: newStudent.departmentId,
        departmentName: newStudent.departmentName,
        specialty: newStudent.specialty,
        createdAt: new Date().toISOString()
      };
      mockDb.saveApplications([newApplication, ...mockDb.getApplications()]);
      mockDb.addNotification(
        company.userId,
        'Nouvelle demande de stage',
        `${name} a envoye une demande de stage destinee a ${company.name}.`
      );
      mockDb.getUsers()
        .filter((user) => user.role === RoleType.ADMIN)
        .forEach((admin) => mockDb.addNotification(
          admin.id,
          'Nouvelle demande de stage',
          `${name} a postule pour ${company.name}.`
        ));
    }

    mockDb.addAuditLog(newUser.id, newUser.name, 'INSCRIPTION', `Creation compte role: ${role}`);
    if (role === RoleType.COMPANY) {
      setCurrentUser(newUser);
      loadUserProfiles(newUser);
    } else {
      setCurrentUser(null);
      setStudentProfile(null);
      setCompanyProfile(null);
      localStorage.removeItem('session_user');
    }
    loadAllData(true);
    return true;
  };

  const updateStudentProfile = (update: Partial<StudentProfile>) => {
    if (!studentProfile || !currentUser) return;
    const updatedStudents = mockDb.getStudents().map((student) =>
      student.id === studentProfile.id ? { ...student, ...update } : student
    );
    mockDb.saveStudents(updatedStudents);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'PROFIL_ETUDIANT_MAJ', 'Mise a jour du profil etudiant');
    loadAllData(true);
    showToast('Profil etudiant mis a jour.', 'success');
  };

  const updateCompanyProfile = (update: Partial<CompanyProfile>) => {
    if (!currentUser) return;
    const existingCompany = companyProfile || mockDb.getCompanies().find((company) => company.userId === currentUser.id);
    if (!existingCompany) return;
    const updatedCompanies = mockDb.getCompanies().map((company) =>
      company.id === existingCompany.id ? { ...company, ...update } : company
    );
    mockDb.saveCompanies(updatedCompanies);
    if (update.logoUrl) {
      mockDb.saveInternships(mockDb.getInternships().map((internship) =>
        internship.companyId === existingCompany.id ? { ...internship, companyLogo: update.logoUrl || internship.companyLogo } : internship
      ));
    }
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'PROFIL_ENTREPRISE_MAJ', 'Mise a jour du profil entreprise');
    loadAllData(true);
    showToast('Profil entreprise mis a jour.', 'success');
  };

  const createInternship = (internshipData: Omit<Internship, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'status' | 'createdAt'>) => {
    if (!currentUser || currentUser.role !== RoleType.COMPANY || !companyProfile) return;
    const newInternship: Internship = {
      ...internshipData,
      id: makeId('internship'),
      companyId: companyProfile.id,
      companyName: companyProfile.name,
      companyLogo: companyProfile.logoUrl,
      status: 'published',
      createdAt: new Date().toISOString()
    };
    mockDb.saveInternships([newInternship, ...mockDb.getInternships()]);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'OFFRE_CREEE', `Creation offre de stage: ${newInternship.title}`);
    loadAllData(true);
    showToast('Offre de stage publiee.', 'success');
  };

  const updateInternship = (id: string, update: Partial<Internship>) => {
    if (!currentUser) return;
    const updated = mockDb.getInternships().map((internship) => internship.id === id ? { ...internship, ...update } : internship);
    mockDb.saveInternships(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'OFFRE_MAJ', `Modification offre #${id}`);
    loadAllData(true);
  };

  const validateInternship = (id: string, action: 'published' | 'rejected') => updateInternship(id, { status: action });

  const applyToInternship = (internshipId: string, cvName: string, coverLetter: string, details: Partial<Application> = {}) => {
    if (!currentUser || !studentProfile) return;
    const internship = mockDb.getInternships().find((item) => item.id === internshipId);
    if (!internship) return;
    if (mockDb.getApplications().some((app) => app.internshipId === internshipId && app.studentId === studentProfile.id)) {
      throw new Error('Vous avez deja postule a cette offre.');
    }
    const company = mockDb.getCompanies().find((item) => item.id === internship.companyId);
    const newApp: Application = {
      id: makeId('app'),
      internshipId,
      internshipTitle: internship.title,
      companyId: internship.companyId,
      companyName: internship.companyName,
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      studentEmail: studentProfile.email,
      cvName: cvName || studentProfile.cvName || 'CV a fournir',
      cvUrl: details.cvUrl || studentProfile.cvUrl || '#',
      coverLetter: coverLetter || studentProfile.coverLetter || '',
      status: ApplicationStatus.PENDING,
      targetCompanyNote: `Candidature destinee a ${internship.companyName} pour l'offre "${internship.title}".`,
      departmentId: details.departmentId || studentProfile.departmentId,
      departmentName: details.departmentName || studentProfile.departmentName,
      specialty: details.specialty || studentProfile.specialty,
      createdAt: new Date().toISOString()
    };
    mockDb.saveApplications([newApp, ...mockDb.getApplications()]);
    mockDb.saveStudents(mockDb.getStudents().map((student) =>
      student.id === studentProfile.id
        ? {
            ...student,
            companyId: internship.companyId,
            companyName: internship.companyName,
            applicationStatus: ApplicationStatus.PENDING,
            status: ApplicationStatus.PENDING,
            departmentId: newApp.departmentId,
            departmentName: newApp.departmentName,
            specialty: newApp.specialty
          }
        : student
    ));
    if (company) {
      mockDb.addNotification(
        company.userId,
        'Nouvelle candidature recue',
        `${studentProfile.name} a postule a "${internship.title}" chez ${internship.companyName}. Cette candidature est dirigee vers votre entreprise.`
      );
    }
    mockDb.getUsers()
      .filter((user) => user.role === RoleType.ADMIN)
      .forEach((admin) => mockDb.addNotification(
        admin.id,
        'Nouvelle candidature',
        `${studentProfile.name} a postule a "${internship.title}" chez ${internship.companyName}.`
      ));
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'CANDIDATURE_ENVOI', `Candidature envoyee pour ${internship.title}`);
    loadAllData(true);
    showToast('Candidature envoyee.', 'success');
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, notes = '', details: ApplicationDecisionDetails = {}) => {
    if (!currentUser) return;
    const apps = mockDb.getApplications();
    const app = apps.find((item) => item.id === id);
    if (!app) return;

    const nowIso = new Date().toISOString();
    const isRejected = status === ApplicationStatus.REJECTED;
    const isAccepted = [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(status);
    const startDate = details.startDate || app.startDate || new Date().toISOString().slice(0, 10);
    const endDate = details.endDate || app.endDate || addDays(new Date(startDate), 90).toISOString().slice(0, 10);
    const rejectedAt = isRejected ? nowIso : app.rejectedAt;
    const expiresAt =
      isRejected ? nowIso :
      isAccepted ? new Date(`${endDate}T23:59:59`).toISOString() :
      app.expiresAt;

    const updatedApp: Application = {
      ...app,
      status,
      notes,
      departmentId: details.departmentId || app.departmentId,
      departmentName: details.departmentName || app.departmentName,
      specialty: details.specialty || app.specialty,
      supervisorId: isRejected ? undefined : details.supervisorId || app.supervisorId,
      startDate: isAccepted ? startDate : app.startDate,
      endDate: isAccepted ? endDate : app.endDate,
      expiresAt,
      rejectedAt,
      interviewNote: status === ApplicationStatus.INTERVIEW ? details.interviewNote || notes : app.interviewNote,
      acceptanceNote: isAccepted ? details.acceptanceNote || notes : app.acceptanceNote,
      rejectionReason: isRejected ? details.rejectionReason || notes : app.rejectionReason,
      archivedAt: isRejected ? nowIso : app.archivedAt
    };
    mockDb.saveApplications(apps.map((item) => item.id === id ? updatedApp : item));

    const updatedStudents = mockDb.getStudents().map((student) =>
      student.id === app.studentId
        ? {
            ...student,
            applicationStatus: status,
            status: isRejected ? ApplicationStatus.ARCHIVED : status,
            companyId: updatedApp.companyId || student.companyId,
            companyName: updatedApp.companyName || student.companyName,
            departmentId: updatedApp.departmentId || student.departmentId,
            departmentName: updatedApp.departmentName || student.departmentName,
            specialty: updatedApp.specialty || student.specialty,
            supervisorId: isRejected ? undefined : updatedApp.supervisorId || student.supervisorId,
            startDate: updatedApp.startDate || student.startDate,
            endDate: updatedApp.endDate || student.endDate,
            expiresAt,
            rejectedAt,
            archivedAt: isRejected ? nowIso : student.archivedAt,
            isArchived: isRejected ? true : student.isArchived,
            acceptanceNote: updatedApp.acceptanceNote || student.acceptanceNote,
            interviewNote: updatedApp.interviewNote || student.interviewNote,
            rejectionReason: updatedApp.rejectionReason || student.rejectionReason
          }
        : student
    );
    mockDb.saveStudents(updatedStudents);

    if (isRejected) {
      const rejectedStudent = updatedStudents.find((student) => student.id === app.studentId);
      if (rejectedStudent) {
        const archives = mockDb.getArchives();
        const archiveRecord: ArchiveRecord = {
          id: archives.find((archive) => archive.studentId === rejectedStudent.id)?.id || makeId('archive'),
          companyId: rejectedStudent.companyId || updatedApp.companyId,
          companyName: rejectedStudent.companyName || updatedApp.companyName,
          studentId: rejectedStudent.id,
          studentName: rejectedStudent.name,
          studentEmail: rejectedStudent.email,
          status: ApplicationStatus.REJECTED,
          reason: 'rejected',
          rejectionReason: updatedApp.rejectionReason || notes,
          archivedAt: nowIso,
          snapshot: rejectedStudent
        };
        mockDb.saveArchives([archiveRecord, ...archives.filter((archive) => archive.studentId !== rejectedStudent.id)]);
      }
    }

    const studentForUserUpdate = updatedStudents.find((student) => student.id === app.studentId);
    if (studentForUserUpdate) {
      const shouldActivate = canStudentAccessWorkspace(studentForUserUpdate);
      const shouldArchive = [ApplicationStatus.REJECTED, ApplicationStatus.COMPLETED, ApplicationStatus.ARCHIVED].includes(status);
      mockDb.saveUsers(mockDb.getUsers().map((user) =>
        user.id === studentForUserUpdate.userId
          ? {
              ...user,
              status: shouldArchive ? 'suspended' : shouldActivate ? 'active' : user.status
            }
          : isRejected && user.role === RoleType.SUPERVISOR
            ? { ...user, assignedStudentIds: (user.assignedStudentIds || []).filter((studentId) => studentId !== app.studentId) }
          : user
      ));
    }

    if (!isRejected && updatedApp.supervisorId) {
      mockDb.saveUsers(mockDb.getUsers().map((user) =>
        user.id === updatedApp.supervisorId
          ? { ...user, assignedStudentIds: Array.from(new Set([...(user.assignedStudentIds || []), app.studentId])) }
          : user
      ));
      getOrCreateConversation(app.studentId, updatedApp.supervisorId);
    }

    if (isAccepted) {
      const acceptances = mockDb.getStudentAcceptance();
      if (!acceptances.some((item) => item.studentId === app.studentId && item.internshipTitle === app.internshipTitle)) {
        mockDb.saveStudentAcceptance([
          {
            id: makeId('accept'),
            studentId: app.studentId,
            studentName: app.studentName,
            companyName: app.companyName,
            internshipTitle: app.internshipTitle,
            status: 'approved',
            documentUrl: '#note-acceptation',
            issueDate: new Date().toISOString().slice(0, 10),
            receivedAt: nowIso
          },
          ...acceptances
        ]);
      }
    }

    const student = updatedStudents.find((item) => item.id === app.studentId);
    if (student) {
      const accepted = [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(status);
      const rejected = status === ApplicationStatus.REJECTED;
      const notificationTitle = accepted
        ? `Candidature acceptee par ${updatedApp.companyName}`
        : rejected
          ? `Candidature refusee par ${updatedApp.companyName}`
          : `Reponse de ${updatedApp.companyName}`;
      const notificationMessage = accepted
        ? `${updatedApp.companyName} a accepte votre demande pour "${updatedApp.internshipTitle}". Votre compte est maintenant active et pret a etre utilise. Vous pouvez vous connecter pour acceder a votre espace etudiant.${notes ? ` Message: ${notes}` : ''}`
        : rejected
          ? `${updatedApp.companyName} a refuse votre demande pour "${updatedApp.internshipTitle}". Votre compte sera supprime automatiquement dans un delai de 24 heures. Vos informations resteront archivees.${notes ? ` Motif: ${notes}` : ''}`
          : `${updatedApp.companyName} a repondu a votre demande pour "${updatedApp.internshipTitle}". ${notes}`;
      mockDb.addNotification(student.userId, notificationTitle, notificationMessage);
    }
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'CANDIDATURE_STATUT_MAJ', `Candidature #${id} mise a jour: ${status}`);
    loadAllData(true);
    showToast('Statut de candidature mis a jour.', 'success');
  };

  const markNotificationAsRead = (id: string) => {
    mockDb.saveNotifications(mockDb.getNotifications().map((notif) => notif.id === id ? { ...notif, read: true } : notif));
    loadAllData(true);
  };

  const toggleFavoriteInternship = (id: string) => {
    if (!studentProfile) return;
    const favorites = studentProfile.favoriteInternships || [];
    updateStudentProfile({ favoriteInternships: favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id] });
  };

  const suspendUser = (id: string) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    mockDb.saveUsers(mockDb.getUsers().map((user) => user.id === id ? { ...user, status: 'suspended' as const } : user));
    loadAllData(true);
  };

  const reactivateUser = (id: string) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    mockDb.saveUsers(mockDb.getUsers().map((user) => user.id === id ? { ...user, status: 'active' as const } : user));
    loadAllData(true);
  };

  const createUserByAdmin = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    if (mockDb.getUsers().some((user) => user.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Cet email est deja pris.');
    }
    mockDb.saveUsers([{ ...userData, id: makeId('user'), createdAt: new Date().toISOString() }, ...mockDb.getUsers()]);
    loadAllData(true);
  };

  const addDailyReport = (activity: string, date: string, hoursWorked: number, details: Partial<DailyReport> = {}) => {
    if (!currentUser) return;
    const profile = mockDb.getStudents().find((student) => student.userId === currentUser.id);
    if (!profile || profile.isArchived) {
      showToast('Votre compte de stage n est pas actif.', 'error');
      return;
    }
    const report: DailyReport = {
      id: makeId('report'),
      studentId: profile.id,
      studentName: profile.name,
      date,
      title: details.title || 'Rapport quotidien',
      activity,
      difficulties: details.difficulties,
      skillsUsed: details.skillsUsed,
      attachmentName: details.attachmentName,
      hoursWorked,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    mockDb.saveDailyReports([report, ...mockDb.getDailyReports()]);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'RAPPORT_CREE', `Rapport cree pour le ${date}`);
    loadAllData(true);
    showToast('Rapport soumis au superviseur.', 'success');
  };

  const canTouchStudent = (student?: StudentProfile) => {
    if (!currentUser || !student) return false;
    if (currentUser.role === RoleType.ADMIN) return true;
    if (currentUser.role === RoleType.COMPANY) return student.companyId === companyProfile?.id;
    if (currentUser.role === RoleType.SUPERVISOR) return isOfficiallyAssignedToSupervisor(student, currentUser);
    return student.userId === currentUser.id;
  };

  const updateDailyReportByAdmin = (id: string, updates: Partial<DailyReport>) => {
    if (!currentUser) return;
    const report = mockDb.getDailyReports().find((item) => item.id === id);
    const student = mockDb.getStudents().find((item) => item.id === report?.studentId);
    if (!canTouchStudent(student)) {
      showToast('Acces interdit pour ce rapport.', 'error');
      return;
    }
    mockDb.saveDailyReports(mockDb.getDailyReports().map((item) =>
      item.id === id ? { ...item, ...updates, reviewedBy: currentUser.id } : item
    ));
    loadAllData(true);
    showToast('Rapport mis a jour.', 'success');
  };

  const addStudentGrade = (studentId: string, studentName: string, subject: string, grade: number, comment?: string, details: Partial<StudentGrade> = {}) => {
    if (!currentUser || grade < 0 || grade > 20) return;
    const student = mockDb.getStudents().find((item) => item.id === studentId);
    if (!canTouchStudent(student)) {
      showToast('Acces interdit pour noter cet etudiant.', 'error');
      return;
    }
    const newGrade: StudentGrade = {
      id: makeId('grade'),
      studentId,
      studentName,
      supervisorId: currentUser.role === RoleType.SUPERVISOR ? currentUser.id : details.supervisorId,
      companyId: student?.companyId,
      subject,
      criterion: details.criterion || subject,
      grade,
      maxGrade: 20,
      gradedBy: `${currentUser.name}`,
      comment,
      reportId: details.reportId,
      attendanceId: details.attendanceId,
      createdAt: new Date().toISOString()
    };
    mockDb.saveStudentGrades([newGrade, ...mockDb.getStudentGrades()]);
    loadAllData(true);
    showToast('Note attribuee.', 'success');
  };

  const updateStudentGrade = (id: string, updates: Partial<StudentGrade>) => {
    if (!currentUser) return;
    mockDb.saveStudentGrades(mockDb.getStudentGrades().map((grade) => grade.id === id ? { ...grade, ...updates } : grade));
    loadAllData(true);
  };

  const updateAcceptanceStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    mockDb.saveStudentAcceptance(mockDb.getStudentAcceptance().map((acceptance) =>
      acceptance.id === id
        ? { ...acceptance, status, issueDate: status === 'approved' ? new Date().toISOString().slice(0, 10) : acceptance.issueDate }
        : acceptance
    ));
    loadAllData(true);
  };

  const addPartnerCompanyByAdmin = (companyData: Omit<CompanyProfile, 'id'>) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    const id = makeId('company');
    mockDb.saveCompanies([{ ...companyData, id, departments: buildCompanyDefaults(id) }, ...mockDb.getCompanies()]);
    loadAllData(true);
  };

  const updatePartnerCompanyByAdmin = (id: string, updates: Partial<CompanyProfile>) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    mockDb.saveCompanies(mockDb.getCompanies().map((company) => company.id === id ? { ...company, ...updates } : company));
    loadAllData(true);
  };

  const deletePartnerCompanyByAdmin = (id: string) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    mockDb.saveCompanies(mockDb.getCompanies().filter((company) => company.id !== id));
    loadAllData(true);
  };

  const withdrawCurrentCompany = () => {
    if (!currentUser || currentUser.role !== RoleType.COMPANY || !companyProfile) return;
    const companyId = companyProfile.id;
    const companyUserId = currentUser.id;
    const supervisorIds = mockDb.getUsers()
      .filter((user) => user.role === RoleType.SUPERVISOR && user.companyId === companyId)
      .map((user) => user.id);

    mockDb.saveCompanies(mockDb.getCompanies().filter((company) => company.id !== companyId));
    mockDb.saveInternships(mockDb.getInternships().map((internship) =>
      internship.companyId === companyId ? { ...internship, status: 'archived' } : internship
    ));
    mockDb.saveUsers(mockDb.getUsers().filter((user) => user.id !== companyUserId && !supervisorIds.includes(user.id)));
    mockDb.saveNotifications(mockDb.getNotifications().filter((notification) =>
      notification.userId !== companyUserId && !supervisorIds.includes(notification.userId)
    ));
    mockDb.addAuditLog(companyUserId, currentUser.name, 'ENTREPRISE_RETRAIT', `${companyProfile.name} s est retiree de la plateforme`);
    setCurrentUser(null);
    setCompanyProfile(null);
    setStudentProfile(null);
    localStorage.removeItem('session_user');
    loadAllData(true);
    showToast('Votre entreprise a ete retiree de la plateforme.', 'success');
  };

  const createSupervisorAccount = (input: SupervisorInput | string, email?: string, password = 'password123', details: Partial<SupervisorInput> = {}) => {
    if (!currentUser || currentUser.role !== RoleType.COMPANY || !companyProfile) {
      showToast('Seule une entreprise peut creer un superviseur.', 'error');
      return;
    }
    const payload: SupervisorInput = typeof input === 'string'
      ? { name: input, email: email || '', password, ...details }
      : input;
    if (!payload.name || !payload.email) {
      showToast('Nom et email du superviseur obligatoires.', 'error');
      return;
    }
    if (mockDb.getUsers().some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
      showToast('Cette adresse email existe deja.', 'error');
      return;
    }

    const supervisor: User = {
      id: makeId('user-sup'),
      name: payload.name,
      email: payload.email,
      role: RoleType.SUPERVISOR,
      status: 'active',
      createdAt: new Date().toISOString(),
      companyId: companyProfile.id,
      phone: payload.phone,
      passwordHash: hashPassword(payload.password || password),
      position: payload.position || 'Maitre de stage',
      departmentId: payload.departmentId,
      departmentName: payload.departmentName,
      skills: payload.skills || [],
      assignedStudentIds: payload.assignedStudentIds || []
    };
    mockDb.saveUsers([supervisor, ...mockDb.getUsers()]);
    (payload.assignedStudentIds || []).forEach((studentId) => assignStudentToSupervisor(supervisor.id, studentId));
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'SUPERVISEUR_CREE', `Creation du superviseur ${payload.name}`);
    loadAllData(true);
    showToast('Superviseur cree avec succes.', 'success');
  };

  const updateSupervisorAccount = (id: string, updates: Partial<SupervisorInput>) => {
    if (!currentUser || currentUser.role !== RoleType.COMPANY || !companyProfile) return;
    const supervisor = mockDb.getUsers().find((user) => user.id === id && user.role === RoleType.SUPERVISOR);
    if (!supervisor || supervisor.companyId !== companyProfile.id) {
      showToast('Superviseur introuvable pour votre entreprise.', 'error');
      return;
    }
    const allowedAssignedIds = (updates.assignedStudentIds || []).filter((studentId) => {
      const student = mockDb.getStudents().find((item) => item.id === studentId);
      return Boolean(
        student &&
        student.companyId === companyProfile.id &&
        !student.isArchived &&
        [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP].includes(student.status || ApplicationStatus.PENDING)
      );
    });
    mockDb.saveUsers(mockDb.getUsers().map((user) =>
      user.id === id
        ? {
            ...user,
            name: updates.name || user.name,
            email: updates.email || user.email,
            phone: updates.phone ?? user.phone,
            position: updates.position ?? user.position,
            departmentId: updates.departmentId ?? user.departmentId,
            departmentName: updates.departmentName ?? user.departmentName,
            skills: updates.skills ?? user.skills,
            assignedStudentIds: updates.assignedStudentIds ? allowedAssignedIds : user.assignedStudentIds
          }
        : user
    ));
    if (updates.assignedStudentIds) {
      mockDb.saveStudents(mockDb.getStudents().map((student) => {
        if (allowedAssignedIds.includes(student.id)) return { ...student, supervisorId: id };
        if (student.supervisorId === id) return { ...student, supervisorId: undefined };
        return student;
      }));
    }
    loadAllData(true);
    showToast('Superviseur mis a jour.', 'success');
  };

  const assignStudentToSupervisor = (supervisorId: string, studentId?: string) => {
    if (!currentUser || !studentId) return;
    const supervisor = mockDb.getUsers().find((user) => user.id === supervisorId && user.role === RoleType.SUPERVISOR);
    const student = mockDb.getStudents().find((item) => item.id === studentId);
    const allowedStatuses = [ApplicationStatus.ACCEPTED, ApplicationStatus.IN_INTERNSHIP];
    if (!supervisor || !student || student.isArchived || !allowedStatuses.includes(student.status || ApplicationStatus.PENDING)) {
      showToast('Selection invalide: seuls les etudiants acceptes ou en stage sont assignables.', 'error');
      return;
    }
    if (currentUser.role === RoleType.COMPANY && (supervisor.companyId !== companyProfile?.id || student.companyId !== companyProfile?.id)) {
      showToast('Le superviseur et l etudiant doivent appartenir a votre entreprise.', 'error');
      return;
    }

    mockDb.saveStudents(mockDb.getStudents().map((item) => item.id === studentId ? { ...item, supervisorId } : item));
    mockDb.saveUsers(mockDb.getUsers().map((user) =>
      user.role === RoleType.SUPERVISOR
        ? {
            ...user,
            assignedStudentIds: user.id === supervisorId
              ? Array.from(new Set([...(user.assignedStudentIds || []), studentId]))
              : (user.assignedStudentIds || []).filter((id) => id !== studentId)
          }
        : user
    ));
    getOrCreateConversation(studentId, supervisorId);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'AFFECTATION_ETUDIANT', `${student.name} assigne a ${supervisor.name}`);
    loadAllData(true);
    showToast('Etudiant assigne au superviseur.', 'success');
  };

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id' | 'studentId' | 'studentName' | 'companyId' | 'supervisorId' | 'status' | 'createdAt'>) => {
    if (!currentUser) return;
    const profile = mockDb.getStudents().find((student) => student.userId === currentUser.id);
    const supervisor = profile?.supervisorId
      ? mockDb.getUsers().find((user) => user.id === profile.supervisorId && user.role === RoleType.SUPERVISOR)
      : undefined;
    if (!profile || !isOfficiallyAssignedToSupervisor(profile, supervisor)) {
      showToast('Votre presence ne peut etre deposee qu apres acceptation et assignation a un superviseur.', 'error');
      return;
    }
    const existing = mockDb.getAttendanceRecords().find((item) => item.studentId === profile.id && item.date === record.date);
    const attendance: AttendanceRecord = {
      id: existing?.id || makeId('attendance'),
      studentId: profile.id,
      studentName: profile.name,
      companyId: profile.companyId,
      supervisorId: profile.supervisorId,
      date: record.date,
      arrivalTime: record.arrivalTime,
      departureTime: record.departureTime,
      status: 'en_attente',
      comment: record.comment,
      createdAt: existing?.createdAt || new Date().toISOString()
    };
    mockDb.saveAttendanceRecords([attendance, ...mockDb.getAttendanceRecords().filter((item) => item.id !== attendance.id)]);
    loadAllData(true);
    showToast(existing ? 'Presence mise a jour et renvoyee pour validation.' : 'Presence signalee au superviseur.', 'success');
  };

  const reviewAttendanceRecord = (id: string, status: 'validee' | 'refusee', comment?: string) => {
    if (!currentUser) return;
    const attendance = mockDb.getAttendanceRecords().find((item) => item.id === id);
    const student = mockDb.getStudents().find((item) => item.id === attendance?.studentId);
    if (!canTouchStudent(student)) {
      showToast('Acces interdit pour cette presence.', 'error');
      return;
    }
    mockDb.saveAttendanceRecords(mockDb.getAttendanceRecords().map((item) =>
      item.id === id ? { ...item, status, comment, reviewedBy: currentUser.id } : item
    ));
    loadAllData(true);
    showToast('Presence mise a jour.', 'success');
  };

  function getOrCreateConversation(studentId: string, supervisorId: string) {
    const student = mockDb.getStudents().find((item) => item.id === studentId);
    const supervisor = mockDb.getUsers().find((user) => user.id === supervisorId && user.role === RoleType.SUPERVISOR);
    if (!student || !isOfficiallyAssignedToSupervisor(student, supervisor)) return '';
    const existing = mockDb.getConversations().find((conversation) => conversation.studentId === studentId && conversation.supervisorId === supervisorId);
    if (existing) return existing.id;
    const conversation: Conversation = {
      id: makeId('conversation'),
      companyId: student?.companyId,
      studentId,
      supervisorId,
      subject: 'Suivi du stage',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockDb.saveConversations([conversation, ...mockDb.getConversations()]);
    return conversation.id;
  }

  const sendMessage = (conversationId: string, body: string, attachmentName?: string) => {
    if (!currentUser || !body.trim()) return;
    const conversation = mockDb.getConversations().find((item) => item.id === conversationId);
    if (!conversation) return;
    const student = mockDb.getStudents().find((item) => item.id === conversation.studentId);
    const allowed =
      currentUser.id === student?.userId ||
      currentUser.id === conversation.supervisorId ||
      (currentUser.role === RoleType.COMPANY && student?.companyId === companyProfile?.id);
    if (!allowed) {
      showToast('Acces interdit pour cette conversation.', 'error');
      return;
    }
    const message: Message = {
      id: makeId('message'),
      conversationId,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      body,
      attachmentName,
      createdAt: new Date().toISOString()
    };
    mockDb.saveMessages([...mockDb.getMessages(), message]);
    mockDb.saveConversations(mockDb.getConversations().map((item) =>
      item.id === conversationId ? { ...item, updatedAt: message.createdAt } : item
    ));
    loadAllData(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        studentProfile,
        companyProfile,
        users,
        students,
        companies,
        internships,
        applications,
        notifications,
        auditLogs,
        toasts,
        dailyReports,
        studentGrades,
        studentAcceptances,
        attendanceRecords,
        conversations,
        messages,
        archives,
        showToast,
        removeToast,
        login,
        logout,
        register,
        updateStudentProfile,
        updateCompanyProfile,
        createInternship,
        updateInternship,
        validateInternship,
        applyToInternship,
        updateApplicationStatus,
        markNotificationAsRead,
        toggleFavoriteInternship,
        suspendUser,
        reactivateUser,
        createUserByAdmin,
        addDailyReport,
        updateDailyReportByAdmin,
        addStudentGrade,
        updateStudentGrade,
        updateAcceptanceStatus,
        addPartnerCompanyByAdmin,
        updatePartnerCompanyByAdmin,
        deletePartnerCompanyByAdmin,
        withdrawCurrentCompany,
        createSupervisorAccount,
        updateSupervisorAccount,
        assignStudentToSupervisor,
        addAttendanceRecord,
        reviewAttendanceRecord,
        sendMessage,
        getOrCreateConversation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
