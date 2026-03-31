
export type UserRole = 'admin' | 'hod' | 'staff'  | 'hr';
export type EmploymentHistory = { 
  id: string;
  position: string;
  department: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
};

export interface User {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  department: string;
  designation: string;
  role: UserRole;
  avatar?: string;
  categoryLevel: string;
  employmentHistory?: EmploymentHistory[];
  isActive?: boolean;
  dateJoined?: string;
}

export interface LeaveType {
  id: string;
  name: string;
  description: string;
  defaultDays: number;
  color: string;
  requiresAttachment: boolean;
  isActive: boolean;
}


export interface LeavePolicy {
  id: string;
  name: string;
  description: string;
  categoryLevel: string;
  year: number;
  annualEntitlementDays: number;
  maxCarryOverDays: number;
  applicableLeaveTypes: string[];
  holidays: Holiday[];
  isActive: boolean;
}

export interface LeaveEntitlement {
  id: string;
  gradeCategoryId: string;
  leaveTypeId: string;
  entitledDays: number;
  year: number;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  total: number;
  used: number;
  pending: number;
}


export interface LeaveApplication {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending_hod' | 'pending_admin' | 'approved' | 'rejected';
  appliedDate: string;

  hodComment?: string;
  adminComment?: string;

  hodActionBy?: string;
  hodActionDate?: string;

  adminActionBy?: string;
  adminActionDate?: string;
}


export interface Holiday {
  id: string;
  name: string;
  date: string;
  isRecurring: boolean;
}


export interface GradeCategory {
  id: string;
  name: string;
  level: string;
  description: string;
}



