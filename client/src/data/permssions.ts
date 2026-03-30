import type { PermissionDef } from "@/components/admin/RoleCard";
import { getAllRoles, subscribeRoles, type RoleDefinition } from "@/lib/permissions";
import { useSyncExternalStore } from "react";

export const allPermissions: PermissionDef[] = [
    { key: 'apply_leave', label: 'Apply for Leave', group: 'Leave Actions' },
    { key: 'view_own_applications', label: 'View Own Applications', group: 'Leave Actions' },
    { key: 'view_leave_history', label: 'View Own Leave History', group: 'Leave Actions' },
    { key: 'apply_on_behalf', label: 'Apply on Behalf of Others', group: 'Leave Actions' },
    { key: 'pending_reviews', label: 'Review Team Applications', group: 'Review & Approval' },
    { key: 'pending_verification', label: 'Verify Leave Applications', group: 'Review & Approval' },
    { key: 'pending_approvals', label: 'Final Approve/Reject Leave', group: 'Review & Approval' },
    { key: 'approve_leave', label: 'Endorse/Approve Requests', group: 'Review & Approval' },
    { key: 'reject_leave', label: 'Reject Leave Requests', group: 'Review & Approval' },
    { key: 'view_all_leaves', label: 'View All Applications', group: 'Administration' },
    { key: 'manage_leave_balances', label: 'Manage Leave Balances', group: 'Administration' },
    { key: 'manage_leave_types', label: 'Manage Leave Types', group: 'Administration' },
    { key: 'manage_leave_policies', label: 'Manage Leave Entitlements', group: 'Administration' },
    { key: 'manage_employees', label: 'Manage Employees', group: 'Administration' },
    { key: 'add_employee', label: 'Add New Employee', group: 'Administration' },
    { key: 'edit_employee', label: 'Edit Employee Details', group: 'Administration' },
    { key: 'change_employee_category', label: 'Change Employee Category', group: 'Administration' },
    { key: 'view_org_calendar', label: 'Organization Calendar', group: 'Calendars & Reports' },
    { key: 'view_team_calendar', label: 'Team Calendar', group: 'Calendars & Reports' },
    { key: 'view_reports', label: 'View Reports', group: 'Calendars & Reports' },
    { key: 'view_audit_logs', label: 'View Audit Logs', group: 'Calendars & Reports' },
    { key: 'manage_departments', label: 'Manage Departments', group: 'Settings' },
    { key: 'manage_holidays', label: 'Manage Holidays', group: 'Settings' },
    { key: 'manage_roles', label: 'Manage Roles & Permissions', group: 'Settings' },
]



export const permissionGroups = [...new Set(allPermissions.map(p => p.group))]

export function useRoles(): RoleDefinition[] {
    return useSyncExternalStore(subscribeRoles, getAllRoles, getAllRoles);
}

