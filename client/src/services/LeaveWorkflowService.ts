import { leaveApplications, leaveBalances, users, type LeaveApplication, type LeaveBalance, type User } from '@/data/dummyData';

type ActionType = 'endorse' | 'approve' | 'reject';

type WorkflowPayload = {
  comments?: string;
};

const getCurrentYear = () => 2024; // using your dummy data year

export const getLeaveBalance = (employeeId: string, leaveTypeId: string): LeaveBalance | undefined => {
  return leaveBalances.find(
    (b) =>
      b.employeeId === employeeId &&
      b.leaveTypeId === leaveTypeId &&
      b.year === getCurrentYear()
  );
};

export const getAvailableBalance = (employeeId: string, leaveTypeId: string): number => {
  const balance = getLeaveBalance(employeeId, leaveTypeId);
  if (!balance) return 0;
  return balance.total - balance.used - balance.pending;
};

/**
 * Reserve leave as pending when application is created
 * (Use this in your leave application submit form later)
 */
export const reservePendingLeave = (
  employeeId: string,
  leaveTypeId: string,
  days: number
): { success: boolean; message: string } => {
  const balance = getLeaveBalance(employeeId, leaveTypeId);

  if (!balance) {
    return { success: false, message: 'Leave balance record not found.' };
  }

  const available = balance.total - balance.used - balance.pending;

  if (available < days) {
    return { success: false, message: 'Insufficient leave balance.' };
  }

  balance.pending += days;

  return { success: true, message: 'Leave reserved successfully.' };
};

/**
 * Final approval:
 * move from pending -> used
 */
export const finalizeLeaveBalance = (
  employeeId: string,
  leaveTypeId: string,
  days: number
): { success: boolean; message: string } => {
  const balance = getLeaveBalance(employeeId, leaveTypeId);

  if (!balance) {
    return { success: false, message: 'Leave balance record not found.' };
  }

  balance.pending = Math.max(0, balance.pending - days);
  balance.used += days;

  return { success: true, message: 'Leave balance updated successfully.' };
};

/**
 * Rejection:
 * remove from pending
 */
export const releasePendingLeave = (
  employeeId: string,
  leaveTypeId: string,
  days: number
): { success: boolean; message: string } => {
  const balance = getLeaveBalance(employeeId, leaveTypeId);

  if (!balance) {
    return { success: false, message: 'Leave balance record not found.' };
  }

  balance.pending = Math.max(0, balance.pending - days);

  return { success: true, message: 'Pending leave released successfully.' };
};

export const processLeaveAction = (
  applicationId: string,
  action: ActionType,
  actor: User,
  payload?: WorkflowPayload
): { success: boolean; message: string; application?: LeaveApplication } => {
  const application = leaveApplications.find((a) => a.id === applicationId);

  if (!application) {
    return { success: false, message: 'Application not found.' };
  }

  // HOD stage
  if (actor.role === 'hod') {
    if (application.status !== 'pending_hod') {
      return { success: false, message: 'This application is not awaiting HOD action.' };
    }

    if (action === 'endorse') {
      application.status = 'pending_admin';
      application.hodComment = payload?.comments || 'Endorsed by HOD';
      return {
        success: true,
        message: 'Application endorsed and forwarded to HR/Admin.',
        application,
      };
    }

    if (action === 'reject') {
      application.status = 'rejected';
      application.hodComment = payload?.comments || 'Rejected by HOD';
      releasePendingLeave(application.employeeId, application.leaveTypeId, application.days);

      return {
        success: true,
        message: 'Application rejected by HOD.',
        application,
      };
    }

    return { success: false, message: 'Invalid action for HOD.' };
  }

  // HR / Admin stage (verification + final approval in one flow)
  if (actor.role === 'hr' || actor.role === 'admin') {
    if (application.status !== 'pending_admin') {
      return { success: false, message: 'This application is not awaiting HR/Admin action.' };
    }

    if (action === 'approve') {
      application.status = 'approved';
      application.adminComment = payload?.comments || 'Verified and approved';

      finalizeLeaveBalance(application.employeeId, application.leaveTypeId, application.days);

      return {
        success: true,
        message: 'Application verified, approved, and leave balance updated.',
        application,
      };
    }

    if (action === 'reject') {
      application.status = 'rejected';
      application.adminComment = payload?.comments || 'Rejected by HR/Admin';

      releasePendingLeave(application.employeeId, application.leaveTypeId, application.days);

      return {
        success: true,
        message: 'Application rejected by HR/Admin.',
        application,
      };
    }

    return { success: false, message: 'Invalid action for HR/Admin.' };
  }

  return { success: false, message: 'You are not authorized to process this application.' };
};

export const getApplicationsForRole = (role?: User['role']) => {
  if (!role) return [];

  if (role === 'hod') {
    return leaveApplications.filter((app) => app.status === 'pending_hod');
  }

  if (role === 'hr' || role === 'admin') {
    return leaveApplications.filter((app) => app.status === 'pending_admin');
  }

  return [];
};

export const getApplicationEmployee = (employeeId: string) => {
  return users.find((u) => u.id === employeeId);
};