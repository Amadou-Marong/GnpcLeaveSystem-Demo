import { useState } from 'react';
// import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Building2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/data/dummyData';
import { Layout } from '@/layout/Layout';

export interface Department {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const initialDepartments: Department[] = [
  { id: '1', name: 'Human Resources', description: 'Manages employee relations, recruitment, and policies', isActive: true },
  { id: '2', name: 'Information Technology', description: 'Handles all technology infrastructure and software development', isActive: true },
  { id: '3', name: 'Finance & Accounts', description: 'Manages financial operations, budgets, and accounting', isActive: true },
  { id: '4', name: 'Operations', description: 'Oversees day-to-day business operations and logistics', isActive: true },
  { id: '5', name: 'Marketing', description: 'Drives brand strategy, campaigns, and market research', isActive: true },
];

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  const openAdd = () => {
    setEditingDept(null);
    setName('');
    setDescription('');
    setIsActive(true);
    setDialogOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description);
    setIsActive(dept.isActive);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: 'Error', description: 'Department name is required', variant: 'destructive' });
      return;
    }

    if (editingDept) {
      setDepartments(prev => prev.map(d => d.id === editingDept.id ? { ...d, name, description, isActive } : d));
      toast({ title: 'Updated', description: `${name} has been updated` });
    } else {
      const newDept: Department = {
        id: String(Date.now()),
        name,
        description,
        isActive,
      };
      setDepartments(prev => [...prev, newDept]);
      toast({ title: 'Created', description: `${name} has been added` });
    }
    setDialogOpen(false);
  };

  const getEmployeeCount = (deptName: string) =>
    users.filter(u => u.department === deptName).length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Departments</h1>
            <p className="text-sm text-muted-foreground">Manage organizational departments</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Engineering" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the department" rows={3} />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <Label>Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>{editingDept ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <Card key={dept.id} className="group relative hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{dept.name}</CardTitle>
                      <Badge variant={dept.isActive ? 'default' : 'secondary'} className="mt-1 text-[10px]">
                        {dept.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openEdit(dept)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{dept.description || 'No description'}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{getEmployeeCount(dept.name)} employee{getEmployeeCount(dept.name) !== 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Departments;
