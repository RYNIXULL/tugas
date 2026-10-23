import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  FileCheck2,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  Send,
  MessagesSquare
} from 'lucide-react';

export const LecturerDashboard = ({
  currentUser,
  courses,
  grades,
  assignments,
  submissions,
  onNavigate
}) => {
  // Mata kuliah yang diampu dosen yang aktif
  const myCourses = courses.filter((c) => c.dosenId === currentUser.id);
  const myAssignments = assignments.filter((a) => a.dosenId === currentUser.id);
  const pendingSubmissions = submissions.filter(
    (s) => s.status === 'menunggu_penilaian' && myAssignments.some((a) => a.id === s.assignmentId)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/50 text-indigo-700 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Portal Dosen Pengampu — Semester Genap 2026/2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Selamat Datang, {currentUser.nama}
            </h1>
            <p className="text-sm text-slate-600">
              NIP: <span className="font-mono font-bold text-slate-800">{currentUser.nip}</span> •{' '}
              <span className="font-semibold text-slate-800">{currentUser.prodi}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('grades')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Input Nilai Mahasiswa</span>
            </button>
            <button
              onClick={() => onNavigate('assignments')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white/60 text-slate-700 font-semibold text-xs shadow-xs transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Periksa Tugas ({pendingSubmissions.length} Menunggu)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Mata Kuliah Diampu</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/50">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {myCourses.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Kelas Aktif</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Beban SKS: {myCourses.reduce((a, c) => a + c.sks, 0)} SKS</p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tugas Menunggu Dinilai</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {pendingSubmissions.length}
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              Perlu Dinilai
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Dari total {submissions.length} pengumpulan</p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Tugas Diterbitkan</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/50">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {myAssignments.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Tugas Perkuliahan</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Status: Terjadwal
          </p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ruang & Laboratorium</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/50">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 truncate">
            {currentUser.ruangKerja || 'Lab Cyber Security'}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Status Jam Kantor: Aktif (08:00 - 17:00)</p>
        </div>
      </div>

      {/* Grid: Kelas yang Diampu & Pengumpulan Tugas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kelas Diampu */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Mata Kuliah Semester Ini</h2>
            </div>
            <button
              onClick={() => onNavigate('grades')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>Buka Rekap Nilai</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/60 space-y-2 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                      {course.kode} • {course.sks} SKS
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-1">{course.nama}</h4>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">{course.jadwal}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{course.deskripsi}</p>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2 pt-1 border-t border-slate-100">
                  <span>Lokasi: {course.ruangan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pengumpulan Masuk yang Menunggu Dinilai */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Tugas Masuk Perlu Penilaian</h2>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>Kelola Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {submissions.slice(0, 4).map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/60 flex items-center justify-between transition-all"
              >
                <div className="space-y-0.5 max-w-[65%]">
                  <h4 className="text-xs font-bold text-slate-800">{sub.mahasiswaNama}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">NIM: {sub.nim}</p>
                  <p className="text-[10px] text-indigo-600 font-medium truncate">{sub.fileName}</p>
                </div>
                <div className="text-right">
                  {sub.status === 'dinilai' ? (
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Nilai: {sub.nilai}
                    </span>
                  ) : (
                    <button
                      onClick={() => onNavigate('assignments')}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                    >
                      Beri Nilai
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
