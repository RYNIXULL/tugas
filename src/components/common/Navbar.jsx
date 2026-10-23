import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  FileCheck2,
  MessagesSquare,
  Users,
  History,
  LogOut,
  ChevronDown,
  UserCheck,
  Flame,
  Settings2,
  LayoutDashboard
} from 'lucide-react';

export const Navbar = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLabDrawer,
  onOpenLoginModal,
  onOpenProfileModal,
  onLogout,
  onQuickSwitchUser,
  allUsers,
  labState
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuickSwitchOpen, setIsQuickSwitchOpen] = useState(false);

  // Hitung berapa kerentanan lab yang sudah dieksploitasi
  const totalExploited = Object.values(labState || {}).filter((v) => v.exploited).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/40 backdrop-blur-md border-b border-white/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Campus Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-md flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-800">
                  IST Nusantara
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 border border-indigo-200/50">
                  SIAKAD Prime
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Institut Sains & Teknologi Nusantara
              </p>
            </div>
          </div>

          {/* Navigation Links based on role */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1 bg-white/30 backdrop-blur-sm p-1 rounded-2xl border border-white/50 shadow-inner">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Beranda</span>
              </button>

              {currentUser.role === 'mahasiswa' && (
                <>
                  <button
                    onClick={() => setActiveTab('grades')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'grades'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>KHS & Nilai</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'assignments'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Tugas Kuliah</span>
                  </button>
                </>
              )}

              {currentUser.role === 'dosen' && (
                <>
                  <button
                    onClick={() => setActiveTab('grades')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'grades'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Input Nilai</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'assignments'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Kelola Tugas</span>
                  </button>
                </>
              )}

              {currentUser.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'users'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Kelola Pengguna</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'audit'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    <span>Audit Log</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveTab('forum')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'forum'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <MessagesSquare className="w-4 h-4" />
                <span>Forum Diskusi</span>
              </button>
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* CyberLab Practice Hub Trigger */}
            <button
              onClick={onOpenLabDrawer}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 text-amber-900 shadow-xs transition-all duration-200"
              title="Buka Panel Latihan 8 Kerentanan Siber"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold hidden sm:inline">Lab Siber</span>
              <span className="px-1.5 py-0.2 rounded-md bg-amber-200/60 text-amber-950 text-[10px] font-extrabold">
                {totalExploited}/8
              </span>
            </button>

            {/* Quick Role Switcher for seamless testing */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsQuickSwitchOpen(!isQuickSwitchOpen);
                  setIsDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/50 hover:bg-white/70 border border-white/60 text-slate-700 text-xs font-semibold shadow-xs transition-all"
                title="Ganti akun peran sintetis dengan cepat"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden lg:inline">Ganti Akun Demo</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isQuickSwitchOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-modal rounded-2xl shadow-xl py-2 z-50 border border-white/60 animate-toast">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Pilih Akun Sintetis
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto px-1 space-y-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onQuickSwitchUser(user);
                          setIsQuickSwitchOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left text-xs transition-all ${
                          currentUser?.id === user.id
                            ? 'bg-indigo-50/90 text-indigo-900 font-bold'
                            : 'hover:bg-white/60 text-slate-700'
                        }`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.nama}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate text-[11px]">
                            {user.nama}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <span className="capitalize font-medium">{user.role}</span>
                            <span>•</span>
                            <span className="truncate">{user.nim || user.nip}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu or Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsQuickSwitchOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 pl-2 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/60 transition-all shadow-xs"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.nama}
                    </p>
                    <p className="text-[10px] font-medium text-indigo-600 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.nama}
                    className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-modal rounded-2xl shadow-xl py-2 z-50 border border-white/60">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{currentUser.nama}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenProfileModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-600 transition-colors"
                    >
                      <Settings2 className="w-4 h-4 text-slate-400" />
                      <span>Pengaturan Akun & CSRF</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/60 transition-colors border-t border-slate-100/60 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Keluar (Logout Sesi)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Masuk Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
