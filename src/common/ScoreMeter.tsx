import React from 'react';

interface ScoreMeterProps {
  score: number; // 0 to 100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  label = 'Score',
  size = 'md',
  showBar = true,
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  let color = '#dc2626'; // critical
  let badgeCls = 'text-red-700 bg-red-50 border-red-200';

  if (clampedScore >= 80) {
    color = '#16a34a'; // good
    badgeCls = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (clampedScore >= 60) {
    color = '#d97706'; // fair
    badgeCls = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (clampedScore >= 40) {
    color = '#ea580c'; // poor
    badgeCls = 'text-orange-700 bg-orange-50 border-orange-200';
  }

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 text-xs font-mono font-semibold rounded border ${badgeCls}`}>
            {clampedScore}
          </span>
          {showBar && (
              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${clampedScore}%`, backgroundColor: color }}
                />
              </div>
        )}
            </div>
          );
  }

          return (
          <div className="flex flex-col gap-1 min-w-[100px]">
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{label}</span>
                <span className={`font-mono font-semibold px-1.5 py-0.5 rounded border ${badgeCls}`}>
                  {clampedScore}/100
                </span>
            </div>
            {showBar && (
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${clampedScore}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
      )}
              </div>
            );
};
