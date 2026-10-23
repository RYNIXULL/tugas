import React from 'react';
import {
  ShieldAlert,
  Users,
  History,
  GraduationCap,
  Server,
  Activity,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Lock
} from 'lucide-react';

export const AdminDashboard = ({
  currentUser,
  allUsers,
  auditLogs,
  labState,
  onNavigate
}) => {
  const mhsCount = allUsers.filter((u) => u.role === 'mahasiswa').length;
  const dsnCount = allUsers.filter((u) => u.role === 'dosen').length;
  const admCount = allUsers.filter((u) => u.role === 'admin').length;
  const exploitedCount = Object.values(labState || {}).filter((v) => v.exploited).length;

  return (
    <div className="space-y-6">
      {/* Banner Administrator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/50 text-indigo-700 text-xs font-semibold">
              <Server className="w-3.5 h-3.5" />
              <span>Pusat Kendali Administrasi & Keamanan Sistem Informasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Panel Administrator Utama
            </h1>
            <p className="text-sm text-slate-600">
              Admin: <span className="font-bold text-slate-800">{currentUser.nama}</span> • Divisi:{' '}
              <span className="font-semibold text-slate-800">{currentUser.prodi}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('users')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Kelola Akun Pengguna</span>
            </button>
            <button
              onClick={() => onNavigate('audit')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white/60 text-slate-700 font-semibold text-xs shadow-xs transition-all"
            >
              <History className="w-4 h-4 text-indigo-600" />
              <span>Lihat Audit Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pengguna Terdaftar</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/50">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {allUsers.length}
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
              {mhsCount} Mhs / {dsnCount} Dosen
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{admCount} Super Administrator</p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Status Lab Keamanan Siber</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/50">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {exploitedCount} / 8
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Vektor Teruji
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Modul Simulasi OWASP Top 10</p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rekaman Audit Log</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/50">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {auditLogs.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Aktivitas</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Audit Forensik Aktif
          </p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kesehatan Server Database</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-emerald-700">99.98% Normal</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Latensi Respon API: 14ms</p>
        </div>
      </div>

      {/* Grid: Pengguna Terdaftar & Audit Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ringkasan Akun */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Daftar Akun Pengguna</h2>
            </div>
            <button
              onClick={() => onNavigate('users')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>Kelola Semua Pengguna</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {allUsers.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="p-3.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/60 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.nama}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{user.nama}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {user.nim ? `NIM: ${user.nim}` : `NIP: ${user.nip}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : user.role === 'dosen'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {user.role}
                  </span>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Status: Aktif</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Terkini */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <History className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Aktivitas Audit Log Terkini</h2>
            </div>
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>Buka Log Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/60 space-y-1 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800">{log.target}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{log.details}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5 font-mono">
                  <span>User: @{log.username}</span>
                  <span>•</span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
