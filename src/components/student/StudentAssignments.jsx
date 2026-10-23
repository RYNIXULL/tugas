import React, { useState } from 'react';
import {
  FileCheck2,
  UploadCloud,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Bug,
  FileWarning,
  Download,
  Calendar,
  Lock,
  Unlock,
  Plus
} from 'lucide-react';
import { SecurityLabEngine, VULNERABILITY_KEYS } from '../../services/securityLabEngine';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const StudentAssignments = ({
  currentUser,
  assignments,
  submissions,
  onAddSubmission,
  labState,
  onLabExploited
}) => {
  const { addToast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSizeMb, setFileSizeMb] = useState(2.4);
  const [catatan, setCatatan] = useState('');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockMessage, setBlockMessage] = useState('');

  const uploadMode = labState[VULNERABILITY_KEYS.FILE_UPLOAD]?.mode || 'vulnerable';

  const mySubmissions = submissions.filter((s) => s.mahasiswaId === currentUser.id);

  const handleOpenSubmit = (asg) => {
    setSelectedAssignment(asg);
    setFileName(`Tugas_${currentUser.nim}_${asg.judul.slice(0, 15).replace(/\s+/g, '_')}.pdf`);
    setCatatan('');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!fileName) {
      addToast({
        type: 'warning',
        title: 'Berkas Belum Dipilih',
        message: 'Silakan pilih atau ketik nama berkas tugas.'
      });
      return;
    }

    // Evaluasi validasi berkas via SecurityLabEngine
    const ext = fileName.split('.').pop() || '';
    const validation = SecurityLabEngine.evaluateFileUpload(fileName, fileSizeMb, `application/${ext}`);

    if (validation.accepted) {
      const newSub = {
        id: 'sub_' + Date.now(),
        assignmentId: selectedAssignment.id,
        mahasiswaId: currentUser.id,
        mahasiswaNama: currentUser.nama,
        nim: currentUser.nim,
        fileName: fileName,
        fileSize: `${fileSizeMb} MB`,
        fileType: `application/${ext}`,
        uploadedAt: new Date().toISOString(),
        catatan: catatan || 'Tugas telah dikumpulkan via portal mahasiswa.',
        nilai: null,
        status: 'menunggu_penilaian',
        feedback: ''
      };

      onAddSubmission(newSub);
      setIsSubmitModalOpen(false);

      if (validation.isDangerousAccepted) {
        onLabExploited(VULNERABILITY_KEYS.FILE_UPLOAD);
        addToast({
          type: 'warning',
          title: 'Kerentanan Validasi Berkas Berhasil Dieksploitasi!',
          message: `Berkas berbahaya "${fileName}" berhasil diunggah ke server tanpa penyaringan ekstensi!`
        });
      } else {
        addToast({
          type: 'success',
          title: 'Tugas Berhasil Dikumpulkan',
          message: `Berkas "${fileName}" berhasil diunggah untuk ${selectedAssignment.judul}.`
        });
      }
    } else {
      // Secure mode blocked dangerous upload
      setBlockMessage(validation.message);
      setIsBlockModalOpen(true);
      addToast({
        type: 'error',
        title: 'Unggah Berkas Ditolak',
        message: 'Kebijakan keamanan sistem menolak format berkas berbahaya.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Pengumpulan Tugas */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50">
              Portal Tugas Mahasiswa
            </span>
            <span className="text-xs text-slate-500 font-medium">Tahun Akademik 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            Pengumpulan & Evaluasi Tugas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Unggah berkas tugas tepat waktu sesuai spesifikasi masing-masing mata kuliah.
          </p>
        </div>
      </div>

      {/* File Upload Security Practice HUD Box */}
      <div className="glass-card rounded-3xl p-5 border border-amber-200/80 bg-amber-50/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-800">
                  Modul Latihan #6: Validasi Berkas Lemah
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    uploadMode === 'vulnerable'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {uploadMode === 'vulnerable' ? 'Mode Rentan' : 'Mode Aman'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Uji apakah sistem menerima berkas berbahaya seperti <code>shell.php</code>, <code>exploit.sh</code>, atau <code>backdoor.html</code> saat mengunggah tugas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (assignments.length > 0) {
                  setSelectedAssignment(assignments[0]);
                  setFileName('c99_webshell.php');
                  setIsSubmitModalOpen(true);
                  addToast({
                    type: 'info',
                    title: 'Preset Uji Payload Terpasang',
                    message: 'Nama berkas "c99_webshell.php" telah disiapkan untuk pengujian upload.'
                  });
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs transition-colors"
            >
              <Bug className="w-3.5 h-3.5 text-amber-600" />
              <span>Muat Payload Uji (shell.php)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Daftar Tugas Kuliah */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((asg) => {
          const submission = mySubmissions.find((s) => s.assignmentId === asg.id);
          const isSubmitted = !!submission;

          return (
            <div
              key={asg.id}
              className="glass-card rounded-3xl p-6 space-y-4 border border-white/60 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                      {asg.courseNama}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 mt-2 leading-snug">
                      {asg.judul}
                    </h3>
                  </div>
                  {isSubmitted ? (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{submission.status === 'dinilai' ? 'Dinilai' : 'Terkumpul'}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>Belum Kirim</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{asg.deskripsi}</p>

                <div className="p-3 rounded-2xl bg-white/50 border border-white/60 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Dosen Pengampu:</span>
                    <strong className="text-slate-800">{asg.dosenNama}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tenggat Waktu:</span>
                    <strong className="text-slate-800 font-mono">
                      {new Date(asg.deadline).toLocaleString('id-ID')}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Format Diizinkan:</span>
                    <span className="font-mono text-indigo-700 font-semibold">{asg.allowedTypes}</span>
                  </div>
                </div>

                {/* Status Nilai & Feedback jika sudah dinilai */}
                {submission && submission.status === 'dinilai' && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-950">Hasil Penilaian Dosen:</span>
                      <span className="text-base font-black text-indigo-700 font-mono">
                        {submission.nilai} / 100
                      </span>
                    </div>
                    {submission.feedback && (
                      <p className="text-[11px] text-indigo-900 italic mt-1">
                        "{submission.feedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Upload atau Lihat Berkas */}
              <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between gap-3">
                {isSubmitted ? (
                  <div className="text-[11px] text-slate-500 truncate flex-1">
                    Berkas: <span className="font-mono font-semibold text-slate-700">{submission.fileName}</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-rose-600">Tenggat mendekat</span>
                )}

                <button
                  onClick={() => handleOpenSubmit(asg)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isSubmitted
                      ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isSubmitted ? 'Unggah Ulang' : 'Kirim Berkas'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Upload Berkas */}
      {selectedAssignment && (
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title={`Unggah Tugas: ${selectedAssignment.judul.slice(0, 30)}...`}
          icon={UploadCloud}
        >
          <form onSubmit={handleSubmitFile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Berkas / Target File:
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Contoh: laporan_tugas.pdf atau coba payload shell.php"
                className="w-full glass-input rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Uji tipe berkas: <code>.pdf</code>, <code>.docx</code>, <code>.zip</code> (Aman) atau{' '}
                <code>.php</code>, <code>.exe</code>, <code>.sh</code> (Uji Kerentanan).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ukuran Berkas (MB):</label>
                <input
                  type="number"
                  step="0.1"
                  value={fileSizeMb}
                  onChange={(e) => setFileSizeMb(parseFloat(e.target.value) || 1)}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shortcut Payload:</label>
                <button
                  type="button"
                  onClick={() => setFileName('webshell_backdoor.php')}
                  className="w-full py-2 px-2 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors truncate"
                >
                  Gunakan .php
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Pengumpulan (Opsional):
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tuliskan catatan teknis atau tautan repositori..."
                rows={3}
                className="w-full glass-input rounded-xl p-3 text-xs text-slate-800 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Konfirmasi Unggah</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Penolakan Berkas Berbahaya (Mode Aman) */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title="Berkas Ditolak oleh Filter Keamanan"
        variant="danger"
        icon={FileWarning}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">{blockMessage}</p>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Mitigasi Validasi Berkas Berhasil (Remediated)</span>
            </p>
            <p className="text-[11px] text-emerald-800">
              Sistem menerapkan strict whitelist ekstensi (<code>.pdf</code>, <code>.docx</code>, <code>.zip</code>), memeriksa MIME-type, dan membatasi ukuran maksimal berkas.
            </p>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsBlockModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
