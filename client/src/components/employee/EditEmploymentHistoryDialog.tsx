import { useState } from 'react';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { departments, EmploymentHistory } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';
import { departments, type EmploymentHistory } from '@/data/dummyData';

interface EditEmploymentHistoryDialogProps {
  history: EmploymentHistory[];
  onSave: (history: EmploymentHistory[]) => void;
}

const EditEmploymentHistoryDialog = ({ history, onSave }: EditEmploymentHistoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [editableHistory, setEditableHistory] = useState<EmploymentHistory[]>(history);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EmploymentHistory>>({});

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setEditableHistory([...history]);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleAddNew = () => {
    const newEntry: EmploymentHistory = {
      id: `new-${Date.now()}`,
      position: '',
      department: '',
      startDate: new Date().toISOString().split('T')[0],
      isCurrent: false,
    };
    setEditableHistory([...editableHistory, newEntry]);
    setEditingId(newEntry.id);
    setEditForm(newEntry);
  };

  const handleEdit = (entry: EmploymentHistory) => {
    setEditingId(entry.id);
    setEditForm({ ...entry });
  };

  const handleSaveEntry = () => {
    if (!editForm.position || !editForm.department || !editForm.startDate) {
      toast({
        title: "Validation Error",
        description: "Position, department, and start date are required.",
        variant: "destructive",
      });
      return;
    }

    // If setting this as current, remove current status from others
    let updatedHistory = editableHistory.map(h => 
      h.id === editingId 
        ? { ...h, ...editForm } as EmploymentHistory
        : editForm.isCurrent ? { ...h, isCurrent: false } : h
    );

    setEditableHistory(updatedHistory);
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    setEditableHistory(editableHistory.filter(h => h.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleSaveAll = () => {
    onSave(editableHistory);
    toast({
      title: "Employment History Updated",
      description: "Changes have been saved successfully.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="w-4 h-4" />
          Edit History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employment History</DialogTitle>
          <DialogDescription>
            Add, edit, or remove employment history entries
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {editableHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No employment history entries</p>
          ) : (
            editableHistory.map((entry) => (
              <div key={entry.id} className="border border-border rounded-lg p-4">
                {editingId === entry.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Position *</Label>
                        <Input
                          value={editForm.position || ''}
                          onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                          placeholder="e.g., Software Developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Department *</Label>
                        <Select 
                          value={editForm.department || ''} 
                          onValueChange={(value) => setEditForm({ ...editForm, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Input
                          type="date"
                          value={editForm.startDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={editForm.endDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                          disabled={editForm.isCurrent}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editForm.isCurrent || false}
                          onCheckedChange={(checked) => setEditForm({ 
                            ...editForm, 
                            isCurrent: checked,
                            endDate: checked ? undefined : editForm.endDate 
                          })}
                        />
                        <Label>Current Position</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                        <Button size="sm" onClick={handleSaveEntry}>Save Entry</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{entry.position || 'Untitled Position'}</p>
                      <p className="text-sm text-muted-foreground">{entry.department}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.startDate} - {entry.isCurrent ? 'Present' : entry.endDate || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.isCurrent && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Current</span>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          <Button variant="outline" className="w-full gap-2" onClick={handleAddNew}>
            <Plus className="w-4 h-4" />
            Add Entry
          </Button>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="flex-1 gap-2" onClick={handleSaveAll}>
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmploymentHistoryDialog;
