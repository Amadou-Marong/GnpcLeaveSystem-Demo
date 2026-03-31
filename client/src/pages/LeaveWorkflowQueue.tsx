import { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  Calendar,
  Building2,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import {
  leaveApplications,
  users,
  leaveTypes,
  getStatusColor,
  getStatusLabel,
} from '@/data/dummyData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router';
import { Layout } from '@/layout/Layout';
import { useAuthStore } from '@/store/auth.store';
import { getApplicationsForRole, getLeaveBalance } from '@/services/LeaveWorkflowService';

type TabType = 'pending' | 'completed';

const LeaveWorkflowQueue = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const pendingApplications = useMemo(() => {
    return getApplicationsForRole(currentUser?.role);
  }, [currentUser?.role]);

  const completedApplications = useMemo(() => {
    if (currentUser?.role === 'hod') {
      return leaveApplications.filter((a) => a.status !== 'pending_hod');
    }

    if (currentUser?.role === 'hr' || currentUser?.role === 'admin') {
      return leaveApplications.filter((a) => a.status === 'approved' || a.status === 'rejected');
    }

    return [];
  }, [currentUser?.role]);

  const applications = activeTab === 'pending' ? pendingApplications : completedApplications;

  const filteredApplications = applications.filter((app) => {
    const employee = users.find((u) => u.id === app.employeeId);
    const leaveType = leaveTypes.find((lt) => lt.id === app.leaveTypeId);

    const q = search.toLowerCase();

    return (
      employee?.name.toLowerCase().includes(q) ||
      leaveType?.name.toLowerCase().includes(q) ||
      `LV-${new Date(app.appliedDate).getFullYear()}-${app.id.padStart(3, '0')}`.toLowerCase().includes(q)
    );
  });

  const pageTitle =
    currentUser?.role === 'hod'
      ? 'HOD Leave Review'
      : currentUser?.role === 'hr'
      ? 'Leave Verification & Approval'
      : currentUser?.role === 'admin'
      ? 'Final Leave Workflow'
      : 'Leave Workflow';

  const pageDescription =
    currentUser?.role === 'hod'
      ? 'Review and endorse leave applications'
      : 'Verify and finalize leave applications in one flow';

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, leave type, or application number..."
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

        <div className="flex gap-2 border-b border-border pb-2">
          {[
            { id: 'pending' as TabType, label: 'Pending', count: pendingApplications.length },
            { id: 'completed' as TabType, label: 'Completed', count: completedApplications.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.id === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const employee = users.find((u) => u.id === application.employeeId);
            const leaveType = leaveTypes.find((lt) => lt.id === application.leaveTypeId);
            const balance = getLeaveBalance(application.employeeId, application.leaveTypeId);
            const available = balance ? balance.total - balance.used - balance.pending : 0;

            return (
              <div key={application.id} className="bg-card rounded-xl border border-border p-6 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {employee?.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{employee?.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: leaveType?.color + '20',
                            color: leaveType?.color,
                          }}
                        >
                          {leaveType?.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">• {application.days} days</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant="outline" className={getStatusColor(application.status)}>
                    {getStatusLabel(application.status)}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {application.startDate} - {application.endDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {employee?.department}
                  </span>
                </div>

                <div className="mt-1.5 text-sm text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {employee?.designation}
                </div>

                {activeTab === 'pending' && (currentUser?.role === 'hr' || currentUser?.role === 'admin') && (
                  <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
                    <p className="text-sm text-info">
                      <strong>Balance Check:</strong> {available} days available ({balance?.total ?? 0} total,{' '}
                      {balance?.used ?? 0} used, {balance?.pending ?? 0} pending)
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Applied {application.appliedDate}
                  </span>
                  <button
                    onClick={() => navigate(`/application/${application.id}`)}
                    className="text-sm font-medium text-primary flex items-center gap-1 hover:underline"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
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
    </Layout>
  );
};

export default LeaveWorkflowQueue;