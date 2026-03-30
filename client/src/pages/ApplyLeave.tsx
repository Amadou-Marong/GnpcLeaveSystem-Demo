import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { leaveBalances, leaveTypes } from "@/data/dummyData";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/layout/Layout"
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { format } from "date-fns/format";
import { ArrowLeft, CalendarIcon, Info, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";


const ApplyLeave = () => {
    const currentUser = useAuthStore((state) => state.currentUser);
    const navigate = useNavigate();
    const [leaveType, setLeaveType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const myBalances = leaveBalances.filter((balance) => balance.employeeId === currentUser?.id);
    const selectedLeaveType = leaveTypes.find((lt) => lt.id === leaveType);
    const selectedBalance = myBalances.find((balance) => balance.leaveTypeId === leaveType);

    const availableDays = useMemo(() => {
        if (selectedBalance) {
            return selectedBalance.total - selectedBalance.used - selectedBalance.pending;
        }
        return selectedLeaveType?.defaultDays || 0;
    }, [selectedBalance, selectedLeaveType]);

    const daysRequested = useMemo(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diff = end.getTime() - start.getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        }
        return 0;
    }, [startDate, endDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Application Submitted",
            description: "Your leave application has been submitted for review.",
        });
        navigate('/my-applications');
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Apply for Leave</h1>
                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-xl border border-border p-6">
                        <div className="mb-6">
                            <h2 className="font-medium text-foreground">Leave Details</h2>
                            <p className="text-muted-foreground text-sm">Fill in the details for your leave request</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Employee Info */}
                            <div className="bg-muted/50 rounded-lg p-4">
                            <h3 className="font-medium text-foreground mb-3">Employee Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                <span className="text-muted-foreground">Staff ID:</span>
                                <span className="ml-2 font-medium text-primary">{currentUser?.staffId}</span>
                                </div>
                                <div>
                                <span className="text-muted-foreground">Department:</span>
                                <span className="ml-2 font-medium text-primary">{currentUser?.department}</span>
                                </div>
                                <div>
                                <span className="text-muted-foreground">Name:</span>
                                <span className="ml-2 font-medium text-primary">{currentUser?.name}</span>
                                </div>
                                <div>
                                <span className="text-muted-foreground">Designation:</span>
                                <span className="ml-2 font-medium text-primary">{currentUser?.designation}</span>
                                </div>
                            </div>
                            </div>

                            {/* Leave Type */}
                            <div className="space-y-2">
                            <Label htmlFor="leaveType">Leave Type *</Label>
                            <Select value={leaveType} onValueChange={setLeaveType}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select leave type" />
                                </SelectTrigger>
                                <SelectContent>
                                {leaveTypes.filter(lt => lt.isActive).map((lt) => {
                                    return (
                                    <SelectItem key={lt.id} value={lt.id}>
                                        <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lt.color }} />
                                        {lt.name}
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
                                    {startDate ? format(startDate, "MMMM do, yyyy") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={startDate ? new Date(startDate) : undefined}
                                    onSelect={(date) => setStartDate(date ? format(date, "yyyy-MM-dd") : "")}
                                    autoFocus
                                    />
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
                                    {endDate ? format(endDate, "MMMM do, yyyy") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={endDate ? new Date(endDate) : undefined}
                                    onSelect={(date) => setEndDate(date ? format(date, "yyyy-MM-dd") : "")}
                                    autoFocus
                                    />
                                </PopoverContent>
                                </Popover>
                            </div>
                            </div>

                            {/* Days Requested Display */}
                            {daysRequested > 0 && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Number of days requested:</span>
                                <span className="font-semibold text-primary">{daysRequested} days</span>
                            </div>
                            )}

                            {/* Reason */}
                            <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Leave *</Label>
                            <Textarea
                                id="reason"
                                placeholder="Please provide a brief reason for your leave request..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                            />
                            </div>


                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 gap-2">
                                <Send className="w-4 h-4" />
                                Submit Application
                            </Button>
                            </div>
                        </form>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-4">
                        {/* Leave Balance Card - shows when leave type is selected */}
                        {leaveType && selectedLeaveType && (
                        <div className="bg-card rounded-xl border border-border p-5">
                            <h3 className="font-medium text-foreground mb-4">Leave Balance</h3>
                            <div className="text-center mb-4">
                            <div className="text-4xl font-bold text-primary">{availableDays}</div>
                            <div className="text-sm text-muted-foreground">days available</div>
                            </div>
                            <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total allocated:</span>
                                <span className="font-medium">{selectedBalance?.total || selectedLeaveType.defaultDays} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Used:</span>
                                <span className="font-medium">{selectedBalance?.used || 0} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pending:</span>
                                <span className="font-medium text-warning">{selectedBalance?.pending || 0} days</span>
                            </div>
                            </div>
                        </div>
                        )}

                        {/* Approval Process Info */}
                        <div className="bg-info/5 border border-info/20 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-info mt-0.5" />
                            <div>
                            <h4 className="font-medium text-foreground">Approval Process</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Your leave request will be reviewed by your HOD, verified by HR, and finally approved by the approving authority.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default ApplyLeave