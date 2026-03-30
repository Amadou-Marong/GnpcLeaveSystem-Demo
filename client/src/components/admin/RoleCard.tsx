import { users } from "@/data/dummyData";
import { togglePermission, type RoleDefinition } from "@/lib/permissions";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChevronDown, ChevronUp, Settings, Shield, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { toast } from "@/hooks/use-toast";
import { allPermissions } from "@/data/permssions";
// import { allPermissions } from "@/pages/RolesPermissions";

export interface PermissionDef {
    key: string;
    label: string;
    group: string;
}



// ─── Role Card with toggle ────────────────────────────────────────
const RoleCard = ({
  role,
  onEdit,
  onDelete,
}: {
  role: RoleDefinition;
  onEdit: (role: RoleDefinition) => void;
  onDelete: (role: RoleDefinition) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const userCount = users.filter(u => u.role === role.key).length;
    const grantedCount = role.permissions.length;
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary">
                    <Shield className="w-4 h-4" />
                    </div>
                    <div>
                    <CardTitle className="text-base">{role.label}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{role.description}</CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                    {userCount} {userCount === 1 ? 'user' : 'users'}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(role)}>
                    <Settings className="h-3.5 w-3.5" />
                    </Button>
                    {!role.isBuiltIn && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(role)}>
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    )}
                </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
                <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">Permissions</span>
                <span className="text-xs text-muted-foreground">{grantedCount} granted</span>
                </div>
                <div className="space-y-0">
                {allPermissions
                    .slice(0, expanded ? undefined : 6)
                    .map(perm => {
                    const enabled = role.permissions.includes(perm.key as any);
                    return (
                        <div key={perm.key} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                        <span className={`text-sm ${!enabled ? 'text-muted-foreground' : ''}`}>{perm.label}</span>
                        <Switch
                            checked={enabled}
                            onCheckedChange={() => {
                            togglePermission(role.key, perm.key as any);
                            toast({
                                title: enabled ? 'Permission Revoked' : 'Permission Granted',
                                description: `${perm.label} ${enabled ? 'removed from' : 'added to'} ${role.label}`,
                            });
                            }}
                            className="scale-75"
                        />
                        </div>
                    );
                    })}
                </div>
                {allPermissions.length > 6 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? (
                    <>Show Less <ChevronUp className="ml-1 h-3 w-3" /></>
                    ) : (
                    <>Show All ({allPermissions.length - 6} more) <ChevronDown className="ml-1 h-3 w-3" /></>
                    )}
                </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default RoleCard