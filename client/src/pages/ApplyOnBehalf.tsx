import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { leaveBalances, leavePolicies, leaveTypes, users } from "@/data/dummyData";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/layout/Layout"
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store"
import { differenceInDays, format } from "date-fns";
import { ArrowLeft, CalendarIcon, Info, Send, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

const ApplyOnBehalf = () => {
    const currentUser = useAuthStore((state) => state.currentUser);
    const navigate = useNavigate();
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [reason, setReason] = useState('');

    // Admin sees all staff/hod; HOD sees only their department staff
    const eligibleEmployees = useMemo(() => {
        if (currentUser?.role === 'admin') {
            return users.filter(u => u.id !== currentUser.id);
        }
        if (currentUser?.role === 'hod') {
            return users.filter(u => u.department === currentUser?.department && u.role === 'staff');
        }
        return [];
    }, [currentUser]);

    const selectedUser = users.find(u => u.id === selectedEmployee);

    // Get applicable leave policy for the selected employee
    const applicablePolicy = useMemo(() => {
        if (!selectedUser) return null;
        return leavePolicies.find(p => p.isActive && p.categoryLevel === selectedUser.categoryLevel) || null;
    }, [selectedUser]);

    // Filter leave types based on applicable policy
    const availableLeaveTypes = useMemo(() => {
        const activeTypes = leaveTypes.filter(lt => lt.isActive);
        if (applicablePolicy) {
        return activeTypes.filter(lt => applicablePolicy.applicableLeaveTypes.includes(lt.id));
        }
        return activeTypes;
    }, [applicablePolicy]);

    const employeeBalances = useMemo(() => {
        if (!selectedEmployee) return [];
        return leaveBalances.filter(b => b.employeeId === selectedEmployee);
    }, [selectedEmployee]);

    const selectedLeaveType = leaveTypes.find(lt => lt.id === leaveType);
    const selectedBalance = employeeBalances.find(b => b.leaveTypeId === leaveType);


    const availableDays = useMemo(() => {
        if (selectedBalance) {
        return selectedBalance.total - selectedBalance.used - selectedBalance.pending;
        }
        return selectedLeaveType?.defaultDays || 0;
    }, [selectedBalance, selectedLeaveType]);

    const totalDays = selectedBalance?.total || selectedLeaveType?.defaultDays || 0;
    const usedDays = selectedBalance?.used || 0;
    const pendingDays = selectedBalance?.pending || 0;

    const roleLabel = currentUser?.role === 'admin' ? 'an admin' : 'a HOD';

    const daysRequested = useMemo(() => {
        if (startDate && endDate) {
            return differenceInDays(endDate, startDate) + 1;
        }
        return 0;
    }, [startDate, endDate]);

    const resetForm = () => {
        setSelectedEmployee('');
        setLeaveType('');
        setStartDate(undefined);
        setEndDate(undefined);
        setReason('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEmployee || !leaveType || !startDate || !endDate || !reason) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        if (daysRequested > availableDays) {
            toast({
                title: "Insufficient Balance",
                description: `Requested ${daysRequested} days but only ${availableDays} days available.`,
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Leave Application Submitted",
            description: `Leave application for ${selectedUser?.name} has been submitted. The standard approval workflow will apply.`,
        });

        resetForm();
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Apply On Behalf</h1>
                        <p className="text-muted-foreground">Submit a leave application for an employee</p>
                    </div>
                </div>

                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                <UserPlus className="w-5 h-5" />
                                Leave Details
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">Fill in the details for the employee's leave request</p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Employee Selection */}
                                    <div className="space-y-2">
                                        <Label>Select Employee *</Label>
                                        <Select value={selectedEmployee} onValueChange={(value) => {
                                        setSelectedEmployee(value);
                                        setLeaveType('');
                                        }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {eligibleEmployees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                <div className="flex items-center gap-2">
                                                <span className="font-medium">{emp.name}</span>
                                                <span className="text-muted-foreground text-xs">
                                                    {emp.designation} · {emp.department}
                                                </span>
                                                </div>
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Employee Info */}
                                    {selectedUser && (
                                        <div className="bg-muted/50 rounded-lg p-4">
                                        <h3 className="font-medium text-foreground mb-3 text-sm">Employee Information</h3>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                            <span className="text-muted-foreground">Staff ID:</span>
                                            <span className="ml-2 font-medium text-primary">{selectedUser.staffId}</span>
                                            </div>
                                            <div>
                                            <span className="text-muted-foreground">Department:</span>
                                            <span className="ml-2 font-medium text-primary">{selectedUser.department}</span>
                                            </div>
                                            <div>
                                            <span className="text-muted-foreground">Designation:</span>
                                            <span className="ml-2 font-medium text-primary">{selectedUser.designation}</span>
                                            </div>
                                            <div>
                                            <span className="text-muted-foreground">Category:</span>
                                            <span className="ml-2 font-medium text-primary">Level {selectedUser.categoryLevel}</span>
                                            </div>
                                        </div>
                                        </div>
                                    )}

                                    {/* Leave Type */}
                                    <div className="space-y-2">
                                        <Label>Leave Type *</Label>
                                        <Select value={leaveType} onValueChange={setLeaveType} disabled={!selectedEmployee}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={selectedEmployee ? "Select leave type" : "Select an employee first"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableLeaveTypes.map((lt) => {
                                            const balance = employeeBalances.find(b => b.leaveTypeId === lt.id);
                                            const available = balance ? balance.total - balance.used - balance.pending : lt.defaultDays;
                                            return (
                                                <SelectItem key={lt.id} value={lt.id}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lt.color }} />
                                                    <span>{lt.name}</span>
                                                    <span className="text-muted-foreground text-xs">({available} days available)</span>
                                                </div>
                                                </SelectItem>
                                            );
                                            })}
                                        </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Date Range */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                        <Label>Start Date *</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "MMM dd, yyyy") : "Pick a date"}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        </div>
                                        <div className="space-y-2">
                                        <Label>End Date *</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "MMM dd, yyyy") : "Pick a date"}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="space-y-2">
                                        <Label>Reason for Leave *</Label>
                                        <Textarea
                                        placeholder="Reason for the employee's leave request..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={3}
                                        />
                                    </div>


                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                                        Cancel
                                        </Button>
                                        <Button type="submit" className="flex-1 gap-2">
                                        <Send className="w-4 h-4" />
                                        Submit Application
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                    
                     {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Leave Balance Card */}
                        {leaveType && selectedLeaveType && (
                        <Card>
                            <CardHeader className="pb-3">
                            <CardTitle className="text-base">Employee Leave Balance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-primary">{availableDays}</p>
                                <p className="text-sm text-muted-foreground">days available</p>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                <span className="text-muted-foreground">Total:</span>
                                <span className="font-medium">{totalDays} days</span>
                                </div>
                                <div className="flex justify-between">
                                <span className="text-muted-foreground">Used:</span>
                                <span className="font-medium">{usedDays} days</span>
                                </div>
                                <div className="flex justify-between">
                                <span className="text-muted-foreground">Pending:</span>
                                <span className="font-medium text-warning">{pendingDays} days</span>
                                </div>
                                {daysRequested > 0 && (
                                <div className="flex justify-between border-t pt-2 mt-2">
                                    <span className="text-muted-foreground">Requesting:</span>
                                    <span className={cn("font-semibold", daysRequested > availableDays ? "text-destructive" : "text-primary")}>
                                    {daysRequested} days
                                    </span>
                                </div>
                                )}
                            </div>
                            </CardContent>
                        </Card>
                        )}

                        {/* Admin/HOD Note */}
                        <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="pt-5">
                            <div className="flex gap-3">
                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-foreground text-sm mb-1">
                                {currentUser?.role === 'admin' ? 'Admin' : 'HOD'} Note
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                As {roleLabel}, you can submit leave applications on behalf of employees. The standard approval workflow will apply.
                                </p>
                            </div>
                            </div>
                        </CardContent>
                        </Card>

                        {/* Policy Info */}
                        {applicablePolicy && (
                        <Card>
                            <CardHeader className="pb-3">
                            <CardTitle className="text-base">Applied Policy</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Policy:</span>
                                <span className="font-medium">{applicablePolicy.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Max Carry Over:</span>
                                <span className="font-medium">{applicablePolicy.maxCarryOverDays} days</span>
                            </div>
                            </CardContent>
                        </Card>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default ApplyOnBehalf