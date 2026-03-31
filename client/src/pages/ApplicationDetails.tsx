import { useState } from 'react';
import { ArrowLeft, Calendar, Building2, Briefcase, User, Printer, Download, CheckCircle, Clock, XCircle, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { leaveApplications, users, leaveTypes, getStatusColor, getStatusLabel } from '@/data/dummyData';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate, useParams } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { Layout } from '@/layout/Layout';

const workflowSteps = ['Submitted', 'HOD Review', 'Final Approval', 'Completed'];

const WorkflowStepper = ({ currentStep }: { currentStep: number }) => (
  <div className="space-y-2">
    <p className="text-xs font-medium text-muted-foreground">Current Workflow Status</p>
    <div className="flex items-center justify-between px-2">
      {workflowSteps.map((step, i) => (
        <div key={step} className="flex items-center gap-0 flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
              i < currentStep ? 'bg-success text-success-foreground border-success' :
              i === currentStep ? 'bg-primary text-primary-foreground border-primary' :
              'bg-background text-muted-foreground border-border'
            }`}>
              {i < currentStep ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <span className={`text-xs font-medium text-center ${
              i <= currentStep ? i === currentStep ? 'text-primary' : 'text-success' : 'text-muted-foreground'
            }`}>{step}</span>
          </div>
          {i < workflowSteps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-6 ${i < currentStep ? 'bg-success' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  </div>
);

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [endorseDialogOpen, setEndorseDialogOpen] = useState(false);
  const [notEndorseDialogOpen, setNotEndorseDialogOpen] = useState(false);
  const [comments, setComments] = useState('');

  const application = leaveApplications.find(a => a.id === id);
  const employee = application ? users.find(u => u.id === application.employeeId) : null;
  const leaveType = application ? leaveTypes.find(lt => lt.id === application.leaveTypeId) : null;

  if (!application || !employee || !leaveType) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Application Not Found</h1>
            <p className="text-muted-foreground mt-2">The application you are looking for does not exist.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const canEndorse = currentUser.role === 'hod' && application.status === 'pending_hod';
  const canApprove = currentUser.role === 'approving_authority' && application.status === 'pending_admin';

  const getWorkflowSteps = () => [
    {
      label: 'HOD Review',
      status: application.status === 'pending_hod' ? 'pending' :
             application.status === 'rejected' && application.hodComment ? 'rejected' : 'endorsed',
      by: application.status !== 'pending_hod' ? 'Mike Johnson' : undefined,
      date: application.status !== 'pending_hod' ? 'Dec 11, 2024 2:38 PM' : undefined,
      comment: application.hodComment || (application.status !== 'pending_hod' ? 'Approved. Robert has been performing well and deserves the break.' : undefined),
    },
    {
      label: 'Admin Verification',
      status: application.status === 'pending_hod' || application.status === 'pending_admin' ? 'pending' :
             application.status === 'rejected' && application.adminComment ? 'rejected' : 'verified',
      by: application.status === 'approved' ? 'Michael Brown' : undefined,
      date: application.status === 'approved' ? 'Dec 12, 2024 10:15 AM' : undefined,
      comment: application.adminComment,
    },
    {
      label: 'Final Approval',
      status: application.status === 'approved' ? 'approved' :
             application.status === 'rejected' ? 'rejected' : 'pending',
      by: application.status === 'approved' ? 'Patricia Davis' : undefined,
      date: application.status === 'approved' ? 'Dec 13, 2024 3:00 PM' : undefined,
    },
  ];

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'endorsed': case 'verified': case 'approved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStepBadge = (status: string) => {
    switch (status) {
      case 'endorsed':
        return <Badge className="bg-success/10 text-success border-success/20">Endorsed</Badge>;
      case 'verified':
        return <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>;
      case 'approved':
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    }
  };

  const handleEndorse = () => {
    toast({ title: "Application Endorsed", description: "Forwarded to HR for verification." });
    setEndorseDialogOpen(false);
    setComments('');
  };

  const handleNotEndorse = () => {
    if (!comments.trim()) {
      toast({ title: "Comments Required", description: "Please provide a reason.", variant: "destructive" });
      return;
    }
    toast({ title: "Application Not Endorsed", description: "Marked as not endorsed.", variant: "destructive" });
    setNotEndorseDialogOpen(false);
    setComments('');
  };

  const handleApprove = () => {
    toast({ title: "Application Approved", description: "The leave has been approved." });
  };

  const handleReject = () => {
    toast({ title: "Application Rejected", description: "The leave has been rejected.", variant: "destructive" });
  };

  const steps = getWorkflowSteps();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Application Details</h1>
              <p className="text-sm text-muted-foreground">Reference: LV-{new Date(application.appliedDate).getFullYear()}-{application.id.padStart(3, '0')}</p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(application.status)}>
            {getStatusLabel(application.status)}
          </Badge>
        </div>

        {/* Leave Type Banner */}
        <div className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: leaveType.color + '15', borderLeft: `4px solid ${leaveType.color}` }}>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Leave Type</p>
            <p className="text-lg font-bold" style={{ color: leaveType.color }}>{leaveType.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-medium">Duration</p>
            <p className="text-lg font-bold text-foreground">{application.days} days</p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-y-1 gap-x-8">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">{employee.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Staff ID:</span>
                <span className="font-medium text-foreground">{employee.staffId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium text-foreground">{employee.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Designation:</span>
                <span className="font-medium text-foreground">{employee.designation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Start Date</span>
            </div>
            <p className="font-medium text-foreground">{formatDate(application.startDate)}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">End Date</span>
            </div>
            <p className="font-medium text-foreground">{formatDate(application.endDate)}</p>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Reason for Leave</h3>
          <p className="text-sm text-muted-foreground">{application.reason}</p>
        </div>


        {/* Approval Workflow */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Approval Workflow</h3>
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-8 pb-6 last:pb-0">
                {index < steps.length - 1 && (
                  <div className="absolute left-2.25 top-6 bottom-0 w-0.5 bg-border" />
                )}
                <div className="absolute left-0 top-0">{getStepIcon(step.status)}</div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{step.label}</p>
                    {step.by && <p className="text-xs text-muted-foreground mt-0.5">By: {step.by}</p>}
                    {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
                    {step.comment && (
                      <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                        <span>💬</span><span>{step.comment}</span>
                      </div>
                    )}
                  </div>
                  {getStepBadge(step.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />Download PDF
          </Button>
          {canEndorse && (
            <>
              <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 ml-auto" onClick={() => setNotEndorseDialogOpen(true)}>
                <XCircle className="w-4 h-4" />Reject
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setEndorseDialogOpen(true)}>
                <CheckCircle className="w-4 h-4" />Approve
              </Button>
            </>
          )}
          {canApprove && (
            <>
              <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 ml-auto" onClick={handleReject}>
                <XCircle className="w-4 h-4" />Reject
              </Button>
              <Button size="sm" className="gap-2" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4" />Approve
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Endorse Dialog */}
      <Dialog open={endorseDialogOpen} onOpenChange={setEndorseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Endorse Application</DialogTitle>
            <DialogDescription>You are about to endorse this leave application. It will be forwarded to HR for verification.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <WorkflowStepper currentStep={1} />
            <Separator />
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Applicant:</span> {employee.name}</p>
              <p><span className="font-semibold">Leave Type:</span> {leaveType.name}</p>
              <p><span className="font-semibold">Duration:</span> {application.days} days</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Comments</span>
              </div>
              <Textarea placeholder="Add your comments..." value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEndorseDialogOpen(false); setComments(''); }}>Cancel</Button>
            <Button onClick={handleEndorse}>Confirm Endorsement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Not Endorse Dialog */}
      <Dialog open={notEndorseDialogOpen} onOpenChange={setNotEndorseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Not Endorse Application</DialogTitle>
            <DialogDescription>You are about to not endorse this leave application. Please provide a reason.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <WorkflowStepper currentStep={1} />
            <Separator />
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Applicant:</span> {employee.name}</p>
              <p><span className="font-semibold">Leave Type:</span> {leaveType.name}</p>
              <p><span className="font-semibold">Duration:</span> {application.days} days</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Comments <span className="text-destructive">*</span></span>
              </div>
              <Textarea placeholder="Add your comments..." value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNotEndorseDialogOpen(false); setComments(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleNotEndorse}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ApplicationDetails;