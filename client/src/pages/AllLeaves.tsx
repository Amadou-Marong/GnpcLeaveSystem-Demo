import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { departments, getStatusColor, getStatusLabel, leaveApplications, leaveTypes, users } from "@/data/dummyData";
import { Layout } from "@/layout/Layout"
import { useAuthStore } from "@/store/auth.store"
import { Download, Eye, Search } from "lucide-react";
import { useState } from "react";

const AllLeaves = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<typeof leaveApplications[0] | null>(null);

  // Filter applications based on user role
  const getFilteredApplications = () => {
    
    let applications = [...leaveApplications];
    if (currentUser?.role === 'hod') {
      applications = applications.filter(
        app => {
          const employee = users.find(user => user.id === app.employeeId);
          return employee?.department === currentUser.department;
        }
    )
  }

  // Apply search filter
  if (searchTerm) {
    applications = applications.filter(app => {
      const employee = users.find(user => user.id === app.employeeId);
      return employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              employee?.staffId.toLowerCase().includes(searchTerm.toLowerCase())
    }) 
  }

  // Apply status Filter
  if (statusFilter !== 'all') {
    applications = applications.filter((app) => app.status === statusFilter)
  }

  // Apply Department Filter
  if (departmentFilter !== 'all') {
    applications = applications.filter((app) => {
      const employee = users.find(user => user.id === app.employeeId)
      return employee?.department.toLowerCase().includes(departmentFilter.toLowerCase())
    })
  }
  
  return applications

}

  const filteredApplications = getFilteredApplications();
  
  const getPageTitle = () => {
    switch (currentUser?.role) {
      case 'admin':
        return 'All Leave Applications'
      case 'hod':
        return 'All Department Leaves'
      case 'hr':
        return 'Organization Leave Applications'
      default:
        return 'Leave Applications'
    }
  }

  const getPageDescription = () => {
    switch (currentUser?.role) {
      case 'admin':
        return 'View and manage all leave applications in the organization'
      case 'hod':
        return 'View all leave applications submitted by employees in your department.'
      case 'hr':
        return 'View all leave applications submitted by employees in your organization.'
      default:
        return 'View all leave applications submitted by employees.'
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            <p className="text-muted-foreground">{getPageDescription()}</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Additional filters */}

            {(currentUser?.role === 'admin' || currentUser?.role === 'hr') && (
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending_hod">Pending HOD Approval</SelectItem>
                <SelectItem value="pending_admin">Pending Admin Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-foreground">{filteredApplications.length}</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-warning">
              {filteredApplications.filter(a => a.status === 'pending_hod' || a.status === 'pending_admin').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-success">
              {filteredApplications.filter(a => a.status === 'approved').length}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-destructive">
              {filteredApplications.filter(a => a.status === 'rejected').length}
            </div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-card rounded-xl border border-border p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No leave applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => {
                  const employee = users.find(u => u.id === app.employeeId);
                  const leaveType = leaveTypes.find(lt => lt.id === app.leaveTypeId);
                  return (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {employee?.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{employee?.name}</div>
                            <div className="text-xs text-muted-foreground">{employee?.staffId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{employee?.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: leaveType?.color }} />
                          {leaveType?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{app.days}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(app.status)}>
                          {getStatusLabel(app.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
            Showing {filteredApplications.length} of {leaveApplications.length} entries
          </div>
        </div>

        {/* View Application Dialog */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Leave Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && (() => {
              const employee = users.find(u => u.id === selectedApplication.employeeId);
              const leaveType = leaveTypes.find(lt => lt.id === selectedApplication.leaveTypeId);
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {employee?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{employee?.name}</div>
                      <div className="text-sm text-muted-foreground">{employee?.department} • {employee?.designation}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Leave Type:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: leaveType?.color }} />
                        <span className="font-medium">{leaveType?.name}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="mt-1">
                        <Badge variant="outline" className={getStatusColor(selectedApplication.status)}>
                          {getStatusLabel(selectedApplication.status)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>
                      <div className="font-medium mt-1">{new Date(selectedApplication.startDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End Date:</span>
                      <div className="font-medium mt-1">{new Date(selectedApplication.endDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Days:</span>
                      <div className="font-medium mt-1">{selectedApplication.days} days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Applied On:</span>
                      <div className="font-medium mt-1">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Reason:</span>
                    <p className="mt-1 text-sm bg-muted/50 p-3 rounded-lg">{selectedApplication.reason}</p>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  )
}

export default AllLeaves