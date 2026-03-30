import { type UserRole } from "@/data/dummyData";

export type Permission =
  // Leave actions
  | 'apply_leave'
  | 'apply_on_behalf'
  | 'view_own_applications'
  | 'view_leave_history'
  // Review & approval
  | 'pending_verification'
  | 'pending_reviews'
  | 'pending_approvals'
  | 'approve_leave'
  | 'reject_leave'
  // Admin views
  | 'view_all_leaves'
  | 'manage_leave_balances'
  | 'manage_leave_types'
  | 'manage_leave_policies'
  | 'manage_employees'
  | 'add_employee'
  | 'edit_employee'
  | 'change_employee_category'
  // Calendars
  | 'view_org_calendar'
  | 'view_team_calendar'
  // Reporting & audit
  | 'view_reports'
  | 'view_audit_logs'
  // Settings
  | 'manage_departments'
  | 'manage_holidays'
  | 'manage_roles';

export interface RoleDefinition {
  key: string;
  label: string;
  description: string;
  permissions: Permission[];
  isBuiltIn: boolean;
}

const defaultRoles: RoleDefinition[] = [
  {
    key: 'admin',
    label: 'Administrator',
    description: 'System administrator with full leave management access',
    isBuiltIn: true,
    permissions: [
      'apply_on_behalf', 'pending_verification', 'approve_leave', 'reject_leave',
      'view_all_leaves', 'manage_leave_balances', 'manage_leave_types', 'manage_leave_policies',
      'manage_employees', 'add_employee', 'edit_employee', 'change_employee_category',
      'view_org_calendar', 'view_reports', 'view_audit_logs', 'manage_departments',
      'manage_holidays', 'manage_roles',
    ],
  },
  {
    key: 'hod',
    label: 'Head of Department',
    description: 'Department head with review and approval responsibilities',
    isBuiltIn: true,
    permissions: [
      'apply_leave', 'apply_on_behalf', 'view_own_applications', 'view_leave_history',
      'pending_reviews', 'approve_leave', 'reject_leave', 'view_all_leaves', 'view_team_calendar',
    ],
  },
  {
    key: 'staff',
    label: 'Staff',
    description: 'Regular employee with basic leave management access',
    isBuiltIn: true,
    permissions: ['apply_leave', 'view_own_applications', 'view_leave_history'],
  },
  {
    key: 'hr',
    label: 'HR Manager',
    description: 'Final approver for leave applications',
    isBuiltIn: true,
    permissions: [
      'pending_approvals', 'approve_leave', 'reject_leave', 'view_all_leaves',
      'view_org_calendar', 'view_audit_logs',
    ],
  },
];

// Mutable store — in-memory for demo
let roles: RoleDefinition[] = [...defaultRoles.map(r => ({ ...r, permissions: [...r.permissions] }))];

// Subscribers for reactivity
type Listener = () => void;
const listeners: Set<Listener> = new Set();
const notify = () => listeners.forEach(fn => fn());
export const subscribeRoles = (fn: Listener) => { listeners.add(fn); return () => listeners.delete(fn); };

export const getAllRoles = (): RoleDefinition[] => roles;

export const getRoleDefinition = (key: string): RoleDefinition | undefined => roles.find(r => r.key === key);

export const addRole = (role: RoleDefinition) => {
  roles = [...roles, role];
  notify();
};

export const updateRole = (key: string, updates: Partial<Omit<RoleDefinition, 'key' | 'isBuiltIn'>>) => {
  roles = roles.map(r => r.key === key ? { ...r, ...updates } : r);
  notify();
};

export const deleteRole = (key: string) => {
  roles = roles.filter(r => r.key !== key);
  notify();
};

export const togglePermission = (roleKey: string, permission: Permission) => {
  roles = roles.map(r => {
    if (r.key !== roleKey) return r;
    const has = r.permissions.includes(permission);
    return {
      ...r,
      permissions: has
        ? r.permissions.filter(p => p !== permission)
        : [...r.permissions, permission],
    };
  });
  notify();
};

// Compat helpers used across the app
export const hasPermission = (role: UserRole | string, permission: Permission): boolean => {
  const def = getRoleDefinition(role);
  return def?.permissions.includes(permission) ?? false;
};

export const hasAnyPermission = (role: UserRole | string, permissions: Permission[]): boolean => {
  return permissions.some(p => hasPermission(role, p));
};

export const getPermissions = (role: UserRole | string): Permission[] => {
  return getRoleDefinition(role)?.permissions ?? [];
};
