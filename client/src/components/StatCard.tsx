import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  variant?: 'default' | 'applied' | 'shortlisted' | 'interview' | 'selected' | 'rejected';
  className?: string;
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  applied: 'bg-blue-100 text-blue-600',
  shortlisted: 'bg-purple-100 text-purple-600',
  interview: 'bg-yellow-100 text-yellow-600',
  selected: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
};

export function StatCard({ title, value, icon, variant = 'default', className }: StatCardProps) {
  return (
    <Card className={cn('card-hover', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={cn('p-3 rounded-xl', variantStyles[variant])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
