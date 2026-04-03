import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { KeyRound } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ResetPasswordDialogProps {
  userName: string;
  onReset: (newPassword: string, mustChangePassword: boolean) => void;
}

const ResetPasswordDialog = ({ userName, onReset }: ResetPasswordDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mustChange, setMustChange] = useState(true);

  const handleSubmit = () => {
    if (newPassword.length < 4) {
      toast({ title: 'Error', description: 'Password must be at least 4 characters', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    onReset(newPassword, mustChange);
    toast({ title: 'Password Reset', description: `Password for ${userName} has been reset successfully` });
    setOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setMustChange(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <KeyRound className="w-4 h-4" />
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Set a new password for {userName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Must change password on next login</p>
              <p className="text-xs text-muted-foreground">User will be forced to set a new password</p>
            </div>
            <Switch checked={mustChange} onCheckedChange={setMustChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Reset Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
