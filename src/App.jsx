import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { SecurityLabDrawer } from './components/lab/SecurityLabDrawer';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentGrades } from './components/student/StudentGrades';
import { StudentAssignments } from './components/student/StudentAssignments';
import { LecturerDashboard } from './components/lecturer/LecturerDashboard';
import { GradeManagement } from './components/lecturer/GradeManagement';
import { AssignmentManagement } from './components/lecturer/AssignmentManagement';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';
import { AuditLogViewer } from './components/admin/AuditLogViewer';
import { DiscussionForum } from './components/forum/DiscussionForum';
import { LoginModal } from './components/auth/LoginModal';
import { UserProfileModal } from './components/profile/UserProfileModal';

import { StorageService } from './services/storageService';
import { SecurityLabEngine, VULNERABILITY_KEYS } from './services/securityLabEngine';
import {
  GraduationCap,
  ShieldAlert,
  RotateCcw,
  Info,
  Bug,
  Lock,
  Unlock,
  CheckCircle2,
  FileCheck2,
  KeyRound
} from 'lucide-react';

function CampusPortalApp() {
  const { addToast } = useToast();

  // Inisialisasi Storage
  useEffect(() => {
    StorageService.init();
  }, []);

  // Database Local State
  const [allUsers, setAllUsers] = useState(() => {
    StorageService.init();
    return StorageService.getUsers();
  });
  const [courses, setCourses] = useState(() => StorageService.getCourses());
  const [grades, setGrades] = useState(() => StorageService.getGrades());
  const [assignments, setAssignments] = useState(() => StorageService.getAssignments());
  const [submissions, setSubmissions] = useState(() => StorageService.getSubmissions());
  const [discussions, setDiscussions] = useState(() => StorageService.getDiscussions());
  const [auditLogs, setAuditLogs] = useState(() => StorageService.getAuditLogs());

  // Security Lab Matrix State
  const [labState, setLabState] = useState(() => SecurityLabEngine.getState());

  // Active Session State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = StorageService.getSession();
    if (saved) return saved;
    // Default akun aktif saat pertama kali dibuka: Mahasiswa (Arya)
    const defaultMhs = StorageService.getUsers().find((u) => u.username === 'mhs_arya');
    return defaultMhs || null;
  });

  const [sessionToken, setSessionToken] = useState(() => 'jwt_simulated_token_' + Date.now());

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal & Drawer States
  const [isLabDrawerOpen, setIsLabDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Simpan Sesi saat berubah
  useEffect(() => {
    if (currentUser) {
      StorageService.setSession(currentUser);
    } else {
      StorageService.clearSession();
    }
  }, [currentUser]);

  // Window helper untuk XSS trigger demo
  useEffect(() => {
    window.labTriggerXss = (msg) => {
      handleLabExploited(VULNERABILITY_KEYS.XSS);
      addToast({
        type: 'warning',
        title: 'Stored XSS Berhasil Dieksekusi!',
        message: msg || 'Skrip JavaScript di dalam konten dieksekusi oleh browser!'
      });
    };
    return () => {
      delete window.labTriggerXss;
    };
  }, []);

  // Lab Event Handlers
  const handleToggleLabMode = (vulnKey) => {
    const updated = SecurityLabEngine.toggleVulnerabilityMode(vulnKey);
    setLabState({ ...updated });
    const currentMode = updated[vulnKey]?.mode;
    addToast({
      type: currentMode === 'vulnerable' ? 'warning' : 'success',
      title: `Mode Keamanan Diubah: ${updated[vulnKey]?.title}`,
      message: `Sekarang beralih ke: ${
        currentMode === 'vulnerable' ? 'Mode Rentan (Vulnerable)' : 'Mode Aman (Remediated)'
      }`
    });
  };

  const handleSetAllLabModes = (mode) => {
    const updated = SecurityLabEngine.setAllModes(mode);
    setLabState({ ...updated });
    addToast({
      type: mode === 'vulnerable' ? 'warning' : 'success',
      title: 'Konfigurasi Lab Diterapkan',
      message: `Seluruh 8 vektor kerentanan sekarang berada dalam: ${
        mode === 'vulnerable' ? 'Mode Rentan (Vulnerable)' : 'Mode Aman (Remediated)'
      }`
    });
  };

  const handleResetLabProgress = () => {
    const reset = SecurityLabEngine.resetProgress();
    setLabState({ ...reset });
    addToast({
      type: 'info',
      title: 'Progres Lab Direset',
      message: 'Status pengujian 8 vektor keamanan siber telah diatur ulang ke kondisi awal.'
    });
  };

  const handleLabExploited = (vulnKey) => {
    const updated = SecurityLabEngine.markExploited(vulnKey);
    setLabState({ ...updated });
    StorageService.addAuditLog(
      'SECURITY_ALERT',
      `Kerentanan Teruji: ${labState[vulnKey]?.title}`,
      'EXPLOITED',
      `Eksploitasi terdeteksi pada skenario lab ${labState[vulnKey]?.scenario}`,
      currentUser
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleCopyPayload = (text) => {
    navigator.clipboard?.writeText(text);
    addToast({
      type: 'info',
      title: 'Payload Disalin ke Clipboard',
      message: text
    });
  };

  const handleSimulateAction = (vulnKey) => {
    switch (vulnKey) {
      case VULNERABILITY_KEYS.SQLI:
        setIsLoginModalOpen(true);
        setIsLabDrawerOpen(false);
        break;
      case VULNERABILITY_KEYS.XSS:
        setActiveTab('forum');
        setIsLabDrawerOpen(false);
        break;
      case VULNERABILITY_KEYS.IDOR:
        if (currentUser?.role !== 'mahasiswa') {
          const mhs = allUsers.find((u) => u.role === 'mahasiswa');
          if (mhs) setCurrentUser(mhs);
        }
        setActiveTab('grades');
        setIsLabDrawerOpen(false);
        break;
      case VULNERABILITY_KEYS.CSRF:
      case VULNERABILITY_KEYS.PRIV_ESC:
      case VULNERABILITY_KEYS.BROKEN_SESSION:
        setIsProfileModalOpen(true);
        setIsLabDrawerOpen(false);
        break;
      case VULNERABILITY_KEYS.FILE_UPLOAD:
        if (currentUser?.role !== 'mahasiswa') {
          const mhs = allUsers.find((u) => u.role === 'mahasiswa');
          if (mhs) setCurrentUser(mhs);
        }
        setActiveTab('assignments');
        setIsLabDrawerOpen(false);
        break;
      case VULNERABILITY_KEYS.BRUTE_FORCE:
        setIsLoginModalOpen(true);
        setIsLabDrawerOpen(false);
        break;
      default:
        break;
    }
  };

  // Auth & Session Handlers
  const handleQuickSwitchUser = (targetUser) => {
    setCurrentUser(targetUser);
    setActiveTab('dashboard');
    addToast({
      type: 'info',
      title: 'Beralih Akun Pengguna',
      message: `Aktif sebagai: ${targetUser.nama} (${targetUser.role.toUpperCase()})`
    });
  };

  const handleLogout = () => {
    const sessionVulnerability = labState[VULNERABILITY_KEYS.BROKEN_SESSION]?.mode || 'vulnerable';

    if (sessionVulnerability === 'secure') {
      SecurityLabEngine.revokeSessionToken(sessionToken);
      addToast({
        type: 'info',
        title: 'Sesi Diakhiri dengan Aman',
        message: 'Token otorisasi telah dinonaktifkan (Token Revocation List terverifikasi).'
      });
    } else {
      // Sesi tetap aktif di mode rentan
      handleLabExploited(VULNERABILITY_KEYS.BROKEN_SESSION);
      addToast({
        type: 'warning',
        title: 'Kerentanan Sesi Terbuka!',
        message: 'Mode Rentan: Token lama tidak dimasukkan ke blacklist dan masih dapat digunakan!'
      });
    }

    StorageService.addAuditLog(
      'USER_LOGOUT',
      'Portal SIAKAD SSO',
      'SUCCESS',
      `Pengguna @${currentUser?.username} keluar dari portal.`,
      currentUser
    );
    setAuditLogs(StorageService.getAuditLogs());

    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    setSessionToken('jwt_simulated_token_' + Date.now());

    StorageService.addAuditLog(
      'USER_LOGIN',
      'Portal SIAKAD SSO',
      'SUCCESS',
      `Otentikasi sukses untuk @${user.username} (${user.role}).`,
      user
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Content Handlers
  const handleAddSubmission = (newSub) => {
    const updated = [newSub, ...submissions];
    setSubmissions(updated);
    StorageService.saveSubmissions(updated);

    StorageService.addAuditLog(
      'ASSIGNMENT_UPLOAD',
      `Tugas Mahasiswa: ${newSub.fileName}`,
      'SUCCESS',
      `Mahasiswa ${newSub.mahasiswaNama} mengunggah berkas (${newSub.fileSize}).`,
      currentUser
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleUpdateGrade = (updatedGrade) => {
    const updated = grades.map((g) => (g.id === updatedGrade.id ? updatedGrade : g));
    setGrades(updated);
    StorageService.saveGrades(updated);

    StorageService.addAuditLog(
      'GRADE_SUBMIT',
      `Nilai ${updatedGrade.courseKode} - ${updatedGrade.mahasiswaNama}`,
      'SUCCESS',
      `Nilai Akhir: ${updatedGrade.nilaiAkhir} (${updatedGrade.huruf}).`,
      currentUser
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleAddAssignment = (newAsg) => {
    const updated = [newAsg, ...assignments];
    setAssignments(updated);
    StorageService.saveAssignments(updated);
  };

  const handleGradeSubmission = (submissionId, score, feedback) => {
    const updated = submissions.map((s) => {
      if (s.id === submissionId) {
        return {
          ...s,
          nilai: score,
          feedback: feedback,
          status: 'dinilai'
        };
      }
      return s;
    });
    setSubmissions(updated);
    StorageService.saveSubmissions(updated);
  };

  const handleAddDiscussion = (newDisc) => {
    const updated = [newDisc, ...discussions];
    setDiscussions(updated);
    StorageService.saveDiscussions(updated);
  };

  const handleAddReply = (discussionId, newReply) => {
    const updated = discussions.map((d) => {
      if (d.id === discussionId) {
        return {
          ...d,
          balasan: [...(d.balasan || []), newReply]
        };
      }
      return d;
    });
    setDiscussions(updated);
    StorageService.saveDiscussions(updated);
  };

  // User Management Handlers (Admin)
  const handleAddUser = (newUser) => {
    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    StorageService.saveUsers(updated);

    StorageService.addAuditLog(
      'USER_ROLE_VERIFY',
      `Pendaftaran Akun: @${newUser.username}`,
      'SUCCESS',
      `Administrator mendaftarkan akun baru ${newUser.nama} (${newUser.role}).`,
      currentUser
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleUpdateUser = (updatedUser) => {
    const updated = allUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setAllUsers(updated);
    StorageService.saveUsers(updated);
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId) => {
    const updated = allUsers.filter((u) => u.id !== userId);
    setAllUsers(updated);
    StorageService.saveUsers(updated);
  };

  // Reset Semua Data Kampus Sintetis ke Awal
  const handleFullReset = () => {
    StorageService.resetToDefaults();
    SecurityLabEngine.resetProgress();
    setAllUsers(StorageService.getUsers());
    setCourses(StorageService.getCourses());
    setGrades(StorageService.getGrades());
    setAssignments(StorageService.getAssignments());
    setSubmissions(StorageService.getSubmissions());
    setDiscussions(StorageService.getDiscussions());
    setAuditLogs(StorageService.getAuditLogs());
    setLabState(SecurityLabEngine.getState());
    setCurrentUser(StorageService.getUsers().find((u) => u.username === 'mhs_arya'));
    setActiveTab('dashboard');

    addToast({
      type: 'info',
      title: 'Database Sintetis Direset',
      message: 'Seluruh akun, nilai, tugas, dan progres latihan telah dikembalikan ke kondisi awal.'
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Floating Glassmorphism Navbar matching specific guidelines */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLabDrawer={() => setIsLabDrawerOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        onQuickSwitchUser={handleQuickSwitchUser}
        allUsers={allUsers}
        labState={labState}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser ? (
          <>
            {/* Tampilan Berdasarkan Peran & Tab */}
            {activeTab === 'dashboard' && currentUser.role === 'mahasiswa' && (
              <StudentDashboard
                currentUser={currentUser}
                grades={grades}
                assignments={assignments}
                submissions={submissions}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'dashboard' && currentUser.role === 'dosen' && (
              <LecturerDashboard
                currentUser={currentUser}
                courses={courses}
                grades={grades}
                assignments={assignments}
                submissions={submissions}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'dashboard' && currentUser.role === 'admin' && (
              <AdminDashboard
                currentUser={currentUser}
                allUsers={allUsers}
                auditLogs={auditLogs}
                labState={labState}
                onNavigate={setActiveTab}
              />
            )}

            {/* Tab KHS & Nilai */}
            {activeTab === 'grades' && currentUser.role === 'mahasiswa' && (
              <StudentGrades
                currentUser={currentUser}
                grades={grades}
                allUsers={allUsers}
                labState={labState}
                onLabExploited={handleLabExploited}
              />
            )}

            {activeTab === 'grades' && currentUser.role !== 'mahasiswa' && (
              <GradeManagement
                currentUser={currentUser}
                courses={courses}
                grades={grades}
                onUpdateGrade={handleUpdateGrade}
              />
            )}

            {/* Tab Tugas Kuliah */}
            {activeTab === 'assignments' && currentUser.role === 'mahasiswa' && (
              <StudentAssignments
                currentUser={currentUser}
                assignments={assignments}
                submissions={submissions}
                onAddSubmission={handleAddSubmission}
                labState={labState}
                onLabExploited={handleLabExploited}
              />
            )}

            {activeTab === 'assignments' && currentUser.role !== 'mahasiswa' && (
              <AssignmentManagement
                currentUser={currentUser}
                courses={courses}
                assignments={assignments}
                submissions={submissions}
                onAddAssignment={handleAddAssignment}
                onGradeSubmission={handleGradeSubmission}
              />
            )}

            {/* Tab Admin Pengguna & Audit */}
            {activeTab === 'users' && (
              <UserManagement
                currentUser={currentUser}
                allUsers={allUsers}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {activeTab === 'audit' && (
              <AuditLogViewer auditLogs={auditLogs} onClearLogs={() => setAuditLogs([])} />
            )}

            {/* Tab Forum Diskusi */}
            {activeTab === 'forum' && (
              <DiscussionForum
                currentUser={currentUser}
                courses={courses}
                discussions={discussions}
                onAddDiscussion={handleAddDiscussion}
                onAddReply={handleAddReply}
                labState={labState}
                onLabExploited={handleLabExploited}
              />
            )}
          </>
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Sesi Portal Belum Terautentikasi</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Silakan klik tombol di bawah untuk masuk menggunakan akun demo sintetis Mahasiswa, Dosen, atau Administrator.
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Buka Form Login</span>
            </button>
          </div>
        )}
      </main>

      {/* Modern Glassmorphic Footer */}
      <footer className="mt-auto border-t border-white/50 bg-white/30 backdrop-blur-md py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <GraduationCap className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              SIAKAD Prime © 2026 Institut Sains dan Teknologi Nusantara. Seluruh akun dan data 100% sintetis untuk latihan.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFullReset}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/60 hover:bg-white text-slate-600 border border-white/80 transition-colors shadow-xs"
              title="Kembalikan semua data dan nilai ke keadaan default"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset Database Sintetis</span>
            </button>
          </div>
        </div>
      </footer>

      {/* CyberLab Drawer Companion */}
      <SecurityLabDrawer
        isOpen={isLabDrawerOpen}
        onClose={() => setIsLabDrawerOpen(false)}
        labState={labState}
        onToggleMode={handleToggleLabMode}
        onSetAllModes={handleSetAllLabModes}
        onResetProgress={handleResetLabProgress}
        onSimulateAction={handleSimulateAction}
        onCopyPayload={handleCopyPayload}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        allUsers={allUsers}
        onLoginSuccess={handleLoginSuccess}
        labState={labState}
        onLabExploited={handleLabExploited}
      />

      {/* User Profile & Security Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onUpdateCurrentUser={setCurrentUser}
          labState={labState}
          onLabExploited={handleLabExploited}
          sessionToken={sessionToken}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CampusPortalApp />
    </ToastProvider>
  );
}
