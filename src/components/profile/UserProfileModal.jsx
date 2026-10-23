import React, { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  ShieldAlert,
  Bug,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Mail,
  Fingerprint
} from 'lucide-react';
import { SecurityLabEngine, VULNERABILITY_KEYS } from '../../services/securityLabEngine';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const UserProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  labState,
  onLabExploited,
  sessionToken
}) => {
  const { addToast } = useToast();
  const [nama, setNama] = useState(currentUser.nama || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [bio, setBio] = useState(currentUser.bio || '');

  // Form Ubah Password
  const [newPassword, setNewPassword] = useState('');

  // Eskalasi Hak Akses simulation checkbox
  const [injectAdminRole, setInjectAdminRole] = useState(false);

  // CSRF token simulation
  const [includeCsrfToken, setIncludeCsrfToken] = useState(true);

  const csrfMode = labState[VULNERABILITY_KEYS.CSRF]?.mode || 'vulnerable';
  const privEscMode = labState[VULNERABILITY_KEYS.PRIV_ESC]?.mode || 'vulnerable';
  const sessionMode = labState[VULNERABILITY_KEYS.BROKEN_SESSION]?.mode || 'vulnerable';

  if (!isOpen) return null;

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // Evaluasi Eskalasi Hak Akses (Privilege Escalation)
    const updatePayload = {
      nama,
      email,
      bio,
      ...(injectAdminRole ? { role: 'admin' } : {})
    };

    const privResult = SecurityLabEngine.evaluatePrivilegeEscalation(currentUser, updatePayload);

    if (privResult.allowed) {
      const updatedUser = {
        ...currentUser,
        nama,
        email,
        bio,
        role: privResult.updatedRole
      };

      onUpdateCurrentUser(updatedUser);

      if (privResult.isPrivEscExploited) {
        onLabExploited(VULNERABILITY_KEYS.PRIV_ESC);
        addToast({
          type: 'warning',
          title: 'Eskalasi Hak Akses Berhasil Dieksploitasi!',
          message: `Akun Anda berhasil naik status menjadi Administrator via parameter mass assignment!`
        });
      } else {
        addToast({
          type: 'success',
          title: 'Profil Berhasil Diperbarui',
          message: 'Data akun Anda telah disimpan.'
        });
      }
      onClose();
    } else {
      addToast({
        type: 'error',
        title: 'Eskalasi Hak Akses Ditolak',
        message: privResult.message
      });
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    // Evaluasi CSRF
    const headers = includeCsrfToken ? { 'X-CSRF-Token': 'csrf_token_secret_valid' } : {};
    const csrfResult = SecurityLabEngine.evaluateCsrfAction(headers, 'csrf_token_secret_valid');

    if (csrfResult.success) {
      const updatedUser = { ...currentUser, password: newPassword };
      onUpdateCurrentUser(updatedUser);

      // Evaluasi Sesi Pasca Ganti Sandi (Broken Session)
      if (sessionMode === 'secure') {
        SecurityLabEngine.revokeSessionToken(sessionToken);
      }

      setNewPassword('');

      if (csrfResult.isCsrfExploit) {
        onLabExploited(VULNERABILITY_KEYS.CSRF);
        addToast({
          type: 'warning',
          title: 'Kerentanan CSRF Berhasil Dieksploitasi!',
          message: 'Kata sandi berhasil diubah tanpa verifikasi token Anti-CSRF!'
        });
      } else {
        addToast({
          type: 'success',
          title: 'Kata Sandi Diperbarui',
          message: 'Kata sandi akun Anda berhasil diganti dengan aman.'
        });
      }
    } else {
      addToast({
        type: 'error',
        title: 'Permintaan Ditolak (Proteksi CSRF)',
        message: csrfResult.message
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Akun & Keamanan Sesi"
      icon={Fingerprint}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Lab Info Badges */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Vektor Kerentanan Akun:</span>
            </span>
            <div className="flex items-center gap-1.5 text-[9px] font-bold">
              <span
                className={`px-1.5 py-0.5 rounded ${
                  csrfMode === 'vulnerable' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                CSRF: {csrfMode === 'vulnerable' ? 'Rentan' : 'Aman'}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded ${
                  privEscMode === 'vulnerable' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                PrivEsc: {privEscMode === 'vulnerable' ? 'Rentan' : 'Aman'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Halaman ini memungkinkan simulasi <strong>CSRF</strong> (ganti sandi tanpa token),{' '}
            <strong>Eskalasi Hak Akses</strong> (injeksi role admin), dan status <strong>Sesi Token</strong>.
          </p>
        </div>

        {/* Form Profil & Simulasi Eskalasi Hak Akses */}
        <form onSubmit={handleUpdateProfile} className="space-y-3.5 pb-5 border-b border-slate-200/60">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Informasi Profil & Otoritas</span>
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap:</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Surel Kampus:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Peran Saat Ini:</label>
              <div className="glass-input rounded-xl px-3 py-2 text-xs font-bold capitalize text-indigo-700 bg-white/70">
                {currentUser.role}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bio Akademik:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full glass-input rounded-xl p-3 text-xs text-slate-800 resize-none"
            />
          </div>

          {/* Eksploitasi Eskalasi Hak Akses Checkbox */}
          {currentUser.role !== 'admin' && (
            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/80 space-y-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={injectAdminRole}
                  onChange={(e) => setInjectAdminRole(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1">
                  <Bug className="w-3.5 h-3.5 text-rose-600" />
                  <span>Uji Eskalasi Hak Akses: Sisipkan parameter <code>{`{ "role": "admin" }`}</code></span>
                </span>
              </label>
              <p className="text-[10px] text-rose-700 pl-6">
                Pada Mode Rentan, server menerima pembaruan atribut role tanpa validasi hak administratif.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Simpan Perubahan Profil
            </button>
          </div>
        </form>

        {/* Form Ganti Kata Sandi & Simulasi CSRF */}
        <form onSubmit={handleChangePassword} className="space-y-3.5">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Ganti Kata Sandi & Uji Kerentanan CSRF</span>
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Baru:</label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan sandi baru..."
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono"
              required
            />
          </div>

          {/* Opsi Token CSRF */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!includeCsrfToken}
                onChange={(e) => setIncludeCsrfToken(!e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-800">
                Kirim Permintaan TANPA Header <code>X-CSRF-Token</code> (Simulasi Serangan CSRF)
              </span>
            </label>
            <p className="text-[10px] text-slate-500 pl-6">
              Jika dicentang, request tidak menyertakan token Anti-CSRF untuk menguji apakah endpoint rentan terhadap eksploitasi pihak ketiga.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Ganti Kata Sandi</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
