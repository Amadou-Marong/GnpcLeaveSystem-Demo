import { leaveTypes } from '@/data/dummyData';
import { Progress } from '@/components/ui/progress';

interface LeaveBalanceCardProps {
  leaveTypeId: string;
  total: number;
  used: number;
  pending: number;
  year: number;
}

const LeaveBalanceCard = ({ leaveTypeId, total, used, pending, year }: LeaveBalanceCardProps) => {
  const leaveType = leaveTypes.find(lt => lt.id === leaveTypeId);
  if (!leaveType) return null;

  const available = total - used - pending;
  const usedPercentage = (used / total) * 100;

  return (
    <div className="bg-card rounded-xl border border-border p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-1 h-8 rounded-full" 
            style={{ backgroundColor: leaveType.color }}
          />
          <div>
            <p className="font-medium text-foreground">{leaveType.name}</p>
            <p className="text-xs text-muted-foreground">{year}</p>
          </div>
        </div>
        <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
          {available} days left
        </span>
      </div>
      
      <Progress 
        value={usedPercentage} 
        className="h-2 mb-3"
        style={{ 
          ['--progress-color' as string]: leaveType.color 
        }}
      />
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Used: {used}</span>
        {pending > 0 && <span className="text-warning">Pending: {pending}</span>}
        <span>Total: {total}</span>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
