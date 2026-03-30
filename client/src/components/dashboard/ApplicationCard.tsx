import { Calendar, Building2, Clock, Briefcase } from 'lucide-react';
import { type LeaveApplication, users, leaveTypes, getStatusLabel, getStatusColor } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ApplicationCardProps {
  application: LeaveApplication;
  showEmployee?: boolean;
}

const ApplicationCard = ({ application, showEmployee = false }: ApplicationCardProps) => {
  const employee = users.find(u => u.id === application.employeeId);
  const leaveType = leaveTypes.find(lt => lt.id === application.leaveTypeId);

  if (!employee || !leaveType) return null;

  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {showEmployee && (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <div>
            {showEmployee && <p className="font-medium text-foreground">{employee.name}</p>}
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                style={{ backgroundColor: `${leaveType.color}20`, color: leaveType.color }}
              >
                {leaveType.name}
              </Badge>
              <span className="text-sm text-muted-foreground">• {application.days} days</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className={cn('text-xs', getStatusColor(application.status))}>
          {getStatusLabel(application.status)}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{application.startDate} - {application.endDate}</span>
        </div>
        {showEmployee && (
          <>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{employee.designation}</span>
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Applied {application.appliedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
