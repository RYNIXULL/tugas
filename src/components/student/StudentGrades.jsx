import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  FileText,
  Printer,
  ChevronDown,
  Info,
  Bug,
  Search,
  Lock,
  Unlock
} from 'lucide-react';
import { SecurityLabEngine, VULNERABILITY_KEYS } from '../../services/securityLabEngine';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const StudentGrades = ({
  currentUser,
  grades,
  allUsers,
  labState,
  onLabExploited
}) => {
  const { addToast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState(currentUser.id);
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false);
  const [forbiddenMessage, setForbiddenMessage] = useState('');

  // Target data berdasarkan ID yang dipilih
  const targetUser = allUsers.find((u) => u.id === selectedStudentId) || currentUser;
  const filteredGrades = grades.filter((g) => g.mahasiswaId === selectedStudentId);

  // Periksa status mode IDOR
  const idorMode = labState[VULNERABILITY_KEYS.IDOR]?.mode || 'vulnerable';

  // Handle pergantian parameter IDOR
  const handleStudentIdChange = (newId) => {
    // Jalankan evaluasi IDOR dari SecurityLabEngine
    const result = SecurityLabEngine.evaluateIdorAccess(currentUser, newId);

    if (result.allowed) {
      setSelectedStudentId(newId);
      if (result.isIdorBreach) {
        onLabExploited(VULNERABILITY_KEYS.IDOR);
        addToast({
          type: 'warning',
          title: 'Kerentanan IDOR Terpicu!',
          message: `Anda berhasil mengakses lembar KHS milik "${targetUser.nama}" hanya dengan memanipulasi parameter ID!`
        });
      } else {
        addToast({
          type: 'info',
          title: 'KHS Diperbarui',
          message: `Menampilkan lembar hasil studi untuk ${targetUser.nama}.`
        });
      }
    } else {
      // Secure mode blocks unauthorized access
      setForbiddenMessage(result.message);
      setIsForbiddenModalOpen(true);
      addToast({
        type: 'error',
        title: 'Akses Ditolak (403 Forbidden)',
        message: 'Kontrol akses ketat mencegah Anda melihat nilai mahasiswa lain.'
      });
    }
  };

  // Hitung total SKS dan IPK pada KHS yang ditampilkan
  const totalSks = filteredGrades.length * 3; // sintetis
  const totalBobot = filteredGrades.reduce((acc, curr) => acc + curr.bobot * 3, 0);
  const calculatedIpk = totalSks > 0 ? (totalBobot / totalSks).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Header Kartu Hasil Studi */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50">
              Kartu Hasil Studi (KHS)
            </span>
            <span className="text-xs text-slate-500 font-medium">Semester Genap 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            Lembar Penilaian Akademik
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Mahasiswa:{' '}
            <span className="font-bold text-slate-800">{targetUser.nama}</span> (NIM:{' '}
            <span className="font-mono font-bold text-indigo-600">{targetUser.nim}</span>) • Prodi:{' '}
            <span className="font-semibold text-slate-700">{targetUser.prodi}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'Cetak KHS',
                message: 'Menyiapkan berkas cetak KHS resmi bertanda tangan digital QR Code.'
              });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white/60 text-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Cetak KHS (PDF)</span>
          </button>
        </div>
      </div>

      {/* IDOR Security Practice HUD Box */}
      <div className="glass-card rounded-3xl p-5 border border-amber-200/80 bg-amber-50/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-800">
                  Modul Latihan #3: IDOR / Kontrol Akses Lemah
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    idorMode === 'vulnerable'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {idorMode === 'vulnerable' ? 'Mode Rentan' : 'Mode Aman'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Uji apakah akun Anda dapat melihat nilai KHS mahasiswa lain hanya dengan mengganti parameter URL / ID.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
              Parameter ID:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentIdChange(e.target.value)}
              className="glass-input rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer shadow-xs"
            >
              {allUsers
                .filter((u) => u.role === 'mahasiswa')
                .map((mhs) => (
                  <option key={mhs.id} value={mhs.id}>
                    {mhs.nama} ({mhs.nim}) {mhs.id === currentUser.id ? '(Akun Anda)' : ''}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {selectedStudentId !== currentUser.id && idorMode === 'vulnerable' && (
          <div className="p-3 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-900 text-xs flex items-center gap-2 animate-toast">
            <Bug className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="font-semibold">
              Eksploitasi Berhasil! Anda sedang mengintip rekaman akademik privat milik{' '}
              <strong className="underline">{targetUser.nama}</strong> tanpa otorisasi!
            </span>
          </div>
        )}
      </div>

      {/* Tabel KHS & Nilai */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-xs border border-white/60">
        <div className="px-6 py-4 border-b border-slate-200/50 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Daftar Mata Kuliah & Nilai</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total {filteredGrades.length} Mata Kuliah
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Kode MK</th>
                <th className="py-3 px-4">Mata Kuliah</th>
                <th className="py-3 px-4 text-center">Tugas</th>
                <th className="py-3 px-4 text-center">UTS</th>
                <th className="py-3 px-4 text-center">UAS</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Huruf</th>
                <th className="py-3 px-4 text-center">Bobot</th>
                <th className="py-3 px-4">Feedback / Catatan Dosen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                    {grade.courseKode}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 max-w-xs">
                    {grade.courseNama}
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-600">
                    {grade.tugas}
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-600">
                    {grade.uts}
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-600">
                    {grade.uas}
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-900">
                    {grade.nilaiAkhir}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-lg font-black text-xs ${
                        grade.huruf.startsWith('A')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {grade.huruf}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700 font-mono">
                    {grade.bobot.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-600 italic max-w-md">
                    "{grade.feedback}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary IPK */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <div>
              <span>Total SKS Semester: </span>
              <strong className="text-slate-800 font-mono">11 SKS</strong>
            </div>
            <div>
              <span>Status Akademik: </span>
              <strong className="text-emerald-700 font-bold">LULUS / MEMENUHI SYARAT</strong>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">IPK Semester:</span>
            <span className="text-base font-black text-indigo-700 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200">
              {calculatedIpk}
            </span>
          </div>
        </div>
      </div>

      {/* Modal 403 Forbidden saat IDOR di Mode Aman */}
      <Modal
        isOpen={isForbiddenModalOpen}
        onClose={() => setIsForbiddenModalOpen(false)}
        title="403 Akses Ditolak — Otorisasi Gagal"
        variant="danger"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">{forbiddenMessage}</p>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Proteksi RBAC Aktif (Remediated)</span>
            </p>
            <p className="text-[11px] text-emerald-800">
              Server memeriksa kesesuaian <code>session.userId === req.params.student_id</code>{' '}
              sebelum mengembalikan payload data akademik.
            </p>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsForbiddenModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
            >
              Tutup & Kembali
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
