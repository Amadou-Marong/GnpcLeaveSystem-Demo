import RoleCard from "@/components/admin/RoleCard";
import RoleDialog from "@/components/admin/RoleDialog";
import UserAssignmentsTab from "@/components/admin/UserAssignmentsTab";
import { AlertDialog,  AlertDialogAction,  AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoles } from "@/data/permssions";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/layout/Layout"
import { deleteRole, type RoleDefinition } from "@/lib/permissions";
import { Plus } from "lucide-react"
import { useState } from "react";


const RolesPermissions = () => {
    const roles = useRoles();
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<RoleDefinition | null>(null);

    const handleEdit = (role: RoleDefinition) => {
        setEditingRole(role);
        setRoleDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingRole(null);
        setRoleDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            deleteRole(deleteTarget.key);
            toast({ title: 'Role Deleted', description: `${deleteTarget.label} has been removed` });
            setDeleteTarget(null);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
                        <p className="text-sm text-muted-foreground">Manage user roles and their access permissions</p>
                    </div>
                    <Button onClick={handleAdd} className="gap-2">
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
                                onEdit={() => handleEdit(role)}
                                onDelete={() => setDeleteTarget(role)}
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
                        
            {/* RoleDialog for both adding and editing */}
            <RoleDialog
                open={roleDialogOpen}
                onOpenChange={setRoleDialogOpen}
                editRole={editingRole}
             />

            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                    <AlertDialogDescription>
                    Are you sure you want to delete "{deleteTarget?.label}"? Users assigned to this role will need to be reassigned.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        
        </Layout>
    )
}

export default RolesPermissions