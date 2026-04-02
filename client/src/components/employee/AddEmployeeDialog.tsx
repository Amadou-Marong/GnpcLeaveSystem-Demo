import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments,  gradeCategories, type UserRole } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';

interface AddEmployeeDialogProps {
  onAdd: (employee: {
    name: string;
    email: string;
    phone: string;
    staffId: string;
    department: string;
    designation: string;
    role: UserRole;
    categoryLevel: string;
    dateOfJoining: string;
    password: string;
    confirmPassword: string;
  }) => void;
}

const AddEmployeeDialog = ({ onAdd }: AddEmployeeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    staffId: '',
    department: '',
    designation: '',
    role: 'staff' as UserRole,
    categoryLevel: 'III',
    dateOfJoining: new Date().toISOString().split('T')[0],
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.staffId || !form.department || !form.designation) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    onAdd(form);
    setForm({
      name: '', email: '', phone: '', staffId: '', department: '',
      designation: '', role: 'staff', categoryLevel: 'III',
      dateOfJoining: new Date().toISOString().split('T')[0],
      password: '',
      confirmPassword: '',
    });
    setOpen(false);
    toast({ title: "Success", description: `${form.name} has been added as a new employee` });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Staff ID *</Label>
              <Input value={form.staffId} onChange={e => setForm({ ...form, staffId: e.target.value })} placeholder="e.g. STF004" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Designation *</Label>
              <Input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Analyst" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="hod">HOD</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="approving_authority">Approving Authority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category Level</Label>
              <Select value={form.categoryLevel} onValueChange={v => setForm({ ...form, categoryLevel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {gradeCategories.map(c => (
                    <SelectItem key={c.level} value={c.level}>
                      {c.level} — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date of Joining</Label>
              <Input type="date" value={form.dateOfJoining} onChange={e => setForm({ ...form, dateOfJoining: e.target.value })} />
            </div>
          </div>
          {/* Password Fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
          </div>

          {form.password !== form.confirmPassword && <p className="text-red-500 text-sm text-center">Passwords do not match</p>}


          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Employee</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
