import { useAuthStore } from "@/store/auth.store"
import StaffDashboard from "./StaffDashboard";
import HODDashboard from "./HODDashboard";
import AdminDashboard from "./AdminDashboard";

const Index = () => {
    const currentUser = useAuthStore((state) => state.currentUser);

    switch (currentUser?.role) {
        case 'admin':
            return <AdminDashboard/>;
        case 'hr':
            return <AdminDashboard />;
        case 'hod':
            return <HODDashboard />;
        default:
            return <StaffDashboard />;
    }
}

export default Index