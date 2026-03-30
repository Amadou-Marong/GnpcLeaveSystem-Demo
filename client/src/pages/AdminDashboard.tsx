import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { leaveApplications, leaveTypes, users } from "@/data/dummyData"
import { Layout } from "@/layout/Layout"

import { BarChart3, CheckCircle, Clock, Settings, Users } from "lucide-react";
import { Link } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
    const pendingAdminApplications =  leaveApplications.filter(app => app.status === 'pending_admin');
    const processedCount = leaveApplications.filter(app => app.status === 'approved' || app.status === 'rejected').length;
    const activeEmployees = users.filter(user => user.role === 'staff' || user.role === 'hod').length;
    const activeLeaveTypes = leaveTypes.filter(type => type.isActive).length;

    // Dummy chart data
    const trendData = [
        { month: 'Jan', applications: 12 },
        { month: 'Feb', applications: 8 },
        { month: 'Mar', applications: 15 },
        { month: 'Apr', applications: 10 },
        { month: 'May', applications: 18 },
        { month: 'Jun', applications: 22 },
        { month: 'Jul', applications: 25 },
        { month: 'Aug', applications: 20 },
        { month: 'Sep', applications: 16 },
        { month: 'Oct', applications: 14 },
        { month: 'Nov', applications: 11 },
        { month: 'Dec', applications: 9 },
    ];

    const leaveTypeData = leaveTypes.map(lt => ({
        name: lt.name.split(' ')[0],
        count: Math.floor(Math.random() * 30) + 5,
        color: lt.color,
    }));

    return (
        <Layout>
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Pending Verification"
                        value={pendingAdminApplications.length}
                        subtitle="Awaiting your review"
                        icon={<Clock className="w-6 h-6 text-warning" />}
                        iconBgColor="bg-warning/10"
                        gradientBarColor="bg-warning"
                    />
                    <StatCard
                        title="Verified This Month"
                        value={processedCount}
                        subtitle="Applications processed"
                        icon={<CheckCircle className="w-6 h-6 text-success" />}
                        iconBgColor="bg-success/10"
                        gradientBarColor="bg-success"
                    />
                    <StatCard
                        title="Total Employees"
                        value={activeEmployees}
                        subtitle="Active staff"
                        icon={<Users className="w-6 h-6 text-info" />}
                        // iconBgColor="bg-info/10"
                        iconBgColor="bg-primary/10"
                        gradientBarColor="bg-secondary-foreground"
                    />
                    <StatCard
                        title="Leave Types"
                        value={activeLeaveTypes}
                        subtitle="Active types"
                        icon={<Settings className="w-6 h-6 text-primary" />}
                        iconBgColor="bg-primary/10"
                        gradientBarColor="bg-primary"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card rounded-xl border border-border p-5">
                        <h3 className="font-semibold text-foreground mb-4">Applications Trend</h3>
                        <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="month" stroke="#888888" />
                            <YAxis stroke="#888888" />
                            <Tooltip />
                            <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-5">
                        <h3 className="font-semibold text-foreground mb-4">Leave Types</h3>
                        <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={leaveTypeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" stroke="#888888" />
                            <YAxis stroke="#888888" />
                            <Tooltip />
                            <Bar dataKey="count" stackId="a" fill="#3b82f6" />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/leave-policies/leave-balances">
                        <Button variant="outline" className="w-full h-24 flex-col gap-2">
                            <BarChart3 className="w-6 h-6" />
                            Manage Balances
                        </Button>
                        </Link>
                        <Link to="/employees">
                        <Button variant="outline" className="w-full h-24 flex-col gap-2">
                            <Users className="w-6 h-6" />
                            Employees
                        </Button>
                        </Link>
                        <Link to="/leave-policies">
                        <Button variant="outline" className="w-full h-24 flex-col gap-2">
                            <Settings className="w-6 h-6" />
                            Leave Policies
                        </Button>
                        </Link>
                        <Link to="/reports">
                        <Button variant="outline" className="w-full h-24 flex-col gap-2">
                            <CheckCircle className="w-6 h-6" />
                            Reports
                        </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminDashboard