import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { useNavigate } from "react-router"
import { users } from "@/data/dummyData"



const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const login = useAuthStore((state) => state.login)

    const navigate = useNavigate()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate an API call
        setTimeout(() => {
            login(email, password)
            setIsLoading(false)
            navigate("/")
        }, 1000)
    }

    // Get the first four and users roles for demo accounts
    const demoAccounts = users.filter(user => ['staff', 'hod', 'admin', 'director'].includes(user.role)).slice(0, 4);

    return (
        <div className="min-h-screen bg-background flex">
        {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-primary/80" />
                <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-7 h-7" />
                    </div>
                    <span className="text-2xl font-bold">LeaveMS</span>
                </div>
                <h1 className="text-4xl font-bold mb-4">
                    Streamline Your Leave Management
                </h1>
                <p className="text-lg text-primary-foreground/80">
                    Efficiently manage leave requests, track balances, and maintain team productivity with our comprehensive leave management system.
                </p>
                <div className="mt-12 space-y-4">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">✓</span>
                    </div>
                    <span>Multi-level approval workflow</span>
                    </div>
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">✓</span>
                    </div>
                    <span>Real-time leave balance tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">✓</span>
                    </div>
                    <span>Comprehensive reporting & analytics</span>
                    </div>
                </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-foreground">LeaveMS</span>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
                    <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                    </div>

                    <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded border-input" />
                        <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </a>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-background text-muted-foreground">Demo Accounts</span>
                    </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        {demoAccounts.map((account) => (
                            <Button
                                key={account.role}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setEmail(account.email);
                                    setPassword(account.password);
                                }}
                                className="text-xs"
                            >
                                {account.name} ({account.role})
                            </Button>
                        ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage