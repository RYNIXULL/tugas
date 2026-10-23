import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Search,
  Filter,
  Edit3,
  CheckCircle2,
  Save,
  MessageSquareQuote,
  Printer,
  ChevronDown
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const GradeManagement = ({
  currentUser,
  courses,
  grades,
  onUpdateGrade
}) => {
  const { addToast } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGrade, setEditingGrade] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form input state
  const [formTugas, setFormTugas] = useState(80);
  const [formUts, setFormUts] = useState(80);
  const [formUas, setFormUas] = useState(80);
  const [formFeedback, setFormFeedback] = useState('');

  // Filter nilai berdasarkan dosen
  const myCourses = courses.filter((c) => c.dosenId === currentUser.id);
  const myCourseIds = myCourses.map((c) => c.id);

  // Ambil data nilai
  const filteredGrades = grades.filter((g) => {
    const isMyCourse = currentUser.role === 'admin' ? true : myCourseIds.includes(g.courseId);
    const matchesCourse = selectedCourseId === 'all' ? true : g.courseId === selectedCourseId;
    const matchesSearch =
      g.mahasiswaNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.nim.includes(searchQuery) ||
      g.courseKode.toLowerCase().includes(searchQuery.toLowerCase());
    return isMyCourse && matchesCourse && matchesSearch;
  });

  const handleOpenEdit = (grade) => {
    setEditingGrade(grade);
    setFormTugas(grade.tugas);
    setFormUts(grade.uts);
    setFormUas(grade.uas);
    setFormFeedback(grade.feedback || '');
    setIsEditModalOpen(true);
  };

  const calculateGradeAttributes = (tugas, uts, uas) => {
    const finalScore = Number((tugas * 0.3 + uts * 0.3 + uas * 0.4).toFixed(1));
    let letter = 'E';
    let weight = 0.0;

    if (finalScore >= 85) {
      letter = 'A';
      weight = 4.0;
    } else if (finalScore >= 80) {
      letter = 'A-';
      weight = 3.75;
    } else if (finalScore >= 75) {
      letter = 'B+';
      weight = 3.25;
    } else if (finalScore >= 70) {
      letter = 'B';
      weight = 3.0;
    } else if (finalScore >= 65) {
      letter = 'B-';
      weight = 2.75;
    } else if (finalScore >= 60) {
      letter = 'C+';
      weight = 2.25;
    } else if (finalScore >= 55) {
      letter = 'C';
      weight = 2.0;
    } else if (finalScore >= 40) {
      letter = 'D';
      weight = 1.0;
    }

    return {
      finalScore,
      letter,
      weight,
      status: finalScore >= 55 ? 'Lulus' : 'Tidak Lulus'
    };
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!editingGrade) return;

    const { finalScore, letter, weight, status } = calculateGradeAttributes(
      Number(formTugas),
      Number(formUts),
      Number(formUas)
    );

    const updated = {
      ...editingGrade,
      tugas: Number(formTugas),
      uts: Number(formUts),
      uas: Number(formUas),
      nilaiAkhir: finalScore,
      huruf: letter,
      bobot: weight,
      status,
      feedback: formFeedback
    };

    onUpdateGrade(updated);
    setIsEditModalOpen(false);

    addToast({
      type: 'success',
      title: 'Nilai Berhasil Disimpan',
      message: `Nilai ${editingGrade.mahasiswaNama} pada ${editingGrade.courseNama} telah diperbarui (Nilai Akhir: ${finalScore} - ${letter}).`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50">
              Evaluasi & Asesmen
            </span>
            <span className="text-xs text-slate-500 font-medium">Semester Genap 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            Manajemen Penilaian Mahasiswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Input dan perbarui nilai komponen Tugas (30%), UTS (30%), UAS (40%), serta berikan feedback konstruktif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'Ekspor Rekap',
                message: 'Mengunduh rekapitulasi nilai kelas dalam format spreadsheet Excel/CSV.'
              });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white/60 text-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Ekspor Rekap Nilai</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/60">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama mahasiswa atau NIM..."
              className="w-full glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800"
            />
          </div>

          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="glass-input rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="all">Semua Mata Kuliah Diampu</option>
            {myCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.kode} — {c.nama}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Ditemukan: <span className="text-indigo-600">{filteredGrades.length}</span> Data Nilai
        </span>
      </div>

      {/* Tabel Penilaian */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-xs border border-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Mahasiswa</th>
                <th className="py-3 px-4">Mata Kuliah</th>
                <th className="py-3 px-4 text-center">Tugas (30%)</th>
                <th className="py-3 px-4 text-center">UTS (30%)</th>
                <th className="py-3 px-4 text-center">UAS (40%)</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Huruf</th>
                <th className="py-3 px-4 text-center">Bobot</th>
                <th className="py-3 px-4">Feedback Dosen</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{grade.mahasiswaNama}</p>
                    <p className="text-[10px] font-mono text-slate-500">NIM: {grade.nim}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 max-w-xs">
                    <span className="font-mono text-indigo-600 text-[11px] block">{grade.courseKode}</span>
                    <span className="truncate block">{grade.courseNama}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{grade.tugas}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{grade.uts}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{grade.uas}</td>
                  <td className="py-3.5 px-4 text-center font-black text-slate-900 text-sm">
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
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                    {grade.bobot.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-600 italic max-w-xs truncate">
                    {grade.feedback ? `"${grade.feedback}"` : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(grade)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Input / Ubah</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input & Edit Nilai */}
      {editingGrade && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Beri Nilai: ${editingGrade.mahasiswaNama}`}
          icon={Award}
        >
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/50 text-xs">
              <span className="font-bold text-indigo-900">Mata Kuliah:</span>{' '}
              <span className="text-indigo-800">{editingGrade.courseNama} ({editingGrade.courseKode})</span>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                NIM: {editingGrade.nim} • Bobot: 3 SKS
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nilai Tugas (30%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formTugas}
                  onChange={(e) => setFormTugas(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-bold text-center text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nilai UTS (30%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formUts}
                  onChange={(e) => setFormUts(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-bold text-center text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nilai UAS (40%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formUas}
                  onChange={(e) => setFormUas(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-bold text-center text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Live calculation preview */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-semibold">Simulasi Nilai Akhir:</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-800 text-sm">
                  {(formTugas * 0.3 + formUts * 0.3 + formUas * 0.4).toFixed(1)}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                  {calculateGradeAttributes(Number(formTugas), Number(formUts), Number(formUas)).letter}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan / Feedback Konstruktif:
              </label>
              <textarea
                value={formFeedback}
                onChange={(e) => setFormFeedback(e.target.value)}
                rows={3}
                placeholder="Tuliskan evaluasi pemahaman materi atau arahan perbaikan..."
                className="w-full glass-input rounded-xl p-3 text-xs text-slate-800 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
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
