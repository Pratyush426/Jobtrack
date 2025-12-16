import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { useApplications } from '@/hooks/useApplications';
import { Building2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export function RecentApplications() {
  const { applications, isLoading } = useApplications();
  const recentApplications = applications.slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Applications</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/applications" className="flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentApplications.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground mt-2">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{app.job_title}</p>
                    <p className="text-sm text-muted-foreground">{app.company_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={app.status} />
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {format(new Date(app.applied_date), 'MMM d')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
