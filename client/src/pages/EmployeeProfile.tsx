import EditEmploymentHistoryDialog from "@/components/employee/EditEmploymentHistoryDialog";
import ResetPasswordDialog from "@/components/employee/ResetPasswordDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoleLabel, leaveApplications, leaveBalances, leaveTypes, users as initialUsers, type User, type EmploymentHistory } from "@/data/dummyData";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/layout/Layout"
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { format } from "date-fns";
import { ArrowLeft, Briefcase, Calendar, Edit, History, Mail, MapPin, Phone, Save, X } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router"

const EmployeeProfile = () => {
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate();
    const user = initialUsers.find(u => u.id === id);
    const { currentUser } = useAuthStore();
    const isAdmin = currentUser?.role === 'admin';
    const [users, setUsers] = useState<User[]>(initialUsers);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<User>>({});


    const [userBalanceForm, setUserBalanceForm] = useState({ total: 0, used: 0, pending: 0 });
    const [editBalanceDialogOpen, setEditBalanceDialogOpen] = useState(false);
    const [selectedBalance, setSelectedBalance] = useState<any>(null);


    const enrichedBalances = leaveBalances.map(balance => {
        const employee = users.find(user => user.id === balance.employeeId);
        const leaveType = leaveTypes.find(lt => lt.id === balance.leaveTypeId)

        return {...balance, employee, leaveType }
    }).filter(b => b.employee && b.leaveType);

    const availableBalance = userBalanceForm.total - userBalanceForm.used - userBalanceForm.pending;

    const handleEditLeaveBalance = (balanceId: string) => {
        const balance = enrichedBalances.find(b => b.id === balanceId);
        if (balance) {
            setSelectedBalance(balance);
            setUserBalanceForm({ total: balance.total, used: balance.used, pending: balance.pending });
            setEditBalanceDialogOpen(true);
        }
    };


    const handleSaveEmployeeBalance = () => {
        if (selectedBalance) {
            const updatedBalance = { ...selectedBalance, ...userBalanceForm };
            const updatedBalances = leaveBalances.map(b => b.id === selectedBalance.id ? updatedBalance : b);
            setUsers(users.map(u => u.id === user?.id ? { ...u, leaveBalances: updatedBalances } : u));
            setEditBalanceDialogOpen(false);
        }
    };

    const getUserLeaveBalances = () => {
        return leaveBalances.filter(b => b.employeeId === user?.id).map(balance => {
        const leaveType = leaveTypes.find(t => t.id === balance.leaveTypeId);
        return {
            ...balance,
            leaveTypeName: leaveType?.name || 'Unknown',
            leaveTypeColor: leaveType?.color || 'hsl(0, 0%, 50%)',
        };
        });
    };

    const getUserApplications = () => {
        return leaveApplications.filter(app => app.employeeId === user?.id).map(app => {
        const leaveType = leaveTypes.find(t => t.id === app.leaveTypeId);
        return { ...app, leaveTypeName: leaveType?.name || 'Unknown' };
        });
    };
    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
        admin: 'bg-destructive/10 text-destructive',
        hod: 'bg-info/10 text-info',
        staff: 'bg-muted text-muted-foreground',
        hr: 'bg-warning/10 text-warning',
        };
        return colors[role] || 'bg-muted text-muted-foreground';
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
        pending_hod: 'bg-warning/10 text-warning',
        pending_admin: 'bg-info/10 text-info',
        approved: 'bg-success/10 text-success',
        rejected: 'bg-destructive/10 text-destructive',
        };
        const labels: Record<string, string> = {
        pending_hod: 'Pending HOD',
        pending_admin: 'Pending Admin',
        approved: 'Approved',
        rejected: 'Rejected',
        };
        return { style: styles[status] || 'bg-muted', label: labels[status] || status };
    };

    const handleEdit = () => {
        setEditForm({
            name: user?.name,
            email: user?.email,
            phone: user?.phone || '',
            address: user?.address || '',
            department: user?.department,
            designation: user?.designation,
        });
        setIsEditing(true);
    };

    const handleResetPassword = (newPassword: string, mustChangePassword: boolean) => {
        setUsers(users.map(u => 
        u.id === user?.id ? { ...u, password: newPassword, mustChangePassword } : u
        ));
    };

    const handleCancelEdit = () => {
        setEditForm({});
        setIsEditing(false);
    };

     const handleSaveEdit = () => {
        setUsers(users.map(u => 
        u.id === user?.id ? { ...u, ...editForm } : u
        ));
        toast({
        title: "Success",
        description: "Employee details updated successfully",
        });
    setIsEditing(false);
  };

    const handleSaveEmploymentHistory = (history: EmploymentHistory[]) => {
        setUsers(users.map(u => 
        u.id === user?.id ? { ...u, employmentHistory: history } : u
        ));
    };

    const balances = getUserLeaveBalances()
    const applications = getUserApplications()
    return (
        <Layout>
            <div className="space-y-6">
                {/* Back Button */}
                <Link to="/employees" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Employees
                </Link>
                {/* Profile Header */}
                <div className="flex gap-4 justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Employee Profile</h1>
                        <p className="text-muted-foreground">View and manage your profile information</p>
                    </div>
                    {!isEditing ? (
                        <div className="flex gap-2">
                        {isAdmin && (
                            <ResetPasswordDialog 
                            userName={user?.name ?? ''} 
                            onReset={handleResetPassword} 
                            />
                        )}
                        <Button onClick={handleEdit} className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                            <X className="w-4 h-4" />
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} className="gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                        </div>
                    )}
                </div>
                {/* Profile Header Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                           {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-lg">
                                {user?.name.split(' ').map(n => n[0]).join('')}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
                                <Badge variant="secondary" className={cn('text-xs', getRoleBadgeColor(user?.role || 'staff'))}>
                                    {getRoleLabel(user?.role || 'staff')}
                                </Badge>
                                <Badge variant="outline">{user?.staffId}</Badge>
                                </div>
                                <p className="text-muted-foreground mt-1">{user?.designation}</p>

                                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4" />
                                    {user?.department}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-4 h-4" />
                                    {user?.email}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Phone className="w-4 h-4" />
                                    {user?.phone || 'Not provided'}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Joined {user?.dateJoined ? format(new Date(user?.dateJoined), ' dd MMM yyyy') : 'N/A'}
                                </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="details" className="w-full">
                    <TabsList>
                        <TabsTrigger value="details">Personal Details</TabsTrigger>
                        <TabsTrigger value="history">Employment History</TabsTrigger>
                        <TabsTrigger value="leave">Leave Balances</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details">
                        {/* Personal Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Contact Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            {isEditing ? (
                                <>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                    value={editForm.phone || ''}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    placeholder="Phone number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input
                                    value={editForm.address || ''}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    placeholder="Address"
                                    />
                                </div>
                                </>
                            ) : (
                                <>
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="font-medium">{user?.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                    <p className="text-xs text-muted-foreground">Address</p>
                                    <p className="font-medium">{user?.address || 'Not provided'}</p>
                                    </div>
                                </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    </TabsContent>
                    <TabsContent value="history">
                        {/* Employment History */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Employment History
                                </CardTitle>
                                <EditEmploymentHistoryDialog 
                                    history={user?.employmentHistory || []} 
                                    onSave={handleSaveEmploymentHistory} 
                                />
                            </CardHeader>
                            <CardContent>
                                {user?.employmentHistory && user.employmentHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {user.employmentHistory.map((history, index) => (
                                    <div key={history.id} className={cn(
                                        "relative pl-6 pb-4",
                                        index !== user.employmentHistory!.length - 1 && "border-l-2 border-border"
                                    )}>
                                        <div className={cn(
                                        "absolute left-0 top-0 w-3 h-3 rounded-full -translate-x-1.75",
                                        history.isCurrent ? "bg-primary" : "bg-muted-foreground"
                                        )} />
                                        <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium">{history.position}</p>
                                            <p className="text-sm text-muted-foreground">{history.department}</p>
                                        </div>
                                        {history.isCurrent && (
                                            <Badge variant="secondary" className="bg-primary/10 text-primary">Current</Badge>
                                        )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                        {format(new Date(history.startDate), 'MMM yyyy')} - {history.endDate ? format(new Date(history.endDate), 'MMM yyyy') : 'Present'}
                                        </p>
                                    </div>
                                    ))}
                                </div>
                                ) : (
                                <p className="text-muted-foreground">No employment history available</p>
                                )}
                            </CardContent>
                            </Card>
                    </TabsContent>
                    <TabsContent value="leave" className="space-y-6 mt-6">
                        {/* Leave Balances */}
                              
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {balances.map((balance) => {
                                const available = balance.total - balance.used - balance.pending;
                                const usedPercentage = (balance.used / balance.total) * 100;
                                
                                return (
                                    <Card key={balance.id}>
                                        <CardContent className="p-4 relative">
                                        
                                        <div className="flex items-center justify-between mb-3">

                                            <Edit className="w-6 h-6 text-primary absolute -top-2 right-3 opacity-0 hover:opacity-100" onClick={() => handleEditLeaveBalance(balance?.id)}/>

                                            <div className="flex items-center gap-2">
                                            <div 
                                                className="w-1 h-8 rounded-full" 
                                                style={{ backgroundColor: balance.leaveTypeColor }}
                                            />
                                            <div>
                                                <p className="font-medium text-foreground">{balance.leaveTypeName}</p>
                                                <p className="text-xs text-muted-foreground">{balance.year}</p>
                                            </div>
                                            </div>
                                            <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                            {available} days left
                                            </span>
                                        </div>
                                        
                                        <Progress 
                                            value={usedPercentage} 
                                            className="h-2 mb-3"
                                            style={{ 
                                            ['--progress-color' as string]: balance?.leaveTypeColor 
                                            }}
                                        />
                                        
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Used: {balance.used}</span>
                                            {balance.pending > 0 && <span className="text-warning">Pending: {balance.pending}</span>}
                                            <span>Total: {balance.total}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                );
                            })}
                        </div>

                        {/* Recent Applications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Applications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {applications.length > 0 ? (
                                <div className="space-y-3">
                                    {applications.slice(0, 5).map((app) => {
                                    const status = getStatusBadge(app.status);
                                    return (
                                        <div key={app.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div>
                                            <p className="font-medium">{app.leaveTypeName}</p>
                                            <p className="text-sm text-muted-foreground">
                                            {format(new Date(app.startDate), 'MMM d, yyyy')} - {format(new Date(app.endDate), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{app.days} days</p>
                                            <Badge variant="secondary" className={cn('text-xs', status.style)}>
                                            {status.label}
                                            </Badge>
                                        </div>
                                        </div>
                                    );
                                    })}
                                </div>
                                ) : (
                                <p className="text-muted-foreground">No leave applications found</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Edit Leave Balance Dialog */}
                <Dialog open={editBalanceDialogOpen} onOpenChange={setEditBalanceDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Leave Balance</DialogTitle>
                        <DialogDescription>
                            Update leave allocation for {selectedBalance?.employee?.name}
                        </DialogDescription>
                        </DialogHeader>
                        {selectedBalance && (
                        <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                            <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Leave Type:</span>
                            <span className="font-medium">{selectedBalance.leaveType?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Year:</span>
                            <span className="font-medium">{selectedBalance.year}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="total">Total Days</Label>
                            <Input
                            id="total"
                            type="number"
                            
                            value={userBalanceForm.total}
                            onChange={(e) => setUserBalanceForm(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}

                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="used">Used Days</Label>
                            <Input
                            id="used"
                            type="number"
                            value={userBalanceForm.used}
                            onChange={(e) => setUserBalanceForm(prev => ({ ...prev, used: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pending">Pending Days</Label>
                            <Input
                            id="pending"
                            type="number"
                            value={userBalanceForm.pending}
                            onChange={(e) => setUserBalanceForm(prev => ({ ...prev, pending: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                        </div>

                        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                        <p className="text-sm">
                            <strong>Available Balance:</strong>{' '}
                            <span className="text-primary font-semibold">{availableBalance} days</span>
                        </p>
                        </div>
                    </div>
                    )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setEditBalanceDialogOpen(false)}>
                    Cancel
                    </Button>
                    <Button onClick={handleSaveEmployeeBalance}>
                    Save Changes
                    </Button>
                </DialogFooter>

                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    )
}

export default EmployeeProfile