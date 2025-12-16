import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { StatusBadge } from './StatusBadge';
import { EditApplicationButton } from './ApplicationForm';
import { Application } from '@/hooks/useApplications';
import { Building2, Calendar, ExternalLink, Trash2, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface ApplicationCardProps {
    application: Application;
    onDelete: (id: string) => void;
}

export function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow group relative overflow-hidden ml-1">
            {/* Status Stripe (Optional visual flair) */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${application.status === 'selected' ? 'bg-green-500' :
                    application.status === 'rejected' ? 'bg-red-500' :
                        application.status === 'interview' ? 'bg-purple-500' :
                            application.status === 'shortlisted' ? 'bg-blue-500' :
                                'bg-gray-300'
                }`} />

            <CardHeader className="pb-3 pl-6">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-1" title={application.job_title}>
                            {application.job_title}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Building2 className="h-4 w-4 shrink-0" />
                            <span className="line-clamp-1">{application.company_name}</span>
                        </div>
                    </div>
                    <StatusBadge status={application.status} />
                </div>
            </CardHeader>

            <CardContent className="pb-3 pl-6 text-sm space-y-3">
                {/* Applied Via */}
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-foreground">
                        {application.applied_via || "Unknown Platform"}
                    </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Applied on {format(new Date(application.applied_date), 'MMM d, yyyy')}</span>
                </div>

                {/* Notes Preview (if any) */}
                {application.notes && (
                    <p className="text-muted-foreground/80 italic text-xs line-clamp-2 mt-2 border-l-2 pl-2 border-muted">
                        "{application.notes}"
                    </p>
                )}
            </CardContent>

            <CardFooter className="pt-3 pl-6 border-t bg-muted/20 flex justify-between items-center">
                <div className="text-xs text-muted-foreground font-mono">
                    ID: {application.id.slice(-4)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <EditApplicationButton application={application} />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this application for{' '}
                                    <strong>{application.job_title}</strong> at{' '}
                                    <strong>{application.company_name}</strong>? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => onDelete(application.id)}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardFooter>
        </Card>
    );
}
