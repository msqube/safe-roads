import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface FormPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const FormPageHeader: React.FC<FormPageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  badge,
  actions,
}) => {
  return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
          <div className="space-y-1">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                      {item.href ? (
                        <a
                          href={item.href}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : item.onClick ? (
                        <button
                          onClick={item.onClick}
                          className="hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ) : (
                          <span className={index === breadcrumbs.length - 1 ? 'text-slate-800 font-semibold' : ''}>
                            {item.label}
                          </span>
                )}
                        </React.Fragment>
                      ))}
                    </nav>
                  )}

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
                      {badge}
                    </div>

                    {subtitle && <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">{subtitle}</p>}
                  </div>

                  {actions && (
                      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                        {actions}
                      </div>
      )}
                    </div>
                  );
};
