// Storage Service for Local Persistence & Synthetic Database
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_GRADES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_DISCUSSIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'siakad_users_v1',
  COURSES: 'siakad_courses_v1',
  GRADES: 'siakad_grades_v1',
  ASSIGNMENTS: 'siakad_assignments_v1',
  SUBMISSIONS: 'siakad_submissions_v1',
  DISCUSSIONS: 'siakad_discussions_v1',
  AUDIT_LOGS: 'siakad_audit_logs_v1',
  ACTIVE_SESSION: 'siakad_active_session_v1',
  LAB_CONFIG: 'siakad_lab_config_v1'
};

export const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.resetToDefaults();
    }
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(INITIAL_GRADES));
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(INITIAL_DISCUSSIONS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  },

  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCourses() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
  },

  getGrades() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GRADES) || '[]');
  },

  saveGrades(grades) {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  },

  getAssignments() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS) || '[]');
  },

  saveAssignments(assignments) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  getSubmissions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
  },

  saveSubmissions(submissions) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  getDiscussions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISCUSSIONS) || '[]');
  },

  saveDiscussions(discussions) {
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(discussions));
  },

  getAuditLogs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
  },

  addAuditLog(action, target, status, details = '', user = null) {
    const logs = this.getAuditLogs();
    const newLog = {
      id: 'log_' + Date.now() + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      userId: user?.id || 'system',
      username: user?.username || 'anonymous',
      action,
      target,
      status,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      details
    };
    logs.unshift(newLog);
    // Keep last 100 logs
    const trimmed = logs.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(trimmed));
    return newLog;
  },

  getSession() {
    const sessionStr = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  setSession(sessionData) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(sessionData));
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }
};
