import React from 'react';
import { getConditionColor } from './commonTheme';
import { PavementCondition, SurveyStatus } from '../models/surveyModels';

interface StatusBadgeProps {
  condition?: PavementCondition | string;
  status?: SurveyStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ condition, status, size = 'sm' }) => {
  if (condition) {
    const colors = getConditionColor(condition);
    const sizeCls = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${colors.bg} ${colors.border} ${colors.text} ${sizeCls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        {condition}
      </span>
    );
  }

  if (status) {
    let bg = 'bg-slate-100 border-slate-200 text-slate-700';
    let dot = 'bg-slate-400';

    switch (status) {
      case 'Pending Review':
        bg = 'bg-blue-50 border-blue-200 text-blue-700';
        dot = 'bg-blue-500';
        break;
      case 'Assigned':
        bg = 'bg-amber-50 border-amber-200 text-amber-700';
        dot = 'bg-amber-500';
        break;
      case 'Ignored':
      case 'Check Later':
        bg = 'bg-slate-100 border-slate-200 text-slate-600';
        dot = 'bg-slate-400';
        break;
      case 'Repaired':
        bg = 'bg-emerald-50 border-emerald-200 text-emerald-700';
        dot = 'bg-emerald-500';
        break;
    }

    const sizeCls = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${bg} ${sizeCls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {status}
      </span>
    );
  }

  return null;
};
