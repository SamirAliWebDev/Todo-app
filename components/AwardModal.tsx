import React from 'react';
import { TrophyIcon } from './Icons';

interface AwardModalProps {
  onClose: () => void;
  title: string;
  message: string;
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const AwardModal: React.FC<AwardModalProps> = ({ onClose, title, message }) => {
    // Generate some confetti pieces with random properties
    const confetti = Array.from({ length: 50 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animation: `confetti-fall ${1 + Math.random() * 2}s ${Math.random() * 2}s linear infinite`,
            backgroundColor: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'][Math.floor(Math.random() * 4)], // Gold/amber tones
            transform: `rotate(${Math.random() * 360}deg)`,
        };
        return <ConfettiPiece key={i} style={style} />;
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm modal-enter"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti}
        </div>
      <div
        className="modal-content relative w-full max-w-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 -mt-20 mb-6 shadow-lg">
            <TrophyIcon className="h-16 w-16 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-amber-500/40"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default AwardModal;