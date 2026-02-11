import { useAuth } from "@/hooks/use-auth";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Extended schema to handle string inputs for numbers
const formSchema = insertProductSchema.extend({
  price: z.string().min(1, "Price is required"), // Keep as string for input, convert later if needed or if backend accepts string (schema says numeric which is string in JS usually for drizzle)
});

type FormValues = z.infer<typeof formSchema>;

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "Indoor",
    },
  });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Admin Access Required</h1>
        <Button asChild>
          <a href="/api/login">Log In to Continue</a>
        </Button>
      </div>
    );
  }

  const onSubmit = (data: FormValues) => {
    createProduct.mutate(data as InsertProduct, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      },
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  return (
    <div className="container-page min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your plants and products</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Add New Plant</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input {...form.register("name")} placeholder="e.g. Monstera Deliciosa" />
                {form.formState.errors.name && <span className="text-destructive text-xs">{form.formState.errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input {...form.register("price")} type="number" step="0.01" placeholder="29.99" />
                  {form.formState.errors.price && <span className="text-destructive text-xs">{form.formState.errors.price.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select onValueChange={(val) => form.setValue("category", val)} defaultValue="Indoor">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indoor">Indoor</SelectItem>
                      <SelectItem value="Outdoor">Outdoor</SelectItem>
                      <SelectItem value="Succulents">Succulents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL (Unsplash)</Label>
                {/* landscape nature plant */}
                <Input {...form.register("imageUrl")} placeholder="https://images.unsplash.com/photo-..." />
                {form.formState.errors.imageUrl && <span className="text-destructive text-xs">{form.formState.errors.imageUrl.message}</span>}
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} placeholder="Describe the plant..." className="h-24" />
                {form.formState.errors.description && <span className="text-destructive text-xs">{form.formState.errors.description.message}</span>}
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createProduct.isPending}>
                  {createProduct.isPending ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No products found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded-lg object-cover bg-secondary" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(product.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
