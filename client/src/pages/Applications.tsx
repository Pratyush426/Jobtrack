import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ApplicationForm } from '@/components/ApplicationForm';
import { ApplicationCard } from '@/components/ApplicationCard';
import { useApplications } from '@/hooks/useApplications';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Applications() {
  const { applications, isLoading, deleteApplication } = useApplications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter Logic
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job_title.toLowerCase().includes(search.toLowerCase()) ||
      app.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      <main className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Applications
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Track your journey to your dream job.
            </p>
          </div>
          <ApplicationForm />
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row gap-4 bg-muted/30 p-4 rounded-xl border backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background/50 border-muted-foreground/20 focus:bg-background transition-colors"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-background/50 border-muted-foreground/20">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="selected">Selected</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3 p-4 border rounded-xl">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-4 flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed rounded-2xl bg-muted/10">
            <div className="bg-muted p-4 rounded-full">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">No applications found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-1">
                {applications.length === 0
                  ? "You haven't added any applications yet. Click 'Add Application' to get started!"
                  : "No matches found for your current search filters."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onDelete={(id) => deleteApplication.mutate(id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
