import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Terminal,
  Clock,
  Printer
} from 'lucide-react';
import { useToast } from '../common/Toast';

export const AuditLogViewer = ({ auditLogs, onClearLogs }) => {
  const { addToast } = useToast();
  const [filterAction, setFilterAction] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = filterAction === 'all' ? true : log.action === filterAction;
    const matchesSearch =
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50">
              Audit Forensik & Rekaman Sistem
            </span>
            <span className="text-xs text-slate-500 font-medium">Log Keamanan Kampus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            System & Security Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Rekaman kronologis transaksi akademik, otentikasi login, pengunggahan berkas, dan otorisasi peran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'Ekspor Audit Log',
                message: 'Mengunduh catatan audit log terenkripsi dalam format JSON forensik.'
              });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white/60 text-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Ekspor Log Forensik</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/60">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari user, IP, atau target log..."
              className="w-full glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="glass-input rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="all">Semua Tipe Aksi</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="GRADE_SUBMIT">GRADE_SUBMIT</option>
            <option value="ASSIGNMENT_UPLOAD">ASSIGNMENT_UPLOAD</option>
            <option value="USER_ROLE_VERIFY">USER_ROLE_VERIFY</option>
            <option value="SECURITY_ALERT">SECURITY_ALERT</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Menampilkan: <span className="text-indigo-600">{filteredLogs.length}</span> Entri Log
        </span>
      </div>

      {/* Tabel Audit Logs */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-xs border border-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Waktu (Timestamp)</th>
                <th className="py-3 px-4">Aksi / Event</th>
                <th className="py-3 px-4">Pengguna (User)</th>
                <th className="py-3 px-4">Alamat IP</th>
                <th className="py-3 px-4">Target Operasi</th>
                <th className="py-3 px-4">Detail Peristiwa</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes('SECURITY')
                          ? 'bg-rose-100 text-rose-800'
                          : log.action.includes('LOGIN')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">@{log.username}</td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">{log.ipAddress}</td>
                  <td className="py-3 px-4 font-sans text-slate-700 font-medium max-w-xs truncate">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 font-sans text-[11px] text-slate-500 max-w-md truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
