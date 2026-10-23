import React, { useState } from 'react';
import {
  MessagesSquare,
  MessageCircle,
  Plus,
  Send,
  ShieldAlert,
  Bug,
  CheckCircle,
  User,
  Clock,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { SecurityLabEngine, VULNERABILITY_KEYS } from '../../services/securityLabEngine';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const DiscussionForum = ({
  currentUser,
  courses,
  discussions,
  onAddDiscussion,
  onAddReply,
  labState,
  onLabExploited
}) => {
  const { addToast } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [activeDiscussionId, setActiveDiscussionId] = useState(discussions[0]?.id || null);
  const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);

  // Form Buat Thread Baru
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || '');
  const [newContent, setNewContent] = useState('');

  // Form Balas Thread
  const [replyText, setReplyText] = useState('');

  const xssMode = labState[VULNERABILITY_KEYS.XSS]?.mode || 'vulnerable';

  const filteredDiscussions = discussions.filter((d) => {
    return selectedCourseId === 'all' ? true : d.courseId === selectedCourseId;
  });

  const activeDiscussion =
    discussions.find((d) => d.id === activeDiscussionId) || filteredDiscussions[0];

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      addToast({
        type: 'warning',
        title: 'Form Belum Lengkap',
        message: 'Mohon isi judul dan pertanyaan diskusi.'
      });
      return;
    }

    // Evaluasi Stored XSS
    const xssEval = SecurityLabEngine.sanitizeOrExposeXss(newContent);

    const targetCourse = courses.find((c) => c.id === newCourseId) || courses[0];

    const newDisc = {
      id: 'dsc_' + Date.now(),
      courseId: targetCourse.id,
      courseNama: targetCourse.nama,
      judul: newTitle,
      isi: xssEval.renderedHtml,
      penulisId: currentUser.id,
      penulisNama: currentUser.nama,
      penulisRole: currentUser.role,
      avatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
      balasan: []
    };

    onAddDiscussion(newDisc);
    setIsNewThreadModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setActiveDiscussionId(newDisc.id);

    if (xssEval.hasXssDetected && xssMode === 'vulnerable') {
      onLabExploited(VULNERABILITY_KEYS.XSS);
      addToast({
        type: 'warning',
        title: 'Kerentanan Stored XSS Berhasil Dijalankan!',
        message: 'Payload JavaScript berbahaya berhasil disimpan ke basis data forum tanpa sanitasi!'
      });
    } else {
      addToast({
        type: 'success',
        title: 'Topik Diskusi Dibuat',
        message: 'Pertanyaan atau materi diskusi berhasil dipublikasikan ke forum.'
      });
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeDiscussion) return;

    // Evaluasi Stored XSS pada balasan
    const xssEval = SecurityLabEngine.sanitizeOrExposeXss(replyText);

    const newReply = {
      id: 'rep_' + Date.now(),
      penulisId: currentUser.id,
      penulisNama: currentUser.nama,
      penulisRole: currentUser.role,
      avatar: currentUser.avatar,
      isi: xssEval.renderedHtml,
      createdAt: new Date().toISOString()
    };

    onAddReply(activeDiscussion.id, newReply);
    setReplyText('');

    if (xssEval.hasXssDetected && xssMode === 'vulnerable') {
      onLabExploited(VULNERABILITY_KEYS.XSS);
      addToast({
        type: 'warning',
        title: 'Kerentanan Stored XSS Ditemukan!',
        message: 'Payload tersimpan dan akan dieksekusi saat pengguna lain membaca balasan forum ini.'
      });
    } else {
      addToast({
        type: 'success',
        title: 'Tanggapan Terkirim',
        message: 'Komentar Anda telah diposting ke forum diskusi.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Forum */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50">
              Forum Akademik & Kolaborasi
            </span>
            <span className="text-xs text-slate-500 font-medium">Interaksi Mahasiswa & Dosen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            Ruang Diskusi Perkuliahan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Wadah bertukar gagasan, konsultasi materi tugas, dan klarifikasi topik kuliah secara interaktif.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsNewThreadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Topik Diskusi Baru</span>
          </button>
        </div>
      </div>

      {/* Stored XSS Security Practice HUD Box */}
      <div className="glass-card rounded-3xl p-5 border border-amber-200/80 bg-amber-50/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-800">
                  Modul Latihan #2: Stored XSS (Cross-Site Scripting)
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    xssMode === 'vulnerable'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {xssMode === 'vulnerable' ? 'Mode Rentan' : 'Mode Aman'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Uji apakah teks komentar forum dieksekusi sebagai HTML/JavaScript mentah (dangerouslySetInnerHTML) atau disanitasi ketat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setReplyText(`<img src=x onerror="alert('Stored XSS Terdeteksi di Forum!')" /> Halo rekan-rekan`);
                addToast({
                  type: 'info',
                  title: 'Payload XSS Disiapkan',
                  message: 'Contoh skrip XSS telah dimasukkan ke kotak balasan di bawah.'
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs transition-colors"
            >
              <Bug className="w-3.5 h-3.5 text-amber-600" />
              <span>Muat Payload XSS ke Komentar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Forum Layout: Thread List + Active Thread View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Daftar Thread */}
        <div className="glass-card rounded-3xl p-5 space-y-4 border border-white/60">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Daftar Topik Perkuliahan
            </h3>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="glass-input rounded-xl px-2 py-1 text-xs font-semibold text-slate-700 max-w-[150px]"
            >
              <option value="all">Semua Mata Kuliah</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.kode}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredDiscussions.map((disc) => {
              const isSelected = activeDiscussion?.id === disc.id;
              return (
                <button
                  key={disc.id}
                  onClick={() => setActiveDiscussionId(disc.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-white shadow-sm border-indigo-200/80'
                      : 'hover:bg-white/60 border-transparent'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {disc.courseNama}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5 leading-snug line-clamp-2">
                    {disc.judul}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-medium">
                    <span className="truncate max-w-[120px]">{disc.penulisNama}</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-slate-400" />
                      {disc.balasan?.length || 0}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Detail Diskusi & Balasan */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-6 border border-white/60 flex flex-col justify-between">
          {activeDiscussion ? (
            <div className="space-y-6">
              {/* Thread Header */}
              <div className="space-y-3 pb-5 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-700 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                    {activeDiscussion.courseNama}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(activeDiscussion.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>

                <h2 className="text-lg font-extrabold text-slate-800 leading-snug">
                  {activeDiscussion.judul}
                </h2>

                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={activeDiscussion.avatar}
                    alt={activeDiscussion.penulisNama}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {activeDiscussion.penulisNama}
                    </p>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                      {activeDiscussion.penulisRole}
                    </span>
                  </div>
                </div>

                {/* Isi Thread (Render HTML / Text dengan indikator keamanan) */}
                <div className="p-4 rounded-2xl bg-white/70 border border-white/70 text-xs text-slate-700 leading-relaxed font-sans mt-3">
                  {xssMode === 'vulnerable' ? (
                    <div dangerouslySetInnerHTML={{ __html: activeDiscussion.isi }} />
                  ) : (
                    <div>{activeDiscussion.isi}</div>
                  )}
                </div>
              </div>

              {/* Daftar Balasan Komentar */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                  <span>Tanggapan & Diskusi ({activeDiscussion.balasan?.length || 0})</span>
                </h4>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {activeDiscussion.balasan && activeDiscussion.balasan.length > 0 ? (
                    activeDiscussion.balasan.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-3.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/60 space-y-2 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={rep.avatar}
                              alt={rep.penulisNama}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800">
                                {rep.penulisNama}
                              </span>
                              <span className="ml-2 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {rep.penulisRole}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(rep.createdAt).toLocaleTimeString('id-ID')}
                          </span>
                        </div>

                        {/* Rendering balasan XSS */}
                        <div className="text-xs text-slate-700 pl-9 font-sans leading-relaxed">
                          {xssMode === 'vulnerable' ? (
                            <div dangerouslySetInnerHTML={{ __html: rep.isi }} />
                          ) : (
                            <div>{rep.isi}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2">
                      Belum ada tanggapan untuk topik ini. Jadilah yang pertama memberikan pendapat!
                    </p>
                  )}
                </div>
              </div>

              {/* Form Input Balasan Komentar */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-200/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis tanggapan teknis atau uji skrip XSS..."
                    className="flex-1 glass-input rounded-2xl px-4 py-2.5 text-xs text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Pilih salah satu topik diskusi untuk membaca dan berpartisipasi.
            </div>
          )}
        </div>
      </div>

      {/* Modal Thread Baru */}
      <Modal
        isOpen={isNewThreadModalOpen}
        onClose={() => setIsNewThreadModalOpen(false)}
        title="Mulai Topik Diskusi Perkuliahan Baru"
        icon={Plus}
      >
        <form onSubmit={handleCreateThread} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mata Kuliah:</label>
            <select
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.kode} — {c.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Topik:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Diskusi Penanganan SQL Injection pada Multi-tenant Database"
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Uraian Pertanyaan / Materi:
            </label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Tuliskan ulasan materi atau uji payload..."
              rows={4}
              className="w-full glass-input rounded-xl p-3 text-xs text-slate-800 resize-none font-sans"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewThreadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Publikasikan Diskusi</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
