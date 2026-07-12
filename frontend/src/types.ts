export enum RoleType {
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR'
}

export enum ApplicationStatus {
  PENDING = 'en_attente',
  INTERVIEW = 'entretien_demande',
  ACCEPTED = 'accepte',
  REJECTED = 'rejete',
  IN_INTERNSHIP = 'en_stage',
  COMPLETED = 'termine',
  ARCHIVED = 'archive'
}

export type StudentStageStatus = ApplicationStatus;

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: 'active' | 'suspended' | 'archived';
  createdAt: string;
  companyId?: string;
  phone?: string;
  passwordHash?: string;
  position?: string;
  departmentId?: string;
  departmentName?: string;
  skills?: string[];
  assignedStudentIds?: string[];
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
  favoriteInternships: string[];
  university?: string;
  faculty?: string;
  level?: string;
  field?: string;
  specialty?: string;
  companyId?: string;
  companyName?: string;
  departmentId?: string;
  departmentName?: string;
  supervisorId?: string;
  applicationStatus?: StudentStageStatus;
  status?: StudentStageStatus;
  acceptanceNote?: string;
  interviewNote?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  startDate?: string;
  endDate?: string;
  expiresAt?: string;
  archivedAt?: string;
  isArchived?: boolean;
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
  departments?: Department[];
  requiredSkills?: string[];
  acceptedSpecialties?: string[];
  eligibilityCriteria?: string;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  city: string;
  duration: string;
  remuneration: string;
  deadline: string;
  skillsRequired: string[];
  status: 'pending' | 'published' | 'archived' | 'rejected';
  createdAt: string;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  companyId?: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  cvName: string;
  cvUrl: string;
  coverLetter: string;
  status: ApplicationStatus;
  targetCompanyNote?: string;
  notes?: string;
  departmentId?: string;
  departmentName?: string;
  specialty?: string;
  interviewNote?: string;
  acceptanceNote?: string;
  rejectionReason?: string;
  supervisorId?: string;
  startDate?: string;
  endDate?: string;
  rejectedAt?: string;
  archivedAt?: string;
  expiresAt?: string;
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
  date: string;
  title?: string;
  activity: string;
  difficulties?: string;
  skillsUsed?: string[];
  attachmentName?: string;
  hoursWorked: number;
  status: 'pending' | 'reviewed' | 'validated' | 'rejected';
  adminComment?: string;
  supervisorComment?: string;
  reviewedBy?: string;
  grade?: number;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  companyId?: string;
  supervisorId?: string;
  date: string;
  arrivalTime: string;
  departureTime?: string;
  status: 'en_attente' | 'validee' | 'refusee';
  comment?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  supervisorId?: string;
  companyId?: string;
  reportId?: string;
  attendanceId?: string;
  subject: string;
  criterion?: string;
  grade: number;
  maxGrade: number;
  gradedBy: string;
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
  documentUrl?: string;
  issueDate?: string;
  receivedAt: string;
}

export interface Conversation {
  id: string;
  companyId?: string;
  studentId: string;
  supervisorId: string;
  subject?: string;
  relatedReportId?: string;
  relatedAttendanceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: RoleType;
  body: string;
  attachmentName?: string;
  createdAt: string;
}

export interface ArchiveRecord {
  id: string;
  companyId?: string;
  companyName?: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  status: ApplicationStatus;
  reason: 'rejected' | 'expired' | 'manual';
  rejectionReason?: string;
  archivedAt: string;
  snapshot: Partial<StudentProfile>;
}
