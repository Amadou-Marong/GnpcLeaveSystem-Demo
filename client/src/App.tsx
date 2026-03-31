import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router'
import LoginPage from './pages/LoginPage'
import ApplyLeave from './pages/ApplyLeave'
import MyApplications from './pages/MyApplications'
import AllLeaves from './pages/AllLeaves'
import LeaveBalances from './pages/LeaveBalances'
import LeaveTypes from './pages/LeaveTypes'
import Employees from './pages/Employees'
import OrganizationCalendar from './pages/OrganizationCalendar'
import Reports from './pages/Reports'
import AuditLogs from './pages/AuditLogs'
import Settings from './pages/Settings'
import LeaveHistory from './pages/LeaveHistory'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from './components/theme-provider'
import Index from './pages/Index'
import TeamCalendar from './pages/TeamCalendar'
import EmployeeProfile from './pages/EmployeeProfile'
import ApplyOnBehalf from './pages/ApplyOnBehalf'
import LeavePolicies from './pages/LeavePolicies'
import EmployeeCategory from './pages/EmployeeCategory'
import LeaveEntitlements from './pages/LeaveEntitlements'
import RolesPermissions from './pages/RolesPermissions'
import HODPendingReviews from './pages/HODPendingReviews'
import ApplicationDetails from './pages/ApplicationDetails'
import NotFound from './pages/404'

const queryClient = new QueryClient()

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/apply-on-behalf" element={<ApplyOnBehalf />} />
        <Route path='/my-applications' element={<MyApplications />} />
        <Route path='/leave-history' element={<LeaveHistory />} />
        <Route path='/all-leaves' element={<AllLeaves />} />

        <Route path="/application/:id" element={<ApplicationDetails />} />
        {/* <Route path='/leave-balances' element={<LeaveBalances />} /> */}
        {/* <Route path='/leave-types' element={<LeaveTypes />} /> */}
        
        <Route path='/leave-policies' element={<LeavePolicies />}/>
        <Route path='/leave-policies/leave-entitlement' element={<LeaveEntitlements />}/>
        <Route path='/leave-policies/leave-types' element={<LeaveTypes />}/>
        <Route path='/leave-policies/leave-balances' element={<LeaveBalances />}/>

        <Route path="/pending-reviews" element={<HODPendingReviews />} />

        <Route path='/employees' element={<Employees />} />
        <Route path='/employees/:id' element={<EmployeeProfile />} />
        <Route path='/employee-categories' element={<EmployeeCategory />} />
        <Route path='/org-calendar' element={<OrganizationCalendar />} />
        <Route path='/team-calendar' element={<TeamCalendar />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/roles-permissions' element={<RolesPermissions />} />
        <Route path='/audit-logs' element={<AuditLogs />} />
        <Route path='/settings' element={<Settings />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Sonner />
        <AppContent />
      </QueryClientProvider>
    </ThemeProvider>
    
  )
}

export default App
