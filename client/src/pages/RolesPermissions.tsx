import RoleCard from "@/components/admin/RoleCard";
import UserAssignmentsTab from "@/components/admin/UserAssignmentsTab";
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoles } from "@/data/permssions";
import { Layout } from "@/layout/Layout"
import { Plus } from "lucide-react"


const RolesPermissions = () => {
    const roles = useRoles();
    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
                        <p className="text-sm text-muted-foreground">Manage user roles and their access permissions</p>
                    </div>
                    <Button onClick={() => {}}>
                        <Plus className="h-4 w-4 mr-1" /> Add Custom Role
                    </Button>
                </div>
                <Tabs defaultValue="definitions">
                    <TabsList>
                        <TabsTrigger value="definitions">Role Definitions</TabsTrigger>
                        <TabsTrigger value="assignments">User Assignments</TabsTrigger>
                    </TabsList>

                    <TabsContent value="definitions" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {roles.map(role => (
                            <RoleCard
                                key={role.key}
                                role={role}
                                onEdit={() => {}}
                                onDelete={() => {}}
                            />
                        ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="assignments" className="mt-4">
                        {/* User assignments content goes here */}
                        <UserAssignmentsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    )
}

export default RolesPermissions