import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`w-full max-w-full min-w-0 flex flex-col box-border ${className}`}
      style={{
        paddingLeft: 'var(--page-px, 16px)',
        paddingRight: 'var(--page-px, 16px)',
        gap: 'var(--section-gap, 16px)',
      }}
    >
      {children}
    </div>
  );
};
