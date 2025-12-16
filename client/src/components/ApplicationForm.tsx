import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApplications, Application, ApplicationStatus } from '@/hooks/useApplications';
import { Plus, Pencil } from 'lucide-react';

const applicationSchema = z.object({
  job_title: z.string().min(1, 'Job title is required').max(200),
  company_name: z.string().min(1, 'Company name is required').max(200),
  status: z.enum(['applied', 'shortlisted', 'interview', 'selected', 'rejected']),
  applied_via: z.string().max(100).optional(),
  applied_date: z.string(),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  application?: Application;
  trigger?: React.ReactNode;
}

export function ApplicationForm({ application, trigger }: ApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const { createApplication, updateApplication } = useApplications();

  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      job_title: application?.job_title || '',
      company_name: application?.company_name || '',
      status: (application?.status as ApplicationStatus) || 'applied',
      applied_via: application?.applied_via || '',
      applied_date: application?.applied_date || new Date().toISOString().split('T')[0],
      notes: application?.notes || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (application) {
      await updateApplication.mutateAsync({ id: application.id, ...data });
    } else {
      await createApplication.mutateAsync({
        job_title: data.job_title,
        company_name: data.company_name,
        status: data.status,
        applied_via: data.applied_via,
        applied_date: data.applied_date,
        notes: data.notes,
      });
    }
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {application ? 'Edit Application' : 'Add New Application'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="job_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Google" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="selected">Selected</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="applied_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applied Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="applied_via"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applied Via (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. LinkedIn, Company Website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createApplication.isPending || updateApplication.isPending}>
                {application ? 'Save Changes' : 'Add Application'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditApplicationButton({ application }: { application: Application }) {
  return (
    <ApplicationForm
      application={application}
      trigger={
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      }
    />
  );
}
