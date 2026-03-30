import ApplicationCard from "@/components/dashboard/ApplicationCard";
import LeaveBalanceCard from "@/components/dashboard/LeaveBalanceCard";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { leaveApplications, leaveBalances } from "@/data/dummyData";
import { Layout } from "@/layout/Layout";
import { useAuthStore } from "@/store/auth.store"
import { ArrowRight, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { Link } from "react-router";

const StaffDashboard = () => {
    const currentUser = useAuthStore((state) => state.currentUser);
    const myBalances = leaveBalances.filter((balance) => balance.employeeId === currentUser?.id);
    const myApplications = leaveApplications.filter((app) => app.employeeId === currentUser?.id);
    const totalAvailable = myBalances.reduce((sum, balance) => sum + (balance.total - balance.used - balance.pending), 0);
    const pendingCount = myApplications.filter((app) => app.status.startsWith('pending')).length;
    const approvedCount = myApplications.filter((app) => app.status === 'approved').length;
    const rejectedCount = myApplications.filter((app) => app.status === 'rejected').length;


    return (
        <Layout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                        Welcome back, {currentUser?.name.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-muted-foreground">Here's your leave overview for 2025</p>
                    </div>
                    <Link to="/apply-leave">
                        <Button className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Apply for Leave
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Days Available"
                        value={totalAvailable}
                        subtitle="Across all leave types"
                        icon={<Calendar className="w-6 h-6 text-primary" />}
                        iconBgColor="bg-primary/10"
                        gradientBarColor="bg-primary"
                    />
                    <StatCard
                        title="Pending Requests"
                        value={pendingCount}
                        subtitle="Awaiting approval"
                        icon={<Clock className="w-6 h-6 text-warning" />}
                        iconBgColor="bg-warning/10"
                        gradientBarColor="bg-warning"
                    />
                    <StatCard
                        title="Approved"
                        value={approvedCount}
                        subtitle="This year"
                        icon={<CheckCircle className="w-6 h-6 text-success" />}
                        iconBgColor="bg-success/10"
                        gradientBarColor="bg-success"
                    />
                    <StatCard
                        title="Rejected"
                        value={rejectedCount}
                        subtitle="This year"
                        icon={<XCircle className="w-6 h-6 text-destructive" />}
                        iconBgColor="bg-destructive/10"
                        gradientBarColor="bg-destructive"
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Leave Balances */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Leave Balances</h2>
                        <Link to="/leave-history" className="text-sm text-primary hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                        </div>
                        <div className="space-y-3">
                        {myBalances.map((balance) => (
                            <LeaveBalanceCard
                            key={balance.id}
                            leaveTypeId={balance.leaveTypeId}
                            total={balance.total}
                            used={balance.used}
                            pending={balance.pending}
                            year={balance.year}
                            />
                        ))}
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
                        <Link to="/my-applications" className="text-sm text-primary hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                        </div>
                        <div className="space-y-3">
                        {myApplications.slice(0, 3).map((application) => (
                            <ApplicationCard key={application.id} application={application} />
                        ))}
                        {myApplications.length === 0 && (
                            <div className="bg-card rounded-xl border border-border p-8 text-center">
                            <p className="text-muted-foreground">No applications yet</p>
                            <Link to="/apply-leave">
                                <Button variant="link" className="mt-2">Apply for leave</Button>
                            </Link>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default StaffDashboard