import React from 'react';

// Card component supporting both light and dark modes
export const Card: React.FC<{ className?: string }> = ({ className, children }) => {
  return (
    <div
      className={`bg-card text-card-foreground border border-border rounded-lg shadow p-4 ${className}`}
    >
      {children}
    </div>
  );
};

// CardHeader component supporting both light and dark modes
export const CardHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

// CardContent component supporting both light and dark modes
export const CardContent: React.FC<{ className?: string }> = ({ className, children }) => {
  return <div className={`text-foreground ${className}`}>{children}</div>;
};
