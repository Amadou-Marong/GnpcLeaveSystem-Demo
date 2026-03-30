// import { 
//   LayoutDashboard, 
//   Users, 
//   BarChart3,
//   Settings,
//   CalendarDays,
//   List,
//   History,
//   ClipboardList,
//   FileText,
//   Calendar,
//   UserPlus,
// } from "lucide-react"
// import { NavLink } from "react-router"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarHeader,
//   useSidebar,
// } from "@/components/ui/sidebar"


// export function AppSidebar() {

    
//     const { state } = useSidebar()
//     const collapsed = state === "collapsed"


//     let navigationItems: { title: string; url: string; icon: any }[] = [];

//     const baseItems = [
//         { title: 'Dashboard', url: '/', icon: LayoutDashboard },
//         { title: 'Apply Leave', url: '/apply-leave', icon: FileText },
//         { title: 'My Applications', url: '/my-applications', icon: ClipboardList },
//         { title: 'Leave History', url: '/leave-history', icon: History }
//         ];

    
//         navigationItems = [
//             ...baseItems,
//             // { title: 'Pending Verification', url: '/pending-verification', icon: Clock },
//             { title: 'All Leaves', url: '/all-leaves', icon: List },
//             // /apply-on-behalf
//             { title: 'Apply on Behalf', url: '/apply-on-behalf', icon: UserPlus },
//             { title: 'Leave Balances', url: '/leave-balances', icon: BarChart3 },
//             { title: 'Leave Types', url: '/leave-types', icon: Settings },
//             // Leave Policies

//             { title: 'Employees', url: '/employees', icon: Users },
//             { title: 'Team Calendar', url: '/team-calendar', icon: Calendar },
//             { title: 'Organization Calendar', url: '/org-calendar', icon: CalendarDays },
//             { title: 'Reports', url: '/reports', icon: FileText },
//             { title: 'Audit Logs', url: '/audit-logs', icon: BarChart3 },
//         ];

//     const getNavCls = ({ isActive }: { isActive: boolean }) => {
//     //   console.log("Active?", isActive) // TEMP: remove later
//     return `flex items-center gap-3 py-2 rounded-lg transition-all duration-200 ${
//             isActive
//             ? "bg-blue-500 text-white"
//             : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
//         }`
//     }

//     return (
//         <Sidebar className={collapsed ? "w-32" : "w-64"} collapsible="icon">
//             <SidebarHeader className="border-b py-4">
//                 <div className="flex items-center gap-3">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
//                     <CalendarDays className="h-5 w-5 text-primary-foreground" />
//                 </div>
//                 {!collapsed && (
//                     <div>
//                     <h2 className="text-lg font-semibold">GNPC</h2>
//                     <p className="text-xs text-muted-foreground">Leave Management</p>
//                     </div>
//                 )}
//                 </div>
//             </SidebarHeader>

//             <SidebarContent className="py-2">
//                 <SidebarGroup>
//                 <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-3">
//                     {!collapsed && "MAIN MENU"}
//                 </SidebarGroupLabel>
                
//                 <SidebarGroupContent>
//                     <SidebarMenu className="space-y-1">
//                     {navigationItems.map((item) => (
//                         <SidebarMenuItem key={item.title}>
//                         <NavLink
//                                 to={item.url}
//                                 end
//                                 className={({ isActive }) => getNavCls({ isActive })}
//                             >
//                                 <SidebarMenuButton asChild>
//                                 <div className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200">
//                                     <item.icon className="h-8 w-8 flex items-center justify-center" />
//                                     {!collapsed && <span className="font-medium">{item.title}</span>}
//                                 </div>
//                                 </SidebarMenuButton>
//                             </NavLink>
//                         </SidebarMenuItem>
//                     ))}
//                     </SidebarMenu>
//                 </SidebarGroupContent>
//                 </SidebarGroup>
//             </SidebarContent>
//         </Sidebar>
//     )
// }
// export default AppSidebar


import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  CalendarDays,
  List,
  History,
  ClipboardList,
  FileText,
  Calendar,
  UserPlus,
  ChevronRight,
  Award,
  ShieldCheck,
} from "lucide-react"

import { NavLink, useLocation } from "react-router"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"



type ChildItem = {
  title: string
  url: string
  icon: any
}

type NavItem = {
  title: string
  icon: any
  url?: string
  children?: ChildItem[]
}

export function AppSidebar() {
    const { state } = useSidebar()
    const collapsed = state === "collapsed"
    const location = useLocation()

    const navigationItems: NavItem[] = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            url: "/",
        },
        {
            title: "Leave Management",
            icon: FileText,
            children: [
            { title: "Apply Leave", url: "/apply-leave", icon: FileText },
            { title: "My Applications", url: "/my-applications", icon: ClipboardList },
            { title: "Leave History", url: "/leave-history", icon: History },
            { title: "All Leaves", url: "/all-leaves", icon: List },
            { title: "Apply on Behalf", url: "/apply-on-behalf", icon: UserPlus },
            ],
        },
        {
            title: "Administration",
            icon: Settings,
            children: [
            // { title: "Leave Types", url: "/leave-types", icon: Settings },
            { title: "Leave Policies", url: "/leave-policies", icon: Settings },
            // { title: "Leave Balances", url: "/leave-balances", icon: BarChart3 },
            { title: "Reports", url: "/reports", icon: BarChart3 },

            // Roles & Permissions
            { title: "Roles & Permissions", url: "/roles-permissions", icon: ShieldCheck },
            { title: "Audit Logs", url: "/audit-logs", icon: History },
            ],
        },
        {
            title: "Employee Management",
            icon: Users,
            children: [
                { title: "Employees", url: "/employees", icon: Users },
                { title: "Employee Categories", url: "/employee-categories", icon: Award },
            ]
        },
        {
            title: "Calendar",
            icon: CalendarDays,
            children: [
            { title: "Team Calendar", url: "/team-calendar", icon: Calendar },
            { title: "Organization Calendar", url: "/org-calendar", icon: CalendarDays },
            ],
        },
    ]


    return (
        <Sidebar className={collapsed ? "w-20" : "w-64"} collapsible="icon">
        {/* Header */}
        <SidebarHeader className="border-b py-4">
            <div className="flex items-center gap-3 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <CalendarDays className="h-5 w-5 text-primary-foreground" />
            </div>

            {!collapsed && (
                <div>
                <h2 className="text-lg font-semibold">GNPC</h2>
                <p className="text-xs text-muted-foreground">
                    Leave Management
                </p>
                </div>
            )}
            </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className="py-2">
            <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-3 px-3">
                {!collapsed && "MAIN MENU"}
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => (
                    <CollapsibleNavItem
                    key={item.title}
                    item={item}
                    collapsed={collapsed}
                    currentPath={location.pathname}
                    />
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        </Sidebar>
    )
    }

    export default AppSidebar

    /* ---------------------------------------------------- */
    /* 🔥 Collapsible Nav Item Component */
    /* ---------------------------------------------------- */

    function CollapsibleNavItem({
    item,
    collapsed,
    currentPath,
    }: {
    item: NavItem
    collapsed: boolean
    currentPath: string
    }) {
    const hasChildren = !!item.children

    const isChildActive =
        item.children?.some((child) =>
        currentPath.startsWith(child.url)
        ) ?? false

    // const isParentActive = item.url === currentPath

    const [open, setOpen] = useState(isChildActive)

    /* ------------------ */
    /* Single Link Item   */
    /* ------------------ */
    if (!hasChildren && item.url) {
        return (
        <SidebarMenuItem>
            <NavLink
            to={item.url}
            end
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                    ? "bg-blue-500 text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
            }
            >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
            </NavLink>
        </SidebarMenuItem>
        )
    }

    /* ------------------ */
    /* Parent With Child  */
    /* ------------------ */
    return (
        <SidebarMenuItem>
        <button
            onClick={() => setOpen(!open)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200 ${
            isChildActive
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
        >
            <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
            </div>

            {!collapsed && (
            <ChevronRight
                className={`h-4 w-4 transition-transform ${
                open ? "rotate-90" : ""
                }`}
            />
            )}
        </button>

        {/* Children */}
        {open && !collapsed && (
            // <div className="ml-6 mt-1 space-y-1">
            <div className="ml-6 mt-1 space-y-1 border-l pl-4">

                {item.children?.map((child) => (
                <NavLink
                    key={child.title}
                    to={child.url}
                    className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        isActive
                        ? "bg-blue-500 text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`
                    }
                >
                    {/* <child.icon className="h-4 w-4 shrink-0" /> */}
                    <child.icon className="h-4 w-4 opacity-80" />

                    <span>{child.title}</span>
                </NavLink>
                ))}
            </div>
        )}

        </SidebarMenuItem>
    )
}

