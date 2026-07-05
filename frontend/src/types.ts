export enum RoleType {
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: 'active' | 'suspended';
  createdAt: string;
  companyId?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  cvUrl?: string;
  cvName?: string;
  coverLetter?: string;
  bio?: string;
  skills: string[];
  education: string;
  favoriteInternships: string[]; // internship IDs
  supervisorId?: string; // Identifiant du maître de stage affecté
}

export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  logoUrl: string;
  sector: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  city: string;
  duration: string; // e.g. "6 mois"
  remuneration: string; // e.g. "1200 $ / mois"
  deadline: string; // YYYY-MM-DD
  skillsRequired: string[];
  status: 'pending' | 'published' | 'archived' | 'rejected';
  createdAt: string;
}

export enum ApplicationStatus {
  PENDING = 'En attente',
  ACCEPTED = 'Acceptée',
  REJECTED = 'Refusée',
  INTERVIEW = 'Entretien programmé'
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  cvName: string;
  cvUrl: string;
  coverLetter: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface DailyReport {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // AAAA-MM-JJ
  activity: string; // Description du travail journalier
  hoursWorked: number;
  status: 'pending' | 'validated' | 'rejected';
  adminComment?: string;
  createdAt: string;
}

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string; // E.g., Assiduité, Rapport Hebdomadaire, Présentation, Note Industrielle
  grade: number; // Cote obtenue
  maxGrade: number; // Note maximale possible (ex: 20)
  gradedBy: string; // Qui a évalué
  comment?: string;
  createdAt: string;
}

export interface StudentAcceptance {
  id: string;
  studentId: string;
  studentName: string;
  companyName: string;
  internshipTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string; // Simulé
  issueDate?: string;
  receivedAt: string;
}

