import { Card, CardContent } from "@/components/ui/card"
import { Layout } from "@/layout/Layout"
import { Award, CalendarDays, Scale, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router"

export const categories = [
  {
    id: "1",
    name: "Leave Entitlement",
    url: "leave-entitlement",
    description: "Configure employee leave entitlement rules",
    icon: Award,
    color: "from-red-100 to-red-50 text-red-600",
  },
  {
    id: "2",
    name: "Leave Balances",
    url: "leave-balances",
    description: "Monitor and manage employee leave balances",
    icon: Scale,
    color: "from-blue-100 to-blue-50 text-blue-600",
  },
  {
    id: "3",
    name: "Leave Types",
    url: "leave-types",
    description: "Create and manage available leave types",
    icon: CalendarDays,
    color: "from-emerald-100 to-emerald-50 text-emerald-600",
  },
]

const LeavePolicies = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-1 border-b pb-4">
          <h1 className="text-2xl font-bold text-foreground">
            Leave Policies
          </h1>
          <p className="text-muted-foreground">
            Manage and configure employee leave policy settings
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              onClick={() =>
                navigate(`/leave-policies/${category.url}`)
              }
              className="group cursor-pointer border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="flex h-full flex-col justify-between p-6">

                <div>
                  {/* Icon */}
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color}`}
                  >
                    <category.icon className="h-7 w-7" />
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-semibold mb-2">
                    {category.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>

                {/* Footer Indicator */}
                <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Manage
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default LeavePolicies
