import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Mail,
  UserCheck
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const UserManagement = ({
  currentUser,
  allUsers,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    role: 'mahasiswa',
    identifier: '', // NIM or NIP
    prodi: 'S1 Teknik Informatika',
    email: '',
    password: ''
  });

  const [newPassword, setNewPassword] = useState('');

  // Filtered list
  const filteredUsers = allUsers.filter((u) => {
    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    const matchesSearch =
      u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nim && u.nim.includes(searchQuery)) ||
      (u.nip && u.nip.includes(searchQuery)) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      nama: '',
      username: '',
      role: 'mahasiswa',
      identifier: '',
      prodi: 'S1 Teknik Informatika',
      email: '',
      password: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.username) {
      addToast({
        type: 'warning',
        title: 'Form Belum Lengkap',
        message: 'Silakan isi nama dan nama pengguna.'
      });
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      username: formData.username.toLowerCase().trim(),
      password: formData.password || 'password123',
      nama: formData.nama,
      role: formData.role,
      nim: formData.role === 'mahasiswa' ? formData.identifier || '2026' + Math.floor(100000 + Math.random() * 900000) : null,
      nip: formData.role !== 'mahasiswa' ? formData.identifier || '1990' + Math.floor(1000000000 + Math.random() * 9000000000) : null,
      prodi: formData.prodi,
      fakultas: 'Fakultas Ilmu Komputer & Rekayasa',
      email: formData.email || `${formData.username}@istn.ac.id`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Akun sintetis terdaftar pada sistem portal akademik.',
      status: 'aktif',
      ipk: 3.50,
      sksLulus: 90,
      semester: 6
    };

    onAddUser(newUser);
    setIsAddModalOpen(false);

    addToast({
      type: 'success',
      title: 'Pengguna Baru Berhasil Dibuat',
      message: `Akun sintetis ${newUser.nama} (${newUser.role}) telah didaftarkan ke sistem.`
    });
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      nama: user.nama,
      username: user.username,
      role: user.role,
      identifier: user.nim || user.nip || '',
      prodi: user.prodi,
      email: user.email,
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updated = {
      ...selectedUser,
      nama: formData.nama,
      role: formData.role,
      prodi: formData.prodi,
      email: formData.email
    };

    onUpdateUser(updated);
    setIsEditModalOpen(false);

    addToast({
      type: 'success',
      title: 'Profil Pengguna Diperbarui',
      message: `Perubahan data untuk ${selectedUser.nama} berhasil disimpan.`
    });
  };

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated = { ...user, status: nextStatus };
    onUpdateUser(updated);

    addToast({
      type: 'info',
      title: 'Status Akun Diubah',
      message: `Akun ${user.nama} sekarang berstatus: ${nextStatus.toUpperCase()}.`
    });
  };

  const handleOpenResetPass = (user) => {
    setSelectedUser(user);
    setNewPassword('password_baru_2026');
    setIsResetPassModalOpen(true);
  };

  const handleSaveResetPass = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updated = { ...selectedUser, password: newPassword };
    onUpdateUser(updated);
    setIsResetPassModalOpen(false);

    addToast({
      type: 'success',
      title: 'Kata Sandi Direset',
      message: `Kata sandi untuk ${selectedUser.nama} berhasil diatur ulang.`
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    onDeleteUser(selectedUser.id);
    setIsDeleteModalOpen(false);

    addToast({
      type: 'info',
      title: 'Akun Dihapus',
      message: `Akun sintetis ${selectedUser.nama} telah dihapus dari sistem.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50">
              Manajemen Pengguna & Otoritas
            </span>
            <span className="text-xs text-slate-500 font-medium">Panel Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            Kelola Akun Mahasiswa, Dosen & Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Data pengguna sintetis untuk simulasi otentikasi peran bertingkat (RBAC).
          </p>
        </div>

        <div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/60">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIM, NIP, atau username..."
              className="w-full glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="glass-input rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">Semua Peran (Role)</option>
            <option value="mahasiswa">Mahasiswa S1</option>
            <option value="dosen">Dosen Pengampu</option>
            <option value="admin">Administrator PTIK</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Total: <span className="text-indigo-600 font-extrabold">{filteredUsers.length}</span> Akun
        </span>
      </div>

      {/* Tabel Pengguna */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-xs border border-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">NIM / NIP</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Program Studi</th>
                <th className="py-3 px-4">Surel (Email)</th>
                <th className="py-3 px-4 text-center">Status Akun</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.nama}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{user.nama}</p>
                        <p className="text-[10px] text-slate-400 font-mono">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                    {user.nim || user.nip || '-'}
                  </td>
                  <td className="py-3.5 px-4">
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
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600 truncate max-w-xs">
                    {user.prodi}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-xs">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        user.status === 'aktif'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {user.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Ubah Data & Peran"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenResetPass(user)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                        title="Reset Kata Sandi"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pengguna Baru */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Daftarkan Pengguna Sintetis Baru"
        icon={UserPlus}
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar:</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Muhammad Farhan Alfarizi, S.Kom."
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Username Login:</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="mhs_farhan"
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Peran Akses (Role):</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
              >
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIM / NIP Sintetis:</label>
              <input
                type="text"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="2026081099"
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi:</label>
              <input
                type="text"
                value={formData.prodi}
                onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                placeholder="S1 Teknik Informatika"
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Awal:</label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Default: password123"
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Simpan Akun</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Role & Data */}
      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Ubah Pengguna: ${selectedUser.nama}`}
          icon={Edit2}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap:</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Peran Hak Akses:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-bold text-indigo-700"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Surel Resmi:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
                />
              </div>
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
                <CheckCircle className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Reset Password */}
      {selectedUser && (
        <Modal
          isOpen={isResetPassModalOpen}
          onClose={() => setIsResetPassModalOpen(false)}
          title={`Reset Kata Sandi: ${selectedUser.nama}`}
          icon={KeyRound}
        >
          <form onSubmit={handleSaveResetPass} className="space-y-4">
            <p className="text-xs text-slate-600">
              Masukkan kata sandi baru untuk akun pengguna <strong>@{selectedUser.username}</strong>:
            </p>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono"
              required
            />
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetPassModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Atur Ulang Sandi
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus */}
      {selectedUser && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={`Hapus Pengguna: ${selectedUser.nama}?`}
          variant="danger"
          icon={Trash2}
        >
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus akun sintetis ini? Tindakan ini akan menghapus data
              login dan riwayat profil secara permanen di database lokal.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
