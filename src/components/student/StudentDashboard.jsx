import React from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileCheck2,
  Bell,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const StudentDashboard = ({
  currentUser,
  grades,
  assignments,
  submissions,
  onNavigate
}) => {
  // Hitung data akademik sintetis
  const studentGrades = grades.filter((g) => g.mahasiswaId === currentUser.id);
  const mySubmissions = submissions.filter((s) => s.mahasiswaId === currentUser.id);
  const pendingAssignments = assignments.filter((a) => {
    return !mySubmissions.some((s) => s.assignmentId === a.id);
  });

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner with Glassmorphism */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/50 text-indigo-700 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Tahun Akademik 2026/2027 — Semester Genap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Selamat Datang, {currentUser.nama}
            </h1>
            <p className="text-sm text-slate-600 max-w-xl">
              NIM: <span className="font-mono font-bold text-slate-800">{currentUser.nim}</span> • Program Studi:{' '}
              <span className="font-semibold text-slate-800">{currentUser.prodi}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('grades')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Lihat KHS & Nilai</span>
            </button>
            <button
              onClick={() => onNavigate('assignments')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white/60 text-slate-700 font-semibold text-xs shadow-xs transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Unggah Tugas ({pendingAssignments.length} Aktif)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* IPK */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Indeks Prestasi Kumulatif</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/50">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {currentUser.ipk || 3.82}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Skala 4.00
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Predikat: Dengan Pujian (Cumlaude)</p>
        </div>

        {/* Total SKS */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total SKS Tempuh</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/50">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {currentUser.sksLulus || 114}
            </span>
            <span className="text-xs font-medium text-slate-500">dari 144 SKS</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Semester {currentUser.semester || 6} Reguler</p>
        </div>

        {/* Tugas Kuliah Aktif */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tugas Belum Dikirim</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {pendingAssignments.length}
            </span>
            <span className="text-xs font-medium text-rose-600">Perlu Dikumpulkan</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Tenggat terdekat: 25 Oktober 2026</p>
        </div>

        {/* Status Dosen Pembimbing */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Dosen Pembimbing Akademik</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/50">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block truncate">
              {currentUser.dosenWali || 'Dr. Ir. Hendra Kusuma, M.Kom.'}
            </span>
            <span className="text-[10px] text-slate-500">KRS Disetujui & Valid</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Status: Terverifikasi
          </p>
        </div>
      </div>

      {/* Grid: Ringkasan Nilai KHS Terbaru & Tugas Aktif */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KHS Ringkas */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Ringkasan Nilai KHS</h2>
            </div>
            <button
              onClick={() => onNavigate('grades')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>Lihat Detail KHS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {studentGrades.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/60 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 px-1.5 py-0.5 rounded bg-indigo-50">
                    {item.courseKode}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{item.courseNama}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Nilai Akhir: {item.nilaiAkhir}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.huruf}
                  </span>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">
                    Bobot {item.bobot.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tugas Kuliah Aktif */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Tugas Perkuliahan</h2>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>Semua Tugas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {assignments.slice(0, 3).map((asg) => {
              const sub = mySubmissions.find((s) => s.assignmentId === asg.id);
              return (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/60 flex items-center justify-between transition-all"
                >
                  <div className="space-y-1 max-w-[70%]">
                    <span className="text-[10px] font-medium text-slate-500">
                      {asg.courseNama}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate">{asg.judul}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Tenggat: {new Date(asg.deadline).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  <div>
                    {sub ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.status === 'dinilai' ? `Nilai: ${sub.nilai}` : 'Terkirim'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Belum Kirim
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
