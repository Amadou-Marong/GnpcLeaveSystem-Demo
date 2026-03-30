import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStatusColor, getStatusLabel, leaveApplications, leaveBalances, leaveTypes } from "@/data/dummyData"
import { Layout } from "@/layout/Layout"
import { useAuthStore } from "@/store/auth.store"
import { format } from "date-fns/format"
import { CheckCircle2, Clock, Download } from "lucide-react"
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const LeaveHistory = () => {
    const currentUser = useAuthStore((state) => state.currentUser);

    const [selectedYear, setSelectedYear] = useState("2024");
    const handleExport = () => {
        // Implement export functionality here
        console.log(`Exporting leave history for year: ${selectedYear}`);
    }

    // Get user's leave balances
    const userBalances = leaveBalances.filter(
        (b) => b.employeeId === currentUser?.id && b.year === parseInt(selectedYear)
    );
    
    // Get user's leave applications for the selected year
    const userApplications = leaveApplications.filter(
        (app) =>
            app.employeeId === currentUser?.id &&
            new Date(app.startDate).getFullYear() === parseInt(selectedYear)
    );

    // Leave distribution data
    const distributionData = userBalances
        .map((balance) => {
        const leaveType = leaveTypes.find((lt) => lt.id === balance.leaveTypeId);
        return {
            name: leaveType?.name?.split(' ')[0] || 'Unknown',
            value: balance.used,
            color: leaveType?.color || '#ccc',
        };
        })
        .filter((d) => d.value > 0);

    // Monthly usage data (mock data based on applications)
    const monthlyData = [
        { name: 'Jan', days: 2 },
        { name: 'Feb', days: 0 },
        { name: 'Mar', days: 1 },
        { name: 'Apr', days: 3 },
        { name: 'May', days: 5 },
        { name: 'Jun', days: 4 },
        { name: 'Jul', days: 0 },
        { name: 'Aug', days: 7 },
        { name: 'Sep', days: 3 },
        { name: 'Oct', days: 0 },
        { name: 'Nov', days: 0 },
        { name: 'Dec', days: 5 },
    ];

    const getLeaveTypeName = (leaveTypeId: string) => {
        const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);
        return leaveType ? leaveType.name : 'Unknown';
    }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Leave History Page</h1>
                <p className="text-sm text-muted-foreground">Track your leave usage and balances</p>
            </div>
            <div className="flex gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Current Balances */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Current Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userBalances.map((balance) => {
              const leaveType = leaveTypes.find((lt) => lt.id === balance.leaveTypeId);
              if (!leaveType) return null;

              const available = balance.total - balance.used - balance.pending;
              const usedPercentage = (balance.used / balance.total) * 100;

              return (
                <div
                  key={balance.id}
                  className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1 h-10 rounded-full"
                        style={{ backgroundColor: leaveType.color }}
                      />
                      <div>
                        <p className="font-medium text-foreground">{leaveType.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedYear}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium"
                      style={{
                        backgroundColor: `${leaveType.color}15`,
                        color: leaveType.color,
                      }}
                    >
                      {available} days left
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <Progress
                      value={usedPercentage}
                      className="h-2"
                      style={
                        {
                          ['--progress-color' as string]: leaveType.color,
                        } as React.CSSProperties
                      }
                    />
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Used: {balance.used}</span>
                    {balance.pending > 0 && (
                      <span className="text-warning">Pending: {balance.pending}</span>
                    )}
                    <span>Total: {balance.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Leave Usage */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Monthly Leave Usage</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="days" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        {/* Leave Distribution */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Leave Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              {distributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">No leave usage data</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Leave History Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border border-border">
                <div className="text-lg font-semibold text-foreground">Leave History</div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                  {userApplications.length > 0 ? (
                  userApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">LV-{selectedYear}-{app.id.padStart(3, '0')}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(app.appliedDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getLeaveTypeName(app.leaveTypeId)}</TableCell>
                      <TableCell>
                        {format(new Date(app.startDate), 'MMM d')} -{' '}
                        {format(new Date(app.endDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{app.days}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(app.status)} gap-1`}
                        >
                          {app.status === 'approved' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {getStatusLabel(app.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No leave applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>

      </div>
    </Layout>
  )
}

export default LeaveHistory