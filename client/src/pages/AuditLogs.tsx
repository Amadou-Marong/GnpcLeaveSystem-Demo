import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users } from "@/data/dummyData";
import { Layout } from "@/layout/Layout"
import { Search } from "lucide-react";
import { useState } from "react";

// Dummy audit logs data
const auditLogs = [
  {
    id: '1',
    timestamp: '2024-12-10 9:00 AM',
    action: 'Submitted',
    performedById: '1',
    entity: 'LV-2024-001',
    details: 'Annual Leave - 5 days',
  },
  {
    id: '2',
    timestamp: '2024-12-11 2:30 PM',
    action: 'HOD Endorsed',
    performedById: '3',
    entity: 'LV-2024-002',
    details: 'endorsed',
  },
  {
    id: '3',
    timestamp: '2024-12-06 9:00 AM',
    action: 'Admin Verified',
    performedById: '5',
    entity: 'LV-2024-003',
    details: '-',
  },
];

const getActionColor = (action: string) => {
  switch (action) {
    case 'Submitted':
      return 'bg-info/10 text-info border-info/20';
    case 'HOD Endorsed':
      return 'bg-success/10 text-success border-success/20';
    case 'Admin Verified':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Approved':
      return 'bg-success/10 text-success border-success/20';
    case 'Rejected':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getRoleBadge = (userId: string) => {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  
  const roleColors: Record<string, string> = {
    admin: 'bg-primary/10 text-primary',
    hod: 'bg-warning/10 text-warning',
    staff: 'bg-muted text-muted-foreground',
    hr: 'bg-success/10 text-success',
  };
  
  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    hod: 'Hod',
    staff: 'Staff',
    hr: 'Director',
  };

  return (
    <Badge variant="secondary" className={roleColors[user.role]}>
      {roleLabels[user.role]}
    </Badge>
  );
};

const AuditLogs = () => {
  const [actionFilter, setActionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const user = users.find(u => u.id === log.performedById);
    const matchesSearch = searchTerm === '' ||
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-muted-forground">Track all system activities and changes</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by user or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="HOD Endorsed">HOD Endorsed</SelectItem>
              <SelectItem value="Admin Verified">Admin Verified</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <div className="bg-card rounded-xl border border-border p-4"> 
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const user = users.find(u => u.id === log.performedById);
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{user?.name}</div>
                          <div className="text-xs text-muted-foreground">{user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(log.performedById)}</TableCell>
                      <TableCell className="font-medium text-primary">{log.entity}</TableCell>
                      <TableCell className="text-muted-foreground">{log.details}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {auditLogs.length} entries
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default AuditLogs