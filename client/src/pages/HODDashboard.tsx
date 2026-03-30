import ApplicationCard from "@/components/dashboard/ApplicationCard";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { leaveApplications, users } from "@/data/dummyData";
import { Layout } from "@/layout/Layout"
import { useAuthStore } from "@/store/auth.store"
import { AlertTriangle, ArrowRight, Calendar, CheckCircle, Clock, Users, XCircle } from "lucide-react";
import { Link } from "react-router";

const HODDashboard = () => {
    const currentUser = useAuthStore((state) => state.currentUser);

    // Get team members in the same department
    const teamMembers = users.filter((user) => user.department === currentUser?.department && user.id !== currentUser?.id);
    
    // Get pending reviews (applications from team members that are pending HOD)
    const pendingReviews = leaveApplications.filter((app) => 
        teamMembers.some(member => member.id === app.employeeId) && app.status === 'pending_hod'
    );

    // const endorsedCount = leaveApplications.filter((app) => app.status === 'approved').length;
    const endorsedCount = 5; // Dummy value for now
    const notEndorsedCount = 2; // Dummy value for now

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">HOD Dashboard</h1>
                    <p className="text-muted-foreground">{currentUser?.department} Department Overview</p>
                </div>

                {pendingReviews.length > 0 && (
                    <div className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-medium">{pendingReviews.length} pending reviews</span>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Pending Reviews"
                        value={pendingReviews.length}
                        subtitle="Awaiting your decision"
                        icon={<Clock className="w-6 h-6 text-warning" />}
                        iconBgColor="bg-warning/10"
                        gradientBarColor="bg-warning"
                    />
                    <StatCard
                        title="Endorsed"
                        value={endorsedCount}
                        subtitle="This year"
                        icon={<CheckCircle className="w-6 h-6 text-success" />}
                        iconBgColor="bg-success/10"
                        gradientBarColor="bg-success"
                    />
                    <StatCard
                        title="Not Endorsed"
                        value={notEndorsedCount}
                        subtitle="This year"
                        icon={<XCircle className="w-6 h-6 text-destructive" />}
                        iconBgColor="bg-destructive/10"
                        gradientBarColor="bg-destructive"
                    />
                    <StatCard
                        title="Team Members"
                        value={teamMembers.length}
                        subtitle="In department"
                        icon={<Users className="w-6 h-6 text-info" />}
                        iconBgColor="bg-primary/10"
                        gradientBarColor="bg-secondary-foreground"
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Reviews */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Pending Reviews</h2>
                    <Link to="/pending-reviews" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                    </div>
                    <div className="space-y-3">
                    {pendingReviews.length > 0 ? (
                        pendingReviews.map((application) => (
                        <ApplicationCard key={application.id} application={application} showEmployee />
                        ))
                    ) : (
                        <div className="bg-card rounded-xl border border-border p-8 text-center">
                        <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                        <p className="text-muted-foreground">No pending reviews</p>
                        </div>
                    )}
                    </div>
                </div>

                {/* Team on Leave */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Team on Leave</h2>
                    <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-muted-foreground text-center py-8">
                        No team members on leave today
                    </p>
                    <Link to="/team-calendar">
                        <Button variant="outline" className="w-full gap-2">
                            <Calendar className="w-4 h-4" />
                            View Team Calendar
                        </Button>
                    </Link>
                    </div>
                </div>
                </div>

            </div>
        </Layout>
    )
}

export default HODDashboard