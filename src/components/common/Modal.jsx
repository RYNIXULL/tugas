import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  icon: CustomIcon = null,
  variant = 'default'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop with frosted glass effect */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} glass-modal rounded-3xl p-6 shadow-2xl transition-all z-10`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-5">
          <div className="flex items-center gap-3">
            {CustomIcon ? (
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600">
                <CustomIcon className="w-5 h-5" />
              </div>
            ) : variant === 'danger' ? (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100/80 text-rose-600">
                <AlertOctagon className="w-5 h-5" />
              </div>
            ) : variant === 'warning' ? (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100/80 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                <Info className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-800 leading-snug">{title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-colors"
            aria-label="Tutup Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-slate-600 text-sm">{children}</div>
      </div>
    </div>
  );
};