export const users: User[] = [
  {
    id: '1',
    staffId: 'STF001',
    name: 'Emily Johnson',
    email: 'emily.johnson@company.com',
    phone: '1234567890',
    address: '123 Main Street, City',
    password: 'password123',
    department: 'Information Technology',
    designation: 'Software Developer',
    role: 'staff',
    dateJoined: '2022-01-01',
    categoryLevel: 'I',
    employmentHistory: [
      { id: '1', position: 'Junior Developer', department: 'Information Technology', startDate: '2021-03-15', endDate: '2022-06-30', isCurrent: false },
      { id: '2', position: 'Software Developer', department: 'Information Technology', startDate: '2022-07-01', isCurrent: true },
    ],
  },
  {
    id: '2',
    staffId: 'STF002',
    name: 'James Williams',
    password: 'password123',
    email: 'james.williams@company.com',
    phone: '9876543210',
    address: '456 Elm Street, City',
    department: 'Human Resources',
    designation: 'HR Specialist',
    role: 'staff',
    dateJoined: '2022-02-01',
    categoryLevel: 'IV',
     employmentHistory: [
      { id: '1', position: 'HR Assistant', department: 'Human Resources', startDate: '2020-08-01', endDate: '2022-12-31', isCurrent: false },
      { id: '2', position: 'HR Specialist', department: 'Human Resources', startDate: '2023-01-01', isCurrent: true },
    ],
  },
  {
    id: '3',
    staffId: 'MGR001',
    name: 'Sarah Smith',
    password: 'password123',
    email: 'sarah.tech@company.com',
    phone: '5555555555',
    address: '789 Oak Street, City',
    department: 'Information Technology',
    designation: 'IT Manager',
    role: 'hod',
    dateJoined: '2022-03-01',
    categoryLevel: 'II',
    employmentHistory: [
      {
        id: '4',
        position: 'IT Manager',
        department: 'Information Technology',
        startDate: '2022-03-01',
        endDate: '2022-04-01',
        isCurrent: false
      },
      {
        id: '5',
        position: 'IT Director',
        department: 'Information Technology',
        startDate: '2022-01-01',
        isCurrent: true
      }
    ]
  },
  {
    id: '4',
    staffId: 'ADM001',
    name: 'Michael Brown',
    email: 'michael.admin@company.com',
    phone: '9999999999',
    address: '321 Pine Street, City',
    password: 'password123',
    department: 'Human Resources',
    designation: 'HR Administrator',
    role: 'hr',
    dateJoined: '2022-04-01',
    categoryLevel: 'III',
    employmentHistory: [
      { id: '1', position: 'Senior Developer', department: 'Information Technology', startDate: '2018-01-10', endDate: '2020-05-31', isCurrent: false },
      { id: '2', position: 'Team Lead', department: 'Information Technology', startDate: '2020-06-01', endDate: '2022-03-31', isCurrent: false },
      { id: '3', position: 'IT Manager', department: 'Information Technology', startDate: '2022-04-01', isCurrent: true },
    ],
  },
  {
    id: '5',
    staffId: 'DIR001',
    name: 'Patricia Davis',
    email: 'admin@company.com',
    phone: '8888888888',
    address: '654 Maple Street, City',
    password: 'password123',
    department: 'Operations',
    designation: 'Operations Director',
    role: 'admin',
    dateJoined: '2022-05-01',
    categoryLevel: 'I',
    employmentHistory: [
      { id: '1', position: 'Operations Manager', department: 'Operations', startDate: '2015-02-01', endDate: '2018-12-31', isCurrent: false },
      { id: '2', position: 'Senior Operations Manager', department: 'Operations', startDate: '2019-01-01', endDate: '2021-06-30', isCurrent: false },
      { id: '3', position: 'Director of Operations', department: 'Operations', startDate: '2021-07-01', isCurrent: true },
    ]
  },
  {
    id: '6',
    staffId: 'STF003',
    name: 'Robert Garcia',
    email: 'robert.garcia@company.com',
    phone: '7777777777',
    address: '987 Cedar Street, City',
    password: 'password123',
    department: 'Finance & Accounts',
    designation: 'Financial Analyst',
    role: 'staff',
    dateJoined: '2022-06-01',
    categoryLevel: 'III',
    employmentHistory: [
      {
        id: '8',
        position: 'Financial Analyst',
        department: 'Finance & Accounts',
        startDate: '2022-06-01',
        isCurrent: true
      }
    ]
  },
  {
    id: '7',
    staffId: 'MGR002',
    name: 'John Martinez',
    email: 'john.manager@company.com',
    phone: '6666666666',
    address: '543 Oak Street, City',
    password: 'password123',
    department: 'Human Resources',
    designation: 'HR Manager',
    role: 'hod',
    dateJoined: '2022-07-01',
    categoryLevel: 'II',
    employmentHistory: [
      {
        id: '9',
        position: 'HR Manager',
        department: 'Human Resources',
        startDate: '2022-07-01',
        isCurrent: true
      }
    ]
  },
];

export const leaveTypes: LeaveType[] = [
  {
    id: '1',
    name: 'Annual Leave',
    description: 'Regular annual leave',
    defaultDays: 21,
    color: 'hsl(217, 91%, 60%)',
    requiresAttachment: false,
    isActive: true,
  },
  {
    id: '2',
    name: 'Part Leave',
    description: 'Half day or partial leave',
    defaultDays: 10,
    color: 'hsl(38, 92%, 50%)',
    requiresAttachment: false,
    isActive: true,
  },
  {
    id: '3',
    name: 'Paternity Leave',
    description: 'Leave for new fathers',
    defaultDays: 14,
    color: 'hsl(217, 91%, 60%)',
    requiresAttachment: true,
    isActive: true,
  },
  {
    id: '4',
    name: 'Maternity Leave',
    description: 'Leave for new mothers',
    defaultDays: 90,
    color: 'hsl(292, 84%, 61%)',
    requiresAttachment: true,
    isActive: true,
  },
  {
    id: '5',
    name: 'Sick Leave',
    description: 'Medical leave',
    defaultDays: 14,
    color: 'hsl(0, 84%, 60%)',
    requiresAttachment: true,
    isActive: true,
  },
  {
    id: '6',
    name: 'Compassionate Leave',
    description: 'Leave for family emergencies',
    defaultDays: 5,
    color: 'hsl(173, 80%, 40%)',
    requiresAttachment: false,
    isActive: true,
  },
];

export const leaveBalances: LeaveBalance[] = [
  { id: '1', employeeId: '1', leaveTypeId: '1', year: 2024, total: 21, used: 8, pending: 5 },
  { id: '2', employeeId: '1', leaveTypeId: '2', year: 2024, total: 10, used: 2, pending: 0 },
  { id: '3', employeeId: '1', leaveTypeId: '5', year: 2024, total: 14, used: 3, pending: 0 },
  { id: '4', employeeId: '2', leaveTypeId: '1', year: 2024, total: 21, used: 5, pending: 0 },
  { id: '5', employeeId: '2', leaveTypeId: '3', year: 2024, total: 14, used: 0, pending: 0 },
  { id: '6', employeeId: '6', leaveTypeId: '1', year: 2024, total: 21, used: 12, pending: 5 },
  { id: '7', employeeId: '6', leaveTypeId: '5', year: 2024, total: 14, used: 1, pending: 0 },
];

export const leaveApplications: LeaveApplication[] = [
  {
    id: '1',
    employeeId: '1',
    leaveTypeId: '1',
    startDate: '2024-12-20',
    endDate: '2024-12-27',
    days: 5,
    reason: 'Family vacation during the holidays',
    status: 'pending_hod',
    appliedDate: '2024-12-10',
  },
  {
    id: '2',
    employeeId: '1',
    leaveTypeId: '5',
    startDate: '2024-09-10',
    endDate: '2024-09-12',
    days: 3,
    reason: 'Medical appointment and recovery',
    status: 'approved',
    appliedDate: '2024-09-08',
  },
  {
    id: '3',
    employeeId: '6',
    leaveTypeId: '1',
    startDate: '2024-12-15',
    endDate: '2024-12-19',
    days: 5,
    reason: 'Personal time off',
    status: 'pending_admin',
    appliedDate: '2024-12-08',
  },
  {
    id: '4',
    employeeId: '2',
    leaveTypeId: '3',
    startDate: '2024-12-20',
    endDate: '2024-12-25',
    days: 5,
    reason: 'Family vacation during the holidays',
    status: 'approved',
    appliedDate: '2024-12-10',
  },
  {
    id: '5',
    employeeId: '2',
    leaveTypeId: '3',
    startDate: '2024-12-20',
    endDate: '2024-12-25',
    days: 5,
    reason: 'Family vacation during the holidays',
    status: 'rejected',
    appliedDate: '2024-12-10',
  }

];



