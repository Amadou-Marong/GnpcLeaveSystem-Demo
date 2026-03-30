import { Button } from "@/components/ui/button"
import type { GradeCategory } from "@/data/dummyData";
import { Layout } from "@/layout/Layout"
import { Edit, Plus, Trash2 } from "lucide-react"
import { useState } from "react";
import { gradeCategories as initialCategories } from "@/data/dummyData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const EmployeeCategory = () => {
    const [categories, setCategories] = useState<GradeCategory[]>(initialCategories);

    // / Category dialog
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<GradeCategory | null>(null);
    const [categoryForm, setCategoryForm] = useState({ name: '', level: '', description: '' });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<GradeCategory | null>(null);


    const handleAddCategory = () => {
        setEditingCategory(null);
        setCategoryForm({ name: '', level: '', description: '' });
        setIsCategoryDialogOpen(true);
    };

    const handleEditCategory = (category: GradeCategory) => {
        setEditingCategory(category);
        setCategoryForm({ name: category.name, level: category.level, description: category.description });
        setIsCategoryDialogOpen(true);
    };

    const handleSaveCategory = () => {
        if (!categoryForm.name.trim() || !categoryForm.level.trim()) {
            toast.error('Please enter category name and level');
        return;
        }
        if (editingCategory) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...categoryForm } : c));
            toast.success('Category updated');
        } else {
        setCategories(prev => [...prev, { id: String(Date.now()), ...categoryForm }]);
            toast.success('Category created');
        }
        setIsCategoryDialogOpen(false);
    };

    const handleDeleteCategory = (category: GradeCategory) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedCategory) {
            setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
            toast.success('Category deleted');
        }
        setIsDeleteDialogOpen(false);
    };

    
    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Grade Categories</h2>
                        <p className="text-muted-foreground">Manage employee grade levels used for entitlement assignment</p>
                    </div>
                    <Button onClick={handleAddCategory}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Category
                    </Button>
                </div>
                {/* Table */}
                <div className="bg-card rounded-xl border border-border p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-25">Level</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.level}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.level}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                    {/* Add/Edit Category Dialog */}
                    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                <Label>Category Name</Label>
                                <Input value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="e.g., Category V" />
                                </div>
                                <div className="space-y-2">
                                <Label>Level</Label>
                                <Input value={categoryForm.level} onChange={e => setCategoryForm({ ...categoryForm, level: e.target.value })} placeholder="e.g., V" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} placeholder="e.g., Interns & Trainees" />
                            </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveCategory}>{editingCategory ? 'Update' : 'Create'}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    

                    {/* Delete Category Dialog */}

                    <ConfirmDialog 
                        deleteDialogOpen={isDeleteDialogOpen} 
                        setDeleteDialogOpen={setIsDeleteDialogOpen} 
                        selectedItem={selectedCategory} 
                        onDelete={handleConfirmDelete} 
                    />


                </div>
            </div>
        </Layout>
    )
}

export default EmployeeCategory