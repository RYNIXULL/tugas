import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  UserCheck,
  ShieldAlert,
  Bug,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { SecurityLabEngine, VULNERABILITY_KEYS } from '../../services/securityLabEngine';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const LoginModal = ({
  isOpen,
  onClose,
  allUsers,
  onLoginSuccess,
  labState,
  onLabExploited
}) => {
  const { addToast } = useToast();
  const [username, setUsername] = useState('mhs_arya');
  const [password, setPassword] = useState('password_arya_123');
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const sqliMode = labState[VULNERABILITY_KEYS.SQLI]?.mode || 'vulnerable';
  const bruteMode = labState[VULNERABILITY_KEYS.BRUTE_FORCE]?.mode || 'vulnerable';

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Evaluasi Rate Limiting (Brute Force)
    const rateLimit = SecurityLabEngine.evaluateLoginRateLimit(username || 'anon');
    if (!rateLimit.allowed) {
      setErrorMessage(rateLimit.message);
      addToast({
        type: 'error',
        title: 'Akun Terkunci (Rate Limit Aktif)',
        message: rateLimit.message
      });
      return;
    }

    if (rateLimit.isRateLimitWarning && bruteMode === 'vulnerable') {
      onLabExploited(VULNERABILITY_KEYS.BRUTE_FORCE);
      addToast({
        type: 'warning',
        title: 'Kerentanan Brute Force Terpicu!',
        message: `Percobaan login ke-${rateLimit.count} diterima tanpa mekanisme penguncian/CAPTCHA!`
      });
    }

    // Evaluasi SQL Injection Login
    const loginResult = SecurityLabEngine.evaluateSqlLogin(username, password, allUsers);

    if (loginResult.success) {
      SecurityLabEngine.resetFailedLogins(username);
      setFailedAttempts(0);

      if (loginResult.isSqliBypass) {
        onLabExploited(VULNERABILITY_KEYS.SQLI);
        addToast({
          type: 'warning',
          title: 'SQL Injection Bypass Berhasil!',
          message: `Otentikasi dilewati menggunakan payload SQL! Masuk sebagai "${loginResult.user.nama}" (${loginResult.user.role}).`
        });
      } else {
        addToast({
          type: 'success',
          title: 'Autentikasi Berhasil',
          message: `Selamat datang kembali, ${loginResult.user.nama}!`
        });
      }

      onLoginSuccess(loginResult.user);
      onClose();
    } else {
      setFailedAttempts((prev) => prev + 1);
      setErrorMessage(loginResult.message);
      addToast({
        type: 'error',
        title: 'Gagal Masuk',
        message: loginResult.message
      });
    }
  };

  const handleQuickFill = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setErrorMessage('');
  };

  const handleInjectSqliPayload = () => {
    setUsername("' OR '1'='1' --");
    setPassword('sembarang');
    setErrorMessage('');
    addToast({
      type: 'info',
      title: 'Payload SQLi Dimuat',
      message: "Payload `' OR '1'='1' --` telah diisikan ke kolom username."
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Masuk ke Portal Akademik SIAKAD"
      icon={UserCheck}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Lab Vulnerability Badges Header */}
        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Latihan Keamanan Login:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  sqliMode === 'vulnerable'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                SQLi: {sqliMode === 'vulnerable' ? 'Rentan' : 'Aman'}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  bruteMode === 'vulnerable'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                Rate Limit: {bruteMode === 'vulnerable' ? 'Tanpa Batas' : 'Terkunci'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-amber-200/50">
            <span className="text-[11px] text-amber-900">Uji Bypass Otentikasi:</span>
            <button
              type="button"
              onClick={handleInjectSqliPayload}
              className="px-2 py-0.5 rounded-lg bg-amber-200/70 hover:bg-amber-300/80 text-amber-950 font-mono text-[10px] font-bold transition-colors flex items-center gap-1"
            >
              <Bug className="w-3 h-3 text-amber-800" />
              <span>Injeksi SQLi (' OR '1'='1' --)</span>
            </button>
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Pengguna (NIM / NIP / Username):
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: mhs_arya atau ' OR '1'='1' --"
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi..."
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Verifikasi & Masuk Portal</span>
          </button>
        </form>

        {/* Quick Fill Akun Demo */}
        <div className="pt-2 border-t border-slate-200/60 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Akun Latihan Sintetis Siap Pakai:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill(allUsers.find((u) => u.username === 'mhs_arya'))}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[10px] font-bold text-center transition-all truncate border border-slate-200/70"
            >
              Mhs: Arya
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(allUsers.find((u) => u.username === 'dsn_hendra'))}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[10px] font-bold text-center transition-all truncate border border-slate-200/70"
            >
              Dosen: Dr. Hendra
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(allUsers.find((u) => u.username === 'admin_teguh'))}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[10px] font-bold text-center transition-all truncate border border-slate-200/70"
            >
              Admin: Teguh
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
