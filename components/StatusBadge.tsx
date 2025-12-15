import React from 'react';
import { VehicleStatus } from '../types';

interface StatusBadgeProps {
  status: VehicleStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-600';
  let dotColor = 'bg-gray-400';

  switch (status) {
    case VehicleStatus.ACTIVE:
      bgColor = 'bg-emerald-100';
      textColor = 'text-emerald-700';
      dotColor = 'bg-emerald-500';
      break;
    case VehicleStatus.BUSY:
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-700';
      dotColor = 'bg-orange-500';
      break;
    case VehicleStatus.OFFLINE:
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-600';
      dotColor = 'bg-gray-500';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${bgColor} ${textColor}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
