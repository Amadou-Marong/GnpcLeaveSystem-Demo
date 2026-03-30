import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getStatusColor, getStatusLabel, leaveApplications, leaveTypes } from "@/data/dummyData"
import { toast } from "@/hooks/use-toast"
import { Layout } from "@/layout/Layout"
import { useAuthStore } from "@/store/auth.store"
import { Calendar, CheckCircle, Clock, FileText, Filter, Search, X, XCircle } from "lucide-react"
import { useState } from "react"


type TabType = 'all' | 'pending' | 'approved' | 'rejected'

const MyApplications = () => {
    const currentUser = useAuthStore((state) => state.currentUser)
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const myApplications = leaveApplications.filter(a => a.employeeId === currentUser?.id);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const pendingCount = myApplications.filter(a => a.status === 'pending_hod' || a.status === 'pending_admin').length;
    const approvedCount = myApplications.filter(a => a.status === 'approved').length;
    const rejectedCount = myApplications.filter(a => a.status === 'rejected').length;

    const getFilteredApplications = () => {
        let filtered = myApplications;

        if (activeTab === 'pending') {
        filtered = filtered.filter(a => a.status === 'pending_hod' || a.status === 'pending_admin');
        } else if (activeTab === 'approved') {
        filtered = filtered.filter(a => a.status === 'approved');
        } else if (activeTab === 'rejected') {
        filtered = filtered.filter(a => a.status === 'rejected');
        }

        if (search) {
        filtered = filtered.filter(app => {
            const leaveType = leaveTypes.find(lt => lt.id === app.leaveTypeId);
            return leaveType?.name.toLowerCase().includes(search.toLowerCase());
        });
        }

        return filtered;
    };

    const filteredApplications = getFilteredApplications();

    const tabs = [
        { id: 'all' as TabType, label: 'All', count: myApplications.length, icon: FileText },
        { id: 'pending' as TabType, label: 'Pending', count: pendingCount, icon: Clock },
        { id: 'approved' as TabType, label: 'Approved', count: approvedCount, icon: CheckCircle },
        { id: 'rejected' as TabType, label: 'Rejected', count: rejectedCount, icon: XCircle },
    ];

    const handleCancelApplication = (application?: any) => {
        if (application) {
            setSelectedApplication(application.id);
            setCancelDialogOpen(true);
        }
    }

    const handleConfirmCancelApplication = () => {
        // Handle cancel application logic here
        toast({
            title: "Application Cancelled",
            description: "Your leave application has been cancelled successfully.",
        });
        setCancelDialogOpen(false);
        setSelectedApplication(null);
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
                    <p className="text-muted-foreground">View and track all your leave applications</p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                        placeholder="Search applications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                        />
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
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.label} ({tab.count})
                    </button>
                    );
                })}
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                {filteredApplications.map((application) => {
                    const leaveType = leaveTypes.find(lt => lt.id === application.leaveTypeId);

                    return (
                    <div key={application.id} className="bg-card rounded-xl border border-border p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                            <Badge 
                                variant="secondary" 
                                style={{ backgroundColor: leaveType?.color + '20', color: leaveType?.color }}
                            >
                                {leaveType?.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">• {application.days} days</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(application.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(application.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Applied {new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            </div>

                            <p className="text-sm text-muted-foreground">{application.reason}</p>
                        </div>

                        {/* Right Section - Status & Actions */}
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className={getStatusColor(application.status)}>
                            {application.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {application.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {(application.status === 'pending_hod' || application.status === 'pending_admin') && <Clock className="w-3 h-3 mr-1" />}
                            {getStatusLabel(application.status)}
                            </Badge>
                            {(application.status === 'pending_hod' || application.status === 'pending_admin') && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive hover:text-destructive gap-1"
                                onClick={() => handleCancelApplication(application)}
                            >
                                <X className="w-3 h-3" />
                                Cancel
                            </Button>
                            )}
                        </div>
                        </div>
                    </div>
                    );
                })}

                {filteredApplications.length === 0 && (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-foreground">No applications found</p>
                    <p className="text-sm text-muted-foreground mt-1">You haven't submitted any leave applications yet</p>
                    </div>
                )}
                </div>
            </div>

            {/* Cancel Application Dialog */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cancel Application</DialogTitle>
                    <DialogDescription>
                    Are you sure you want to cancel this leave application? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {selectedApplication && (() => {
                    const app = myApplications.find(a => a.id === selectedApplication);
                    const leaveType = leaveTypes.find(lt => lt.id === app?.leaveTypeId);
                    return app ? (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                        <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Leave Type:</span>
                        <span className="font-medium">{leaveType?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{app.days} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dates:</span>
                        <span className="font-medium">
                            {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                        </span>
                        </div>
                    </div>
                    ) : null;
                })()}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                    Keep Application
                    </Button>
                    <Button variant="destructive" onClick={handleConfirmCancelApplication}>
                    Cancel Application
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    )
}

export default MyApplications