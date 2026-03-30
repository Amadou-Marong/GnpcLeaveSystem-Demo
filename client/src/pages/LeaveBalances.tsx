import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { leaveBalances, leaveTypes, users } from "@/data/dummyData"
import { toast } from "@/hooks/use-toast"
import { Layout } from "@/layout/Layout"
import { ArrowLeft, Download, Pencil, Plus, Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"

const LeaveBalances = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedBalance, setSelectedBalance] = useState<any>(null);
  const [editForm, setEditForm] = useState({ total: 0, used: 0, pending: 0 });
  const [addForm, setAddForm] = useState({ employeeId: '', leaveTypeId: '', total: 21, year: new Date().getFullYear() });

  const enrichedBalances = leaveBalances.map(balance => {
    const employee = users.find(user => user.id === balance.employeeId);
    const leaveType = leaveTypes.find(lt => lt.id === balance.leaveTypeId)

    return {...balance, employee, leaveType }
  }).filter(b => b.employee && b.leaveType);

  const filteredBalances = enrichedBalances.filter(balance => {
    const matchesSearch = balance.employee!.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = leaveTypeFilter === 'all' || balance.leaveTypeId  === leaveTypeFilter

    return matchesSearch && matchesType
  })

  const availableBalance = editForm.total - editForm.used - editForm.pending;

  const handleSaveChanges = () => {
    toast({
      title: "Balance Updated",
      description: "Leave balance has been successfully updated.",
    });
    setEditDialogOpen(false);
    setSelectedBalance(null);
  }


  

  const openEditDialog = (balanceId: string) => {
    const balanceData = enrichedBalances.find(b => b.id === balanceId);
    if (balanceData) {
      setSelectedBalance(balanceData);
      setEditForm({ total: balanceData.total, used: balanceData.used, pending: balanceData.pending });
      setEditDialogOpen(true);
    }
  }

  const handleAddBalance = () => {
    if (!addForm.employeeId || !addForm.leaveTypeId) {
      toast({
        title: "Missing Fields",
        description: "Please select an employee and leave type.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Balance Added",
      description: "New leave balance has been successfully created.",
    });
    setAddDialogOpen(false);
    setAddForm({ employeeId: '', leaveTypeId: '', total: 21, year: new Date().getFullYear() });
  }

  

  return (
    <Layout>
      <div className="space-y-6">
        <Link to="/leave-policies" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Leave Policies
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leave Balances</h1>
            <p className="text-muted-foreground">Manage employee leave allocations</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => {}}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Balance
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row  gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={leaveTypeFilter}
            onValueChange={(value) => setLeaveTypeFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by leave type" />
            </SelectTrigger>
            <SelectContent>
              {leaveTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
              <SelectItem value="all">All Leave Types</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border p-4">
            <Table>
              <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredBalances.map((balance) => {
                    const available = balance.total - balance.used - balance.pending

                    return(
                      <TableRow key={balance.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                {balance.employee!.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{balance.employee!.name}</p>
                                <p className="text-sm text-muted-foreground">{balance.employee!.staffId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{balance.leaveType!.name}</TableCell>
                          <TableCell>{balance.year}</TableCell>
                          <TableCell>{balance.total}</TableCell>
                          <TableCell>{balance.used}</TableCell>
                          <TableCell>
                              <span className={balance.pending > 0 ? 'text-warning font-medium' : 'text-foreground'}>
                                {balance.pending}
                              </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-primary font-semibold">{available}</span>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => openEditDialog(balance.id)}
                              // onClick={() => {}}
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Button>
                          </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
        </div>
        
        {/* Edit Leave Balance Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
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
                      value={editForm.total}
                      onChange={(e) => setEditForm(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="used">Used Days</Label>
                    <Input
                      id="used"
                      type="number"
                      value={editForm.used}
                      onChange={(e) => setEditForm(prev => ({ ...prev, used: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pending">Pending Days</Label>
                    <Input
                      id="pending"
                      type="number"
                      value={editForm.pending}
                      onChange={(e) => setEditForm(prev => ({ ...prev, pending: parseInt(e.target.value) || 0 }))}
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
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </DialogFooter>

            </DialogContent>
        </Dialog>

        {/* Add Leave Balance Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Leave Balance</DialogTitle>
              <DialogDescription>
                Create a new leave balance allocation for an employee.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select value={addForm.employeeId} onValueChange={(value) => setAddForm(prev => ({ ...prev, employeeId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.role === 'staff' || u.role === 'hod').map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name} ({user.staffId})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select value={addForm.leaveTypeId} onValueChange={(value) => setAddForm(prev => ({ ...prev, leaveTypeId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((lt) => (
                      <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalDays">Total Days</Label>
                  <Input
                    id="totalDays"
                    type="number"
                    value={addForm.total}
                    onChange={(e) => setAddForm(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={addForm.year}
                    onChange={(e) => setAddForm(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBalance}>
                Add Balance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  )
}

export default LeaveBalances