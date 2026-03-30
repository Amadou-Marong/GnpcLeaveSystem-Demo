import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { leaveTypes } from "@/data/dummyData";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/layout/Layout"
import { ArrowLeft, Paperclip, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react";
import { Link } from "react-router";

const LeaveTypes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);

  const filteredTypes = leaveTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    toast({
      title: editingType ? "Leave Type Updated" : "Leave Type Created",
      description: `The leave type has been ${editingType ? 'updated' : 'created'} successfully.`,
    });
    setIsDialogOpen(false);
    setEditingType(null);
  }


  const handleDelete = (id: string) => {
    // leaveTypes = leaveTypes.filter((type) => type.id !== id);
    console.log(`Deleted leave type with id: ${id}`);
    
    toast({
      title: "Leave Type Deleted",
      description: "The leave type has been deleted.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Link to="/leave-policies" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Leave Policies
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leave Types</h1>
            <p className="text-muted-foreground">Manage all leave types available in the system</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setEditingType(null)}>
                <Plus className="w-4 h-4" />
                Add Leave Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingType ? 'Edit Leave Type' : 'Add Leave Type'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="e.g., Annual Leave" defaultValue={editingType?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of this leave type" defaultValue={editingType?.description} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultDays">Default Days</Label>
                    <Input id="defaultDays" type="number" placeholder="21" defaultValue={editingType?.defaultDays} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        id="colorPicker"
                        onChange={e => setEditingType({ ...editingType!, color: e.target.value })}
                        value={editingType?.color || '#6366f1'}
                        className="w-10 h-10 rounded border border-border cursor-pointer"
                      />
                      {/* <Input id="color" placeholder="#6366f1" defaultValue={editingType?.color} className="flex-1" /> */}
                      <Input id="color" placeholder="#6366f1" 
                        defaultValue={editingType?.color} 
                        onChange={e => setEditingType({ ...editingType!, color: e.target.value })} 
                        className="flex-1" 
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="attachment">Requires Attachment</Label>
                    <p className="text-sm text-muted-foreground">Employees must upload supporting documents</p>
                  </div>
                  <Switch id="attachment" defaultChecked={editingType?.requiresAttachment} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Active</Label>
                    <p className="text-sm text-muted-foreground">Allow employees to apply for this leave type</p>
                  </div>
                  <Switch id="active" defaultChecked={editingType?.isActive ?? true} />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSave}>
                    {editingType ? 'Update' : 'Create'} Leave Type
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leave types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border p-4">
          <Table>
              <TableHeader>
                  <TableRow>
                     <TableCell>Leave Type</TableCell>
                     <TableCell>Default Days</TableCell>
                     <TableCell>Attachment</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell>Actions</TableCell>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredTypes.map((type) => (
                  <TableRow key={type.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          <div>
                            <p className="font-medium text-foreground">{type.name}</p>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{type.defaultDays}</TableCell>
                      <TableCell>
                        {type.requiresAttachment ? (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Paperclip className="w-4 h-4" /> Required
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not required</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={type.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
                          {type.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingType(type);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(type.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
          </Table>
        </div>

      </div>
    </Layout>
  )
}

export default LeaveTypes