import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/hooks/useApplications';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  applied: { label: 'Applied', className: 'status-applied' },
  shortlisted: { label: 'Shortlisted', className: 'status-shortlisted' },
  interview: { label: 'Interview', className: 'status-interview' },
  selected: { label: 'Selected', className: 'status-selected' },
  rejected: { label: 'Rejected', className: 'status-rejected' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
