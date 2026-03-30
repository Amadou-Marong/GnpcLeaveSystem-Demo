import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Layout } from "@/layout/Layout"
import { ArrowLeft, Edit, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import { leaveEntitlements as initialEntitlements, gradeCategories as initialCategories,type GradeCategory, type LeaveEntitlement, leaveTypes } from "@/data/dummyData"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const currentYear = new Date().getFullYear();
const availableYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

const LeaveEntitlements = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [entitlements, setEntitlements] = useState<LeaveEntitlement[]>(initialEntitlements);
  const [categories] = useState<GradeCategory[]>(initialCategories);

  const [isEntitlementDialogOpen, setIsEntitlementDialogOpen] = useState(false);
  const [editingEntitlement, setEditingEntitlement] = useState<LeaveEntitlement | null>(null);
  const [entitlementForm, setEntitlementForm] = useState({
    id: "",
    leaveTypeId: "",
    gradeCategoryId: "",
    entitledDays: 0,
    year: new Date().getFullYear(),
  });

  const openEditEntitlement = (entitlement: LeaveEntitlement) => {
    setEditingEntitlement(entitlement);
    setEntitlementForm(entitlement);
    setIsEntitlementDialogOpen(true);
  }

  const handleSaveEntitlement = () => {
    if (editingEntitlement) {
      // Update existing entitlement
      setEntitlements(entitlements.map(e => (e.id === editingEntitlement.id ? { ...e, ...entitlementForm } : e)));
    } else {
      // Create new entitlement
      const newEntitlement = {
        ...entitlementForm,
        id: (entitlements.length + 1).toString(),
      };
      setEntitlements([...entitlements, newEntitlement]);
    }
    setIsEntitlementDialogOpen(false);
  };
  

  const yearsWithData = [...new Set(entitlements.map(e => e.year))].sort();

  const filteredEntitlements = entitlements.filter(e => {
    const matchesSearch = e.gradeCategoryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.leaveTypeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = e.year === selectedYear;
    return matchesSearch && matchesYear;
  });
 
  return (
    <Layout>
        <div className="space-y-6">
            <Link to="/leave-policies" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Leave Policies
            </Link>
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Leave Entitlements</h1>
                  <p className="text-muted-foreground">Manage leave days allocation by employee grade/category</p>
                </div>
                <Button onClick={() => setIsEntitlementDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Entitlement
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search grade or leave type..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <Select value={String(selectedYear)} onValueChange={v => setSelectedYear(Number(v))}>
                <SelectTrigger className="w-25">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set([...availableYears, ...yearsWithData])].sort().map(y => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade Category</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead className="text-center">Entitled Days</TableHead>
                      <TableHead className="text-center">Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntitlements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No entitlements found for {selectedYear}. Add an entitlement or copy from a previous year.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEntitlements.map(ent => {
                        const cat = categories.find(c => c.id === ent.gradeCategoryId);
                        const lt = leaveTypes.find(t => t.id === ent.leaveTypeId);
                        return (
                          <TableRow key={ent.id}>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">{cat?.level || '?'}</Badge>
                              <span className="ml-2 text-muted-foreground text-sm">{cat?.name}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lt?.color }} />
                                {lt?.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-semibold text-primary">{ent.entitledDays} days</TableCell>
                            <TableCell className="text-center">{ent.year}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                {/* <Button variant="ghost" size="icon" onClick={() => openEditEntitlement(ent)}> */}
                                <Button variant="ghost" size="icon" onClick={() => openEditEntitlement(ent)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {/* <Button variant="ghost" size="icon" onClick={() => handleDeleteEntitlement(ent.id)}> */}
                                <Button variant="ghost" size="icon" onClick={() => {}}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
            </div>
          
          {/* Add/Edit Entitlement Dialog */}
          <Dialog open={isEntitlementDialogOpen} onOpenChange={setIsEntitlementDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingEntitlement ? 'Edit Entitlement' : 'Add Entitlement'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeCategory">Grade Category</Label>
                  <Select
                    value={editingEntitlement?.gradeCategoryId || ''}
                    onValueChange={(value) => setEntitlementForm(prev => ({ ...prev, gradeCategoryId: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a grade category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select
                    value={editingEntitlement?.leaveTypeId || ''}
                    onValueChange={(value) => setEntitlementForm(prev => ({ ...prev, leaveTypeId: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map(lt => (
                        <SelectItem key={lt.id} value={lt.id}>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lt.color }} />
                            {lt.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entitledDays">Entitled Days</Label>
                    <Input
                      type="number"
                      id="entitledDays"
                      value={editingEntitlement?.entitledDays || ''}
                      onChange={(e) => setEntitlementForm(prev => ({ ...prev, entitledDays: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={editingEntitlement?.year ? String(editingEntitlement.year) : ''}
                      onValueChange={(value) => setEntitlementForm(prev => ({ ...prev, year: Number(value) }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map(y => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEntitlementDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveEntitlement}>{editingEntitlement ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
    </Layout>
  )
}

export default LeaveEntitlements