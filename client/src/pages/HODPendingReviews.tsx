

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getStatusColor, getStatusLabel, leaveApplications, leaveTypes, users } from "@/data/dummyData";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/layout/Layout";
import { Briefcase, Building2, Calendar, CheckCircle, ChevronRight, Clock, Filter, MessageSquare, Search, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

type TabType = 'pending' | 'endorsed' | 'not_endorsed';

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


const HODPendingReviews = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
    const [endorseDialogOpen, setEndorseDialogOpen] = useState(false);
    const [notEndorseDialogOpen, setNotEndorseDialogOpen] = useState(false);
    const [comments, setComments] = useState('');

    const hodApplications = leaveApplications.filter(a => a.status === 'pending_hod');
    const endorsedApplications = leaveApplications.filter(a => a.status === 'pending_admin');
    const rejectedApplications = leaveApplications.filter(a => a.status === 'rejected');

    const getFilteredApplications = () => {
        switch (activeTab) {
        case 'pending': return hodApplications;
        case 'endorsed': return endorsedApplications;
        case 'not_endorsed': return rejectedApplications;
        default: return [];
        }
    };

    const filteredApplications = getFilteredApplications().filter(app => {
        const employee = users.find(u => u.id === app.employeeId);
        const leaveType = leaveTypes.find(lt => lt.id === app.leaveTypeId);
        return (
        employee?.name.toLowerCase().includes(search.toLowerCase()) ||
        leaveType?.name.toLowerCase().includes(search.toLowerCase())
        );
    });

    const handleEndorse = () => {
        toast({ title: "Application Endorsed", description: "The application has been forwarded to HR for verification." });
        setEndorseDialogOpen(false);
        setSelectedApplication(null);
        setComments('');
    };

    const handleNotEndorse = () => {
        if (!comments.trim()) {
        toast({ title: "Comments Required", description: "Please provide a reason for not endorsing.", variant: "destructive" });
        return;
        }
        toast({ title: "Application Not Endorsed", description: "The leave application has been marked as not endorsed.", variant: "destructive" });
        setNotEndorseDialogOpen(false);
        setSelectedApplication(null);
        setComments('');
    };

    const selectedApp = selectedApplication ? leaveApplications.find(a => a.id === selectedApplication) : null;
    const selectedEmployee = selectedApp ? users.find(u => u.id === selectedApp.employeeId) : null;
    const selectedLeaveType = selectedApp ? leaveTypes.find(lt => lt.id === selectedApp.leaveTypeId) : null;

    const tabs = [
        { id: 'pending' as TabType, label: 'Pending', count: hodApplications.length, icon: Clock },
        { id: 'endorsed' as TabType, label: 'Endorsed', count: endorsedApplications.length, icon: ThumbsUp },
        { id: 'not_endorsed' as TabType, label: 'Not Endorsed', count: rejectedApplications.length, icon: ThumbsDown },
    ];
    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Pending Reviews</h1>
                    <p className="text-muted-foreground">Review and endorse leave applications from your team</p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search applications..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <Button variant="outline" className="gap-2">
                     <Filter className="w-4 h-4" />
                     Filters
                   </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border pb-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted'}`}>
                            <Icon className="w-4 h-4" />
                            {tab.label} ({tab.count})
                        </button>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    {filteredApplications.map((application) => {
                        const employee = users.find(u => u.id === application.employeeId);
                        const leaveType = leaveTypes.find(lt => lt.id === application.leaveTypeId);

                        return (
                        <div key={application.id} className="bg-card rounded-xl border border-border p-6 group">
                            <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                {employee?.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                <h3 className="font-semibold text-foreground">{employee?.name}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="secondary" style={{ backgroundColor: leaveType?.color + '20', color: leaveType?.color }}>{leaveType?.name}</Badge>
                                    <span className="text-sm text-muted-foreground">• {application.days} days</span>
                                </div>
                                </div>
                            </div>
                            <Badge variant="outline" className={getStatusColor(application.status)}>
                                <Clock className="w-3 h-3 mr-1" />
                                {getStatusLabel(application.status)}
                            </Badge>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(application.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(application.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" />{employee?.department}</span>
                            </div>
                            <div className="mt-1.5 text-sm text-muted-foreground flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4" />{employee?.designation}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />Applied {new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <button
                                onClick={() => navigate(`/application/${application.id}`)}
                                className="text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                            >
                                View Details <ChevronRight className="w-4 h-4" />
                            </button>
                            </div>

                            {activeTab === 'pending' && (
                            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                                <Button
                                variant="outline"
                                className="flex-1 gap-2 text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                                onClick={() => { setSelectedApplication(application.id); setNotEndorseDialogOpen(true); }}
                                >
                                <ThumbsDown className="w-4 h-4" />
                                Not Endorse
                                </Button>
                                <Button
                                className="flex-1 gap-2"
                                onClick={() => { setSelectedApplication(application.id); setEndorseDialogOpen(true); }}
                                >
                                <ThumbsUp className="w-4 h-4" />
                                Endorse
                                </Button>
                            </div>
                            )}
                        </div>
                        );
                    })}

                    {filteredApplications.length === 0 && (
                        <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                        <p className="text-muted-foreground">No applications in this category</p>
                        </div>
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
                {selectedApp && (
                    <div className="space-y-4">
                    <WorkflowStepper currentStep={1} />
                    <Separator />
                    <div className="space-y-1 text-sm">
                        <p><span className="font-semibold">Applicant:</span> {selectedEmployee?.name}</p>
                        <p><span className="font-semibold">Leave Type:</span> {selectedLeaveType?.name}</p>
                        <p><span className="font-semibold">Duration:</span> {selectedApp.days} days</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Comments</span>
                        </div>
                        <Textarea placeholder="Add your comments..." value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
                    </div>
                    </div>
                )}
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
                {selectedApp && (
                    <div className="space-y-4">
                    <WorkflowStepper currentStep={1} />
                    <Separator />
                    <div className="space-y-1 text-sm">
                        <p><span className="font-semibold">Applicant:</span> {selectedEmployee?.name}</p>
                        <p><span className="font-semibold">Leave Type:</span> {selectedLeaveType?.name}</p>
                        <p><span className="font-semibold">Duration:</span> {selectedApp.days} days</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Comments <span className="text-destructive">*</span></span>
                        </div>
                        <Textarea placeholder="Add your comments..." value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
                    </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setNotEndorseDialogOpen(false); setComments(''); }}>Cancel</Button>
                    <Button variant="destructive" onClick={handleNotEndorse}>Confirm</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    )
}

export default HODPendingReviews