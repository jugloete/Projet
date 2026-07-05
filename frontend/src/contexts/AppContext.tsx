import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  StudentAcceptance
} from '../types';
import { mockDb } from '../services/mockDb';
import { apiClient } from '../services/apiClient';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
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
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (email: string, role: RoleType) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, role: RoleType, details?: any) => Promise<boolean>;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  createInternship: (internship: Omit<Internship, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'status' | 'createdAt'>) => void;
  updateInternship: (id: string, internship: Partial<Internship>) => void;
  validateInternship: (id: string, action: 'published' | 'rejected') => void;
  applyToInternship: (internshipId: string, cvName: string, coverLetter: string) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => void;
  markNotificationAsRead: (id: string) => void;
  toggleFavoriteInternship: (id: string) => void;
  suspendUser: (id: string) => void;
  reactivateUser: (id: string) => void;
  createUserByAdmin: (user: Omit<User, 'id' | 'createdAt'>) => void;
  addDailyReport: (activity: string, date: string, hoursWorked: number) => void;
  updateDailyReportByAdmin: (id: string, updates: Partial<DailyReport>) => void;
  addStudentGrade: (studentId: string, studentName: string, subject: string, grade: number, comment?: string) => void;
  updateStudentGrade: (id: string, updates: Partial<StudentGrade>) => void;
  updateAcceptanceStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  addPartnerCompanyByAdmin: (company: Omit<CompanyProfile, 'id'>) => void;
  updatePartnerCompanyByAdmin: (id: string, updates: Partial<CompanyProfile>) => void;
  deletePartnerCompanyByAdmin: (id: string) => void;
  createSupervisorAccount: (name: string, email: string, password?: string) => void;
}

const AppContext = createContext<any>(undefined);

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
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [studentAcceptances, setStudentAcceptances] = useState<StudentAcceptance[]>([]);

  // Load state on mount and hydrate from MongoDB when the API is available.
  useEffect(() => {
    mockDb.initialize();
    loadAllData();

    apiClient.getSnapshot()
      .then((snapshot) => {
        if (snapshot && snapshot.users?.length) {
          mockDb.importSnapshot(snapshot);
          loadAllData();
        }
      })
      .catch(() => {
        // The frontend remains fully usable offline through localStorage.
      });
  }, []);

  const syncToMongo = () => {
    apiClient.saveSnapshot(mockDb.exportSnapshot()).catch(() => {
      // Keep the UI fast and local-first when MongoDB/API is temporarily unavailable.
    });
  };

  const loadAllData = (sync = false) => {
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
    if (sync) syncToMongo();
  };

  const loadUserProfiles = (user: User) => {
    if (user.role === RoleType.STUDENT) {
      const profiles = mockDb.getStudents();
      const p = profiles.find(prof => prof.userId === user.id) || null;
      setStudentProfile(p);
      setCompanyProfile(null);
    } else if (user.role === RoleType.COMPANY) {
      const profiles = mockDb.getCompanies();
      const p = profiles.find(prof => prof.userId === user.id) || null;
      setCompanyProfile(p);
      setStudentProfile(null);
    } else {
      setStudentProfile(null);
      setCompanyProfile(null);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email: string, role: RoleType): Promise<boolean> => {
    const allUsers = mockDb.getUsers();
    // First try exact match with provided role (normal case), otherwise allow login by email alone
    let user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (!user) {
      user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (user) {
      if (user.status === 'suspended') {
        throw new Error('Votre compte est suspendu. Veuillez contacter un administrateur.');
      }
      setCurrentUser(user);
      localStorage.setItem('session_user', JSON.stringify(user));
      loadUserProfiles(user);
      mockDb.addAuditLog(user.id, user.name, 'CONNEXION', `Connexion réussie en tant que ${role}`);
      loadAllData(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      mockDb.addAuditLog(currentUser.id, currentUser.name, 'DECONNEXION', 'Déconnexion réussie');
    }
    setCurrentUser(null);
    setStudentProfile(null);
    setCompanyProfile(null);
    localStorage.removeItem('session_user');
  };

  const register = async (name: string, email: string, role: RoleType, details?: any): Promise<boolean> => {
    const allUsers = mockDb.getUsers();
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Cette adresse email est déjà enregistrée.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...allUsers, newUser];
    mockDb.saveUsers(updatedUsers);

    if (role === RoleType.STUDENT) {
      const allStudents = mockDb.getStudents();
      const newStudent: StudentProfile = {
        id: `student-${Date.now()}`,
        userId: newUser.id,
        name,
        email,
        phone: details?.phone || '',
        avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&w=150&q=80`,
        cvName: '',
        cvUrl: '',
        coverLetter: '',
        bio: '',
        skills: details?.skills || [],
        education: details?.education || '',
        favoriteInternships: []
      };
      mockDb.saveStudents([...allStudents, newStudent]);
    } else if (role === RoleType.COMPANY) {
      const allComp = mockDb.getCompanies();
      const newComp: CompanyProfile = {
        id: `company-${Date.now()}`,
        userId: newUser.id,
        name,
        email,
        logoUrl: `https://images.unsplash.com/photo-${1560000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&w=150&q=80`,
        sector: details?.sector || 'Non spécifié',
        address: details?.address || 'Non spécifié',
        contactName: name,
        contactEmail: email,
        contactPhone: details?.phone || '',
        description: details?.description || ''
      };
      mockDb.saveCompanies([...allComp, newComp]);

      // Notify admin and supervisors
      const admins = updatedUsers.filter(u => u.role === RoleType.ADMIN || u.role === RoleType.SUPERVISOR);
      admins.forEach(admin => {
        mockDb.addNotification(admin.id, 'Nouvelle entreprise inscrite', `L'entreprise "${name}" s'est inscrite sur la plateforme.`);
      });
    }

    mockDb.addAuditLog(newUser.id, newUser.name, 'INSCRIPTION', `Inscription compte role: ${role}`);
    
    // Automatically log in
    setCurrentUser(newUser);
    localStorage.setItem('session_user', JSON.stringify(newUser));
    loadUserProfiles(newUser);
    loadAllData(true);
    return true;
  };

  const updateStudentProfile = (update: Partial<StudentProfile>) => {
    if (!studentProfile) return;
    const allStudents = mockDb.getStudents();
    const updated = allStudents.map(s => s.id === studentProfile.id ? { ...s, ...update } : s);
    mockDb.saveStudents(updated);
    setStudentProfile({ ...studentProfile, ...update });
    mockDb.addAuditLog(currentUser!.id, currentUser!.name, 'PROFIL_MAJ', 'Mise à jour du profil étudiant');
    loadAllData(true);
  };

  const updateCompanyProfile = (update: Partial<CompanyProfile>) => {
    if (!companyProfile) return;
    const allComp = mockDb.getCompanies();
    const updated = allComp.map(c => c.id === companyProfile.id ? { ...c, ...update } : c);
    mockDb.saveCompanies(updated);
    setCompanyProfile({ ...companyProfile, ...update });
    mockDb.addAuditLog(currentUser!.id, currentUser!.name, 'PROFIL_MAJ', 'Mise à jour du profil entreprise');
    loadAllData(true);
  };

  const createInternship = (internshipData: Omit<Internship, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'status' | 'createdAt'>) => {
    if (!currentUser || !companyProfile) return;
    const allInternships = mockDb.getInternships();
    const newInternship: Internship = {
      ...internshipData,
      id: `internship-${Date.now()}`,
      companyId: companyProfile.id,
      companyName: companyProfile.name,
      companyLogo: companyProfile.logoUrl,
      status: 'pending', // Awaiting admin validation
      createdAt: new Date().toISOString()
    };
    mockDb.saveInternships([newInternship, ...allInternships]);

    // Audit and Admin/Supervisor Notif
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'OFFRE_CREEE', `Création d'offre de stage: ${newInternship.title}`);
    
    // Notify Admin users
    const allUsers = mockDb.getUsers();
    const admins = allUsers.filter(u => u.role === RoleType.ADMIN || u.role === RoleType.SUPERVISOR);
    admins.forEach(admin => {
      mockDb.addNotification(
        admin.id, 
        'Validation requise', 
        `L'entreprise "${companyProfile.name}" a proposé un nouveau stage: "${newInternship.title}".`
      );
    });

    loadAllData(true);
  };

  const updateInternship = (id: string, update: Partial<Internship>) => {
    if (!currentUser) return;
    const allInternships = mockDb.getInternships();
    const updated = allInternships.map(i => i.id === id ? { ...i, ...update } : i);
    mockDb.saveInternships(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'OFFRE_MAJ', `Modification de l'offre de stage #${id}`);
    loadAllData(true);
  };

  const validateInternship = (id: string, action: 'published' | 'rejected') => {
    if (!currentUser || !(currentUser.role === RoleType.ADMIN || currentUser.role === RoleType.SUPERVISOR)) return;
    const allInternships = mockDb.getInternships();
    const internship = allInternships.find(i => i.id === id);
    if (!internship) return;

    const updated = allInternships.map(i => i.id === id ? { ...i, status: action } : i);
    mockDb.saveInternships(updated);

    // Notify company profile
    const allComp = mockDb.getCompanies();
    const company = allComp.find(c => c.id === internship.companyId);
    if (company) {
      const message = action === 'published' 
        ? `Félicitations ! Votre offre de stage "${internship.title}" a été approuvée et publiée.`
        : `Votre offre de stage "${internship.title}" a été refusée par l'administrateur.`;
      
      mockDb.addNotification(company.userId, `Statut de votre annonce : ${action === 'published' ? 'Validée' : 'Refusée'}`, message);
    }

    // If published, notify students
    if (action === 'published') {
      const allStuds = mockDb.getStudents();
      allStuds.forEach(student => {
        const hasMatchingSkill = student.skills.some(skill => 
          internship.skillsRequired.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        );
        if (hasMatchingSkill) {
          mockDb.addNotification(
            student.userId,
            'Nouveau stage recommandé',
            `Un nouveau stage correspondant à vos compétences est disponible : "${internship.title}" chez ${internship.companyName}`
          );
        }
      });
    }

    mockDb.addAuditLog(currentUser.id, currentUser.name, 'OFFRE_VALIDATION', `Offre ${internship.title} mise à jour à: ${action}`);
    loadAllData(true);
  };

  const applyToInternship = (internshipId: string, cvName: string, coverLetter: string) => {
    if (!currentUser || !studentProfile) return;
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;

    const allApps = mockDb.getApplications();
    if (allApps.some(a => a.internshipId === internshipId && a.studentId === studentProfile.id)) {
      throw new Error('Vous avez déjà postulé à cette offre.');
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      internshipId,
      internshipTitle: internship.title,
      companyName: internship.companyName,
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      studentEmail: studentProfile.email,
      cvName: cvName || studentProfile.cvName || 'cv_attache.pdf',
      cvUrl: '#',
      coverLetter: coverLetter || studentProfile.coverLetter || '',
      status: ApplicationStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    mockDb.saveApplications([newApp, ...allApps]);

    const allComp = mockDb.getCompanies();
    const company = allComp.find(c => c.id === internship.companyId);
    if (company) {
      mockDb.addNotification(
        company.userId, 
        'Nouvelle candidature reçue', 
        `L'étudiant "${studentProfile.name}" a postulé pour le stage "${internship.title}".`
      );
    }

    mockDb.addAuditLog(currentUser.id, currentUser.name, 'CANDIDATURE_ENVOI', `Candidature envoyée pour ${internship.title}`);
    loadAllData(true);
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, notes?: string) => {
    if (!currentUser) return;
    const allApps = mockDb.getApplications();
    const app = allApps.find(a => a.id === id);
    if (!app) return;

    const updated = allApps.map(a => a.id === id ? { ...a, status, notes } : a);
    mockDb.saveApplications(updated);

    const allStudents = mockDb.getStudents();
    const student = allStudents.find(s => s.id === app.studentId);
    if (student) {
      let message = `Le statut de votre candidature pour le stage "${app.internshipTitle}" chez ${app.companyName} est désormais : ${status}.`;
      if (notes) {
        message += ` Notes complémentaires : ${notes}`;
      }
      mockDb.addNotification(student.userId, `Mise à jour candidature : ${status}`, message);
    }

    mockDb.addAuditLog(currentUser.id, currentUser.name, 'CANDIDATURE_STATUT_MAJ', `Statut candidature #${id} mis à jour à: ${status}`);
    loadAllData(true);
  };

  const markNotificationAsRead = (id: string) => {
    const allNotifs = mockDb.getNotifications();
    const updated = allNotifs.map(n => n.id === id ? { ...n, read: true } : n);
    mockDb.saveNotifications(updated);
    loadAllData(true);
  };

  const toggleFavoriteInternship = (id: string) => {
    if (!studentProfile) return;
    let favs = [...(studentProfile.favoriteInternships || [])];
    if (favs.includes(id)) {
      favs = favs.filter(x => x !== id);
    } else {
      favs.push(id);
    }
    updateStudentProfile({ favoriteInternships: favs });
  };

  const suspendUser = (id: string) => {
    if (!currentUser || !(currentUser.role === RoleType.ADMIN || currentUser.role === RoleType.SUPERVISOR)) return;
    const allUsers = mockDb.getUsers();
    const updated = allUsers.map(u => u.id === id ? { ...u, status: 'suspended' as const } : u);
    mockDb.saveUsers(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'COMPTE_SUSPENSION', `Suspension de l'utilisateur #${id}`);
    loadAllData(true);
  };

  const reactivateUser = (id: string) => {
    if (!currentUser || !(currentUser.role === RoleType.ADMIN || currentUser.role === RoleType.SUPERVISOR)) return;
    const allUsers = mockDb.getUsers();
    const updated = allUsers.map(u => u.id === id ? { ...u, status: 'active' as const } : u);
    mockDb.saveUsers(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'COMPTE_REACTIVATION', `Réactivation de l'utilisateur #${id}`);
    loadAllData(true);
  };

  const createUserByAdmin = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (!currentUser || !(currentUser.role === RoleType.ADMIN || currentUser.role === RoleType.SUPERVISOR)) return;
    const allUsers = mockDb.getUsers();
    if (allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Cet email est déjà pris.');
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...allUsers, newUser];
    mockDb.saveUsers(updatedUsers);

    if (userData.role === RoleType.STUDENT) {
      const allStudents = mockDb.getStudents();
      const newStudent: StudentProfile = {
        id: `student-${Date.now()}`,
        userId: newUser.id,
        name: userData.name,
        email: userData.email,
        phone: '',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        skills: [],
        education: '',
        favoriteInternships: []
      };
      mockDb.saveStudents([...allStudents, newStudent]);
    } else if (userData.role === RoleType.COMPANY) {
      const allComp = mockDb.getCompanies();
      const newComp: CompanyProfile = {
        id: `company-${Date.now()}`,
        userId: newUser.id,
        name: userData.name,
        email: userData.email,
        logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
        sector: 'Non désigné',
        address: '',
        contactName: userData.name,
        contactEmail: userData.email,
        contactPhone: '',
        description: ''
      };
      mockDb.saveCompanies([...allComp, newComp]);
    }

    mockDb.addAuditLog(currentUser.id, currentUser.name, 'COMPTE_CREE_ADMIN', `Création admin du compte #${newUser.id}`);
    loadAllData(true);
  };

  const addDailyReport = (activity: string, date: string, hoursWorked: number) => {
    if (!currentUser) return;
    const studentProf = students.find(s => s.userId === currentUser.id);
    if (!studentProf) return;

    const newReport: DailyReport = {
      id: `report-${Date.now()}`,
      studentId: studentProf.id,
      studentName: studentProf.name,
      date,
      activity,
      hoursWorked,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newReport, ...dailyReports];
    mockDb.saveDailyReports(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'RAPPORT_JOURNALIER_CREE', `Création du rapport journalier pour le ${date}`);
    loadAllData(true);
    showToast("Votre rapport journalier a été soumis !", "success");
  };

  const updateDailyReportByAdmin = (id: string, updates: Partial<DailyReport>) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;

    const updated = dailyReports.map(r => {
      if (r.id === id) {
        return { ...r, ...updates };
      }
      return r;
    });

    mockDb.saveDailyReports(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'RAPPORT_JOURNALIER_MAJ', `Modification admin du rapport quotidien #${id}`);
    loadAllData(true);
    showToast("Le rapport journalier a été mis à jour !", "success");
  };

  const addStudentGrade = (studentId: string, studentName: string, subject: string, grade: number, comment?: string) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;

    const newGrade: StudentGrade = {
      id: `grade-${Date.now()}`,
      studentId,
      studentName,
      subject,
      grade,
      maxGrade: 20,
      gradedBy: `${currentUser.name} (Admin)`,
      comment,
      createdAt: new Date().toISOString()
    };

    const updated = [newGrade, ...studentGrades];
    mockDb.saveStudentGrades(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'NOTE_ATTRIBUEE', `Attribution de la cote (${grade}/20) à ${studentName} en ${subject}`);
    loadAllData(true);
    showToast(`Note de ${grade}/20 attribuée à ${studentName} !`, "success");
  };

  const updateStudentGrade = (id: string, updates: Partial<StudentGrade>) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;

    const updated = studentGrades.map(g => {
      if (g.id === id) {
        return { ...g, ...updates, gradedBy: `${currentUser.name} (Admin)` };
      }
      return g;
    });

    mockDb.saveStudentGrades(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'NOTE_MAJ', `Mise à jour admin de la note #${id}`);
    loadAllData(true);
    showToast("La note de l'étudiant a été modifiée !", "success");
  };

  const updateAcceptanceStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const updated = studentAcceptances.map(a => {
      if (a.id === id) {
        return { ...a, status, issueDate: status === 'approved' ? new Date().toISOString().split('T')[0] : a.issueDate };
      }
      return a;
    });

    mockDb.saveStudentAcceptance(updated);
    if (currentUser) {
      mockDb.addAuditLog(currentUser.id, currentUser.name, 'DECISION_ACCEPTATION', `Le statut de la note d'acceptation #${id} est désormais ${status}`);
    }
    loadAllData(true);
    showToast(`Le statut de la note d'acceptation a été modifié.`, "success");
  };

  const addPartnerCompanyByAdmin = (companyData: Omit<CompanyProfile, 'id'>) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    const allComp = mockDb.getCompanies();
    const newComp: CompanyProfile = {
      ...companyData,
      id: `company-${Date.now()}`
    };
    mockDb.saveCompanies([...allComp, newComp]);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'PARTENAIRE_AJOUT', `Ajout d'une entreprise partenaire : ${newComp.name}`);
    loadAllData(true);
    showToast(`Entreprise ${newComp.name} ajoutée avec succès !`, 'success');
  };

  const updatePartnerCompanyByAdmin = (id: string, updates: Partial<CompanyProfile>) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    const allComp = mockDb.getCompanies();
    const updated = allComp.map(c => c.id === id ? { ...c, ...updates } : c);
    mockDb.saveCompanies(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'PARTENAIRE_MAJ', `Mise à jour de l'entreprise partenaire #${id}`);
    loadAllData(true);
    showToast(`Entreprise mise à jour avec succès !`, 'success');
  };

  const deletePartnerCompanyByAdmin = (id: string) => {
    if (!currentUser || currentUser.role !== RoleType.ADMIN) return;
    const allComp = mockDb.getCompanies();
    const targetComp = allComp.find(c => c.id === id);
    if (!targetComp) return;
    const updated = allComp.filter(c => c.id !== id);
    mockDb.saveCompanies(updated);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'PARTENAIRE_SUPPRESSION', `Suppression de l'entreprise partenaire : ${targetComp.name}`);
    loadAllData(true);
    showToast(`Entreprise partenaire supprimée !`, 'success');
  };

  // 📝 Nouvelle fonction persistée pour la création des Maîtres de stage par les Entreprises
  const createSupervisorAccount = (name: string, email: string, password = 'password123') => {
    if (!currentUser || currentUser.role !== RoleType.COMPANY || !companyProfile) {
      showToast("Action non autorisée. Seule une entreprise peut créer un maître de stage.", "error");
      return;
    }

    const allUsers = mockDb.getUsers();
    const emailExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      showToast("Cette adresse email est déjà utilisée par un autre compte.", "error");
      return;
    }

    const newSupervisor: User = {
      id: `user-sup-${Date.now()}`,
      name,
      email,
      role: RoleType.SUPERVISOR,
      status: 'active',
      createdAt: new Date().toISOString(),
      companyId: companyProfile.id
    };

    mockDb.saveUsers([...allUsers, newSupervisor]);
    mockDb.addAuditLog(currentUser.id, currentUser.name, 'MAITRE_STAGE_CREE', `Création du maître de stage : ${name} pour l'entreprise ${companyProfile.name}`);
    loadAllData(true);
    showToast(`Le compte Maître de stage pour ${name} a été généré avec succès !`, "success");
  };

  return (
    <AppContext.Provider value={{
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
      createSupervisorAccount // Enregistré et prêt à servir
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};