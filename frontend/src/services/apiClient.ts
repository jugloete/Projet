import type {
  Application,
  AuditLog,
  AttendanceRecord,
  ArchiveRecord,
  CompanyProfile,
  Conversation,
  DailyReport,
  Internship,
  Message,
  Notification,
  StudentAcceptance,
  StudentGrade,
  StudentProfile,
  User
} from '../types';

export interface AppSnapshot {
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
}

const configuredBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${configuredBase}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(errorBody || `Erreur API ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  baseUrl: configuredBase,

  async health() {
    return request<{ ok: boolean; database: string }>('/health');
  },

  async getSnapshot(): Promise<AppSnapshot | null> {
    return request<AppSnapshot>('/snapshot');
  },

  async saveSnapshot(snapshot: AppSnapshot): Promise<{ ok: boolean }> {
    return request<{ ok: boolean }>('/snapshot', {
      method: 'PUT',
      body: JSON.stringify(snapshot)
    });
  },

  async getSupervisorStudents(supervisorId: string): Promise<StudentProfile[]> {
    return request<StudentProfile[]>(`/supervisors/${encodeURIComponent(supervisorId)}/students`);
  }
};
