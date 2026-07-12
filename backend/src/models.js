import mongoose from 'mongoose';

const options = {
  strict: false,
  versionKey: false,
  timestamps: false
};

function createCollectionModel(name, collectionName) {
  const schema = new mongoose.Schema({ id: { type: String, index: true } }, options);
  schema.index({ id: 1 }, { unique: false });
  return mongoose.models[name] || mongoose.model(name, schema, collectionName);
}

export const models = {
  users: createCollectionModel('UserSnapshot', 'users'),
  students: createCollectionModel('StudentSnapshot', 'students'),
  companies: createCollectionModel('CompanySnapshot', 'companies'),
  internships: createCollectionModel('InternshipSnapshot', 'internships'),
  applications: createCollectionModel('ApplicationSnapshot', 'applications'),
  notifications: createCollectionModel('NotificationSnapshot', 'notifications'),
  auditLogs: createCollectionModel('AuditLogSnapshot', 'audit_logs'),
  dailyReports: createCollectionModel('DailyReportSnapshot', 'daily_reports'),
  studentGrades: createCollectionModel('StudentGradeSnapshot', 'student_grades'),
  studentAcceptances: createCollectionModel('StudentAcceptanceSnapshot', 'student_acceptances'),
  attendanceRecords: createCollectionModel('AttendanceRecordSnapshot', 'attendance_records'),
  conversations: createCollectionModel('ConversationSnapshot', 'conversations'),
  messages: createCollectionModel('MessageSnapshot', 'messages'),
  archives: createCollectionModel('ArchiveSnapshot', 'archives')
};

export const collectionNames = Object.keys(models);
