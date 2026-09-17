import React from 'react';
import { CrowdRisk } from '../../types';

interface CrowdBadgeProps {
  level: CrowdRisk | string;
  density?: number;
  showPercent?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CrowdBadge: React.FC<CrowdBadgeProps> = ({
  level,
  density,
  showPercent = true,
  className = '',
  size = 'md'
}) => {
  const normLevel = level.toUpperCase();

  let bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let dotClass = 'bg-emerald-500';
  let label = 'LOW CROWD';

  if (normLevel === 'CRITICAL' || (density !== undefined && density > 80)) {
    bgClass = 'bg-rose-100 text-rose-800 border-rose-400 font-semibold';
    dotClass = 'bg-rose-600 animate-ping';
    label = 'CRITICAL SURGE';
  } else if (normLevel === 'HIGH' || (density !== undefined && density > 60)) {
    bgClass = 'bg-amber-100 text-amber-900 border-amber-400 font-medium';
    dotClass = 'bg-amber-500';
    label = 'HIGH CROWD';
  } else if (normLevel === 'MODERATE' || (density !== undefined && density > 30)) {
    bgClass = 'bg-blue-50 text-blue-800 border-blue-300';
    dotClass = 'bg-blue-500';
    label = 'MODERATE';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 space-x-1.5',
    lg: 'text-sm sm:text-base px-3 py-1.5 space-x-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${sizeClasses[size]} ${bgClass} ${className}`}
    >
      <span className={`h-2 w-2 rounded-full inline-block ${dotClass}`} />
      <span>{label}</span>
      {showPercent && density !== undefined && (
        <span className="opacity-80 font-mono">({density}%)</span>
      )}
    </span>
  );
};
