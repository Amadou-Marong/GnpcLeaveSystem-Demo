import { toast } from "@/hooks/use-toast";
import { addRole, updateRole, type Permission, type RoleDefinition } from "@/lib/permissions";
// import { allPermissions } from "@/pages/RolesPermissions";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { allPermissions } from "@/data/permssions";

const permissionGroups = [...new Set(allPermissions.map(p => p.group))]

// ─── Add / Edit Role Dialog ───────────────────────────────────────
const RoleDialog = ({
  open,
  onOpenChange,
  editRole,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRole: RoleDefinition | null;
}) => {
  const isEdit = !!editRole;
  const [label, setLabel] = useState(editRole?.label ?? '');
  const [description, setDescription] = useState(editRole?.description ?? '');
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>(editRole?.permissions ?? []);

  const resetAndClose = () => {
    setLabel('');
    setDescription('');
    setSelectedPerms([]);
    onOpenChange(false);
  };

  // Reset when dialog opens with new data
  const handleOpenChange = (v: boolean) => {
    if (v && editRole) {
      setLabel(editRole.label);
      setDescription(editRole.description);
      setSelectedPerms([...editRole.permissions]);
    }
    if (!v) resetAndClose();
    else onOpenChange(v);
  };

  const handleSave = () => {
    if (!label.trim()) {
      toast({ title: 'Error', description: 'Role name is required', variant: 'destructive' });
      return;
    }
    if (isEdit && editRole) {
      updateRole(editRole.key, { label, description, permissions: selectedPerms });
      toast({ title: 'Role Updated', description: `${label} has been updated` });
    } else {
      const key = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      addRole({ key, label, description, permissions: selectedPerms, isBuiltIn: false });
      toast({ title: 'Role Created', description: `${label} has been created` });
    }
    resetAndClose();
  };

  const togglePerm = (p: Permission) => {
    setSelectedPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const toggleGroup = (group: string) => {
    const groupPerms = allPermissions.filter(p => p.group === group).map(p => p.key);
    const allSelected = groupPerms.every(p => selectedPerms.includes(p as any));
    if (allSelected) {
      setSelectedPerms(prev => prev.filter(p => !groupPerms.includes(p as any)));
    } else {
      // setSelectedPerms(prev => [...new Set([...prev, ...groupPerms])]);
      setSelectedPerms(prev => {
        const newPerms = [...prev];
        for (const p of groupPerms) {
          if (!newPerms.includes(p as any)) newPerms.push(p as any);
        }
        return newPerms;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Role' : 'Create Custom Role'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Role Name</Label>
            <Input className="mt-1" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Supervisor" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea className="mt-1" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this role" rows={2} />
          </div>
          <div>
            <Label>Permissions ({selectedPerms.length} selected)</Label>
            <div className="mt-2 space-y-3 max-h-64 overflow-y-auto border rounded-md p-3">
              {permissionGroups.map(group => {
                const groupPerms = allPermissions.filter(p => p.group === group);
                const allSelected = groupPerms.every(p => selectedPerms.includes(p.key as any));
                const someSelected = groupPerms.some(p => selectedPerms.includes(p.key as any));
                return (
                  <div key={group}>
                    <div
                      className="flex items-center justify-between cursor-pointer py-1"
                      onClick={() => toggleGroup(group)}
                    >
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{group}</span>
                      <Badge variant={allSelected ? 'default' : someSelected ? 'secondary' : 'outline'} className="text-[10px] h-5">
                        {groupPerms.filter(p => selectedPerms.includes(p.key as any)).length}/{groupPerms.length}
                      </Badge>
                    </div>
                    {groupPerms.map(perm => (
                      <div key={perm.key} className="flex items-center justify-between py-1 pl-2">
                        <span className="text-sm">{perm.label}</span>
                        <Switch
                          checked={selectedPerms.includes(perm.key as any)}
                          onCheckedChange={() => togglePerm(perm.key as any)}
                          className="scale-75"
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? 'Save Changes' : 'Create Role'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;