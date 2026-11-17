export const commonTheme = {
  colors: {
    // Google Palette
    googleBlue: '#1a73e8',
    googleRed: '#ea4335',
    googleYellow: '#fbbc04',
    googleGreen: '#34a853',
    primary: '#1a73e8', // Google Blue
    primaryHover: '#1557b0',
    secondary: '#5f6368', // Google Grey
    background: '#f8f9fa', // Google Page Light Grey
    surface: '#ffffff', // Google Pure White
    border: '#dadce0', // Google Border
    borderMedium: '#bdc1c6',
    text: '#202124', // Google Dark Slate
    textMuted: '#5f6368', // Google Muted
    textDim: '#80868b',

    good: '#34a853', // Google Green
    fair: '#fbbc04', // Google Yellow
    poor: '#ea580c', // Google Amber/Orange
    critical: '#ea4335', // Google Red
  },
} as const;

export function getConditionColor(condition: string) {
  switch (condition?.toLowerCase()) {
    case 'good':
      return {
        bg: 'bg-emerald-50',
        border: 'border-[#34a853]/30',
        text: 'text-[#137333]',
        dot: 'bg-[#34a853]',
        badgeBg: '#e6f4ea',
        badgeText: '#137333',
      };
    case 'fair':
      return {
        bg: 'bg-amber-50',
        border: 'border-[#fbbc04]/40',
        text: 'text-[#b06000]',
        dot: 'bg-[#fbbc04]',
        badgeBg: '#fef7e0',
        badgeText: '#b06000',
      };
    case 'poor':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        dot: 'bg-orange-500',
        badgeBg: '#feefe3',
        badgeText: '#c5221f',
      };
    case 'critical':
      return {
        bg: 'bg-red-50',
        border: 'border-[#ea4335]/30',
        text: 'text-[#c5221f]',
        dot: 'bg-[#ea4335]',
        badgeBg: '#fce8e6',
        badgeText: '#c5221f',
      };
    default:
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        text: 'text-slate-700',
        dot: 'bg-slate-400',
        badgeBg: '#f1f3f4',
        badgeText: '#3c4043',
      };
  }
}