export const leavePolicies: LeavePolicy[] = [
  {
    id: '1',
    year: 2026,
    name: 'Category I',
    description: 'Directors & Executive Management',
    categoryLevel: 'I',
    annualEntitlementDays: 25,
    maxCarryOverDays: 10,
    applicableLeaveTypes: ['1', '2', '3', '4', '5', '6'],
    holidays: [
      { id: '1', name: 'New Year\'s Day', date: '2026-01-01', isRecurring: true },
      { id: '2', name: 'Independence Day', date: '2026-02-18', isRecurring: true },
      { id: '3', name: 'Christmas Day', date: '2026-12-25', isRecurring: true },
    ],
    isActive: true,
  },
  {
    id: '2',
    year: 2026,
    name: 'Category II',
    description: 'Senior Managers & Managers',
    categoryLevel: 'II',
    annualEntitlementDays: 22,
    maxCarryOverDays: 7,
    applicableLeaveTypes: ['1', '2', '3', '4', '5', '6'],
    holidays: [
      { id: '1', name: 'New Year\'s Day', date: '2026-01-01', isRecurring: true },
      { id: '2', name: 'Independence Day', date: '2026-02-18', isRecurring: true },
      { id: '3', name: 'Christmas Day', date: '2026-12-25', isRecurring: true },
    ],
    isActive: true,
  },
  {
    id: '3',
    year: 2026,
    name: 'Category III',
    description: 'Senior Officers & Officers',
    categoryLevel: 'III',
    annualEntitlementDays: 20,
    maxCarryOverDays: 5,
    applicableLeaveTypes: ['1', '2', '3', '4', '5', '6'],
    holidays: [
      { id: '1', name: 'New Year\'s Day', date: '2026-01-01', isRecurring: true },
      { id: '2', name: 'Independence Day', date: '2026-02-18', isRecurring: true },
      { id: '3', name: 'Christmas Day', date: '2026-12-25', isRecurring: true },
    ],
    isActive: true,
  },
  {
    id: '4',
    year: 2026,
    name: 'Category IV',
    description: 'Assistants & Support Staff',
    categoryLevel: 'IV',
    annualEntitlementDays: 15,
    maxCarryOverDays: 3,
    applicableLeaveTypes: ['1', '2', '5', '6'],
    holidays: [
      { id: '1', name: 'New Year\'s Day', date: '2026-01-01', isRecurring: true },
      { id: '2', name: 'Independence Day', date: '2026-02-18', isRecurring: true },
      { id: '3', name: 'Christmas Day', date: '2026-12-25', isRecurring: true },
    ],
    isActive: true,
  },
];



export const departments = [
  'Human Resources',
  'Information Technology',
  'Finance & Accounts',
  'Operations',
  'Marketing',
];


export const gradeCategories: GradeCategory[] = [
  { id: 'gc1', name: 'Category I', level: 'I', description: 'Directors & Executive Management' },
  { id: 'gc2', name: 'Category II', level: 'II', description: 'Senior Managers & Managers' },
  { id: 'gc3', name: 'Category III', level: 'III', description: 'Senior Officers & Officers' },
  { id: 'gc4', name: 'Category IV', level: 'IV', description: 'Assistants & Support Staff' },
];

export const leaveEntitlements: LeaveEntitlement[] = [
  { id: 'le1', gradeCategoryId: 'gc1', leaveTypeId: '1', entitledDays: 25, year: 2026 },
  { id: 'le2', gradeCategoryId: 'gc1', leaveTypeId: '5', entitledDays: 15, year: 2026 },
  { id: 'le3', gradeCategoryId: 'gc2', leaveTypeId: '1', entitledDays: 22, year: 2026 },
  { id: 'le4', gradeCategoryId: 'gc2', leaveTypeId: '5', entitledDays: 15, year: 2026 },
  { id: 'le5', gradeCategoryId: 'gc3', leaveTypeId: '1', entitledDays: 20, year: 2026 },
  { id: 'le6', gradeCategoryId: 'gc3', leaveTypeId: '5', entitledDays: 14, year: 2026 },
  { id: 'le7', gradeCategoryId: 'gc4', leaveTypeId: '1', entitledDays: 15, year: 2026 },
  { id: 'le8', gradeCategoryId: 'gc4', leaveTypeId: '5', entitledDays: 10, year: 2026 },
];



export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    admin: 'Admin',
    hod: 'HOD',
    staff: 'Staff',
    hr: 'HR',
  };
  return labels[role];
};

export const getStatusLabel = (status: LeaveApplication['status']): string => {
  const labels: Record<LeaveApplication['status'], string> = {
    pending_hod: 'Pending HOD',
    pending_admin: 'Pending Admin',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return labels[status];
};

export const getStatusColor = (status: LeaveApplication['status']): string => {
  const colors: Record<LeaveApplication['status'], string> = {
    pending_hod: 'bg-warning/10 text-warning border-warning/20',
    pending_admin: 'bg-info/10 text-info border-info/20',
    approved: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  return colors[status];
};
