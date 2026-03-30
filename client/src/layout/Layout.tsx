import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"
import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth.store"
import { useNavigate } from "react-router"
import { ModeToggle } from "@/components/mode-toggle"

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    const currentUser = useAuthStore((state) => state.currentUser)
    const navigate = useNavigate()

    const handleLogout = () => {
        // Implement logout functionality here
        useAuthStore.getState().logout()
        // Optionally, redirect to login page
        navigate('/login')
    }
    
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    {/* <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between"> */}
                    <header className="h-16 border-b border-border bg-card px-3 flex items-center justify-between">

                        <div className="flex items-center gap-4">
                        <SidebarTrigger className="h-8 w-8" />
                        <h1 className="text-lg font-semibold text-foreground">Leave Management System</h1>
                        </div>
                        
                        <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <ModeToggle />

                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>

                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                                <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                    {/* {`${user?.first_name?.charAt(0)?.toUpperCase() || ''}${user?.last_name?.charAt(0)?.toUpperCase() || ''}`} */}
                                    {/* {`${currentUser?.name?.split(" ").join("").charAt(0).toUpperCase() || ''}`} */}
                                    {currentUser?.name?.split(" ").join("").charAt(0).toUpperCase() || ''}
                                </AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                {/* <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p> */}
                                <p className="text-sm font-medium">{currentUser?.name}</p>
                                <Badge variant="secondary" className="text-xs capitalize">
                                    {/* {user?.role} */}
                                    {currentUser?.role}
                                </Badge>
                                </div>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                {/* <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p> */}
                                <p className="text-sm font-medium">{currentUser?.name}</p>
                                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                                {/* <p className="text-xs text-muted-foreground">ID: {user?.id}</p> */}
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/settings')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem onClick={handleLogout}> */}
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                    </header>
                    
                    {/* Main Content */}
                    <main className="flex-1 p-6 bg-linear-to-b from-background to-muted/20">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}