import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  Copy,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Bug,
  Lock,
  Unlock,
  KeyRound,
  FileCode,
  UserCog,
  RefreshCw
} from 'lucide-react';
import { VULNERABILITY_KEYS } from '../../services/securityLabEngine';

export const SecurityLabDrawer = ({
  isOpen,
  onClose,
  labState,
  onToggleMode,
  onSetAllModes,
  onResetProgress,
  onSimulateAction,
  onCopyPayload
}) => {
  const [activeTabId, setActiveTabId] = useState(VULNERABILITY_KEYS.SQLI);

  if (!isOpen) return null;

  const vulnList = Object.values(labState || {});
  const currentVuln = labState[activeTabId] || vulnList[0];
  const exploitedCount = vulnList.filter((v) => v.exploited).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl border-l border-white/60 shadow-2xl h-full flex flex-col z-10 overflow-hidden animate-toast">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/60 bg-gradient-to-r from-indigo-50/80 via-white/80 to-blue-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                  Laboratorium Keamanan Siber
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {exploitedCount}/8 Teruji
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Simulasi Latihan 8 Vektor Kerentanan Web Terapan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetProgress}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white/80 rounded-xl transition-all border border-slate-200/60 text-xs flex items-center gap-1 font-medium"
              title="Reset Semua Progres Latihan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Security Mode Switcher Bar */}
        <div className="px-5 py-2.5 bg-slate-100/60 border-b border-slate-200/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Preset Konfigurasi Lab:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetAllModes('vulnerable')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/70 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Unlock className="w-3 h-3 text-rose-500" />
              <span>Semua Mode Rentan</span>
            </button>
            <button
              onClick={() => onSetAllModes('secure')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Semua Mode Aman</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Sidebar list + Detail View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Mini List */}
          <div className="w-1/3 border-r border-slate-200/60 overflow-y-auto bg-slate-50/50 p-2 space-y-1">
            {vulnList.map((vuln, idx) => {
              const isSelected = vuln.id === activeTabId;
              return (
                <button
                  key={vuln.id}
                  onClick={() => setActiveTabId(vuln.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-white shadow-sm border-indigo-200/80 text-indigo-950 font-bold'
                      : 'hover:bg-white/60 border-transparent text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">0{idx + 1}</span>
                    {vuln.exploited ? (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                        <Bug className="w-2.5 h-2.5 text-amber-600" /> Teruji
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-400">Belum</span>
                    )}
                  </div>
                  <span className="truncate leading-tight text-[11px]">{vuln.title}</span>
                  <div className="flex items-center gap-1 text-[9px] mt-0.5">
                    {vuln.mode === 'vulnerable' ? (
                      <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                        <Unlock className="w-2.5 h-2.5" /> Rentan
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Aman
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {currentVuln && (
              <>
                {/* Title & Status */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                      {currentVuln.category}
                    </span>
                    <button
                      onClick={() => onToggleMode(currentVuln.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                        currentVuln.mode === 'vulnerable'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title="Klik untuk beralih antara Mode Rentan dan Mode Aman"
                    >
                      {currentVuln.mode === 'vulnerable' ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-rose-600" />
                          <span>Mode: Rentan (Vulnerable)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Mode: Aman (Remediated)</span>
                        </>
                      )}
                    </button>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    {currentVuln.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {currentVuln.description}
                  </p>
                </div>

                {/* Skenario Aplikasi */}
                <div className="glass-card rounded-2xl p-4 space-y-2 border border-slate-200/60">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-indigo-600" />
                    <span>Lokasi Skenario di Portal</span>
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {currentVuln.scenario}
                  </p>
                  <div className="text-[11px] font-mono bg-slate-900 text-slate-200 p-2 rounded-xl flex items-center justify-between overflow-x-auto">
                    <span>{currentVuln.targetEndpoint}</span>
                  </div>
                </div>

                {/* Payload & Petunjuk Eksploitasi */}
                <div className="glass-card rounded-2xl p-4 space-y-3 border border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-amber-600" />
                      <span>Contoh Payload / Kode Uji</span>
                    </h4>
                    <button
                      onClick={() => onCopyPayload(currentVuln.payloadExample)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin Payload</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 text-amber-300 font-mono text-xs p-3 rounded-xl break-all">
                    {currentVuln.payloadExample}
                  </div>

                  {/* Tombol Aksi Langsung Simulasi */}
                  <div className="pt-2">
                    <button
                      onClick={() => onSimulateAction(currentVuln.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>Jalankan Simulasi Uji Kerentanan Ini</span>
                    </button>
                  </div>
                </div>

                {/* Log Eksploitasi Terakhir */}
                {currentVuln.exploited && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <Bug className="w-4 h-4 text-amber-600" />
                      <span>Kerentanan Telah Terbukti Berhasil Dieksploitasi</span>
                    </div>
                    {currentVuln.lastExploitDetails && (
                      <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                        {currentVuln.lastExploitDetails}
                      </p>
                    )}
                    {currentVuln.lastExploitTime && (
                      <p className="text-[10px] text-amber-700 font-mono">
                        Waktu: {new Date(currentVuln.lastExploitTime).toLocaleTimeString('id-ID')}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon
function PlayIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
