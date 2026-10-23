import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Clock,
  Download,
  CheckCircle,
  FileText,
  Calendar,
  AlertCircle,
  UserCheck,
  Send,
  Save
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const AssignmentManagement = ({
  currentUser,
  courses,
  assignments,
  submissions,
  onAddAssignment,
  onGradeSubmission
}) => {
  const { addToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  // Form Buat Tugas Baru
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || '');
  const [newDeadline, setNewDeadline] = useState('2026-11-05T23:59');
  const [newDesc, setNewDesc] = useState('');
  const [newAllowedTypes, setNewAllowedTypes] = useState('.pdf, .docx, .zip');

  // Form Nilai Pengumpulan
  const [subScore, setSubScore] = useState(85);
  const [subFeedback, setSubFeedback] = useState('');

  const myCourses = courses.filter((c) => c.dosenId === currentUser.id);
  const myAssignments = assignments.filter((a) => a.dosenId === currentUser.id);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast({
        type: 'warning',
        title: 'Judul Tugas Diperlukan',
        message: 'Silakan isi judul tugas perkuliahan.'
      });
      return;
    }

    const targetCourse = courses.find((c) => c.id === newCourseId) || courses[0];

    const newAsg = {
      id: 'asg_' + Date.now(),
      courseId: targetCourse.id,
      courseNama: targetCourse.nama,
      judul: newTitle,
      deskripsi: newDesc,
      deadline: newDeadline,
      dosenId: currentUser.id,
      dosenNama: currentUser.nama,
      allowedTypes: newAllowedTypes,
      maxSizeMb: 15,
      status: 'aktif'
    };

    onAddAssignment(newAsg);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');

    addToast({
      type: 'success',
      title: 'Tugas Kuliah Diterbitkan',
      message: `Tugas "${newTitle}" berhasil dipublikasikan untuk mahasiswa kelas ${targetCourse.nama}.`
    });
  };

  const handleOpenGradeSub = (sub) => {
    setSelectedSubmission(sub);
    setSubScore(sub.nilai || 85);
    setSubFeedback(sub.feedback || 'Tugas telah dievaluasi sesuai rubrik penilaian.');
    setIsGradeModalOpen(true);
  };

  const handleSaveSubGrade = (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    onGradeSubmission(selectedSubmission.id, Number(subScore), subFeedback);
    setIsGradeModalOpen(false);

    addToast({
      type: 'success',
      title: 'Penilaian Berhasil Disimpan',
      message: `Tugas milik ${selectedSubmission.mahasiswaNama} berhasil dinilai (${subScore}/100).`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50">
              Pengelolaan Tugas Kuliah
            </span>
            <span className="text-xs text-slate-500 font-medium">Portal Dosen Pengampu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            Tugas & Berkas Mahasiswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Terbitkan instruksi tugas kuliah baru dan evaluasi berkas yang dikumpulkan mahasiswa.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* Tabs / Sub-Sections: Pengumpulan Berkas Masuk */}
      <div className="glass-card rounded-3xl p-6 space-y-4 border border-white/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Daftar Berkas Tugas yang Dikumpulkan Mahasiswa
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total {submissions.length} Pengumpulan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Mahasiswa</th>
                <th className="py-3 px-4">Nama Berkas</th>
                <th className="py-3 px-4">Waktu Unggah</th>
                <th className="py-3 px-4">Ukuran</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Nilai</th>
                <th className="py-3 px-4 text-right">Aksi Penilaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{sub.mahasiswaNama}</p>
                    <p className="text-[10px] font-mono text-slate-500">NIM: {sub.nim}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-indigo-700">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-xs">{sub.fileName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(sub.uploadedAt).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{sub.fileSize}</td>
                  <td className="py-3.5 px-4 text-center">
                    {sub.status === 'dinilai' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Dinilai
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Menunggu
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">
                    {sub.nilai !== null ? sub.nilai : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenGradeSub(sub)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-colors"
                    >
                      {sub.status === 'dinilai' ? 'Ubah Nilai' : 'Beri Nilai'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Terbitkan Tugas Baru */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Terbitkan Tugas Perkuliahan Baru"
        icon={Plus}
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mata Kuliah:</label>
            <select
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              required
            >
              {myCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.kode} — {c.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tugas:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Tugas 3: Desain Arsitektur Sistem Terdistribusi"
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tenggat Waktu:</label>
              <input
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Format Berkas:</label>
              <input
                type="text"
                value={newAllowedTypes}
                onChange={(e) => setNewAllowedTypes(e.target.value)}
                placeholder=".pdf, .docx, .zip"
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Rubrik:</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Jelaskan instruksi tugas, deliverables, dan kriteria penilaian..."
              rows={3}
              className="w-full glass-input rounded-xl p-3 text-xs text-slate-800 resize-none"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publikasikan Tugas</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Evaluasi Pengumpulan Mahasiswa */}
      {selectedSubmission && (
        <Modal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          title={`Evaluasi Tugas: ${selectedSubmission.mahasiswaNama}`}
          icon={FileCheck2}
        >
          <form onSubmit={handleSaveSubGrade} className="space-y-4">
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/50 text-xs space-y-1">
              <p>
                <strong className="text-indigo-900">Berkas Dikirim:</strong>{' '}
                <span className="font-mono text-indigo-700">{selectedSubmission.fileName}</span> (
                {selectedSubmission.fileSize})
              </p>
              <p>
                <strong className="text-indigo-900">Catatan Mahasiswa:</strong>{' '}
                <span className="text-slate-600 italic">"{selectedSubmission.catatan}"</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nilai Tugas (Skala 0 - 100):
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={subScore}
                onChange={(e) => setSubScore(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 text-center text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Dosen:</label>
              <textarea
                value={subFeedback}
                onChange={(e) => setSubFeedback(e.target.value)}
                rows={3}
                className="w-full glass-input rounded-xl p-3 text-xs text-slate-800 resize-none"
                placeholder="Berikan umpan balik terhadap ketepatan analisis mahasiswa..."
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsGradeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Penilaian</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
