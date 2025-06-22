import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ProductForm {
  name: string;
  description: string;
  sku: string;
  categoryId: number;
  supplierId: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  gstRate: number;
  hsnCode: string;
  minStockLevel: number;
  maxStockLevel: number;
}

export default function AddProduct({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductForm>();

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    initialData: [],
  });

  const { data: suppliers } = useQuery({
    queryKey: ['/api/suppliers'],
    initialData: [],
  });

  const createProductMutation = useMutation({
    mutationFn: (data: ProductForm) => apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      onBack();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductForm) => {
    createProductMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Button variant="outline" onClick={onBack} className="btn-3d">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold gradient-text">Add New Product</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="premium-card p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Product Name *</label>
              <Input
                {...register('name', { required: 'Product name is required' })}
                placeholder="Enter product name"
                className="focus-gold"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">SKU *</label>
              <Input
                {...register('sku', { required: 'SKU is required' })}
                placeholder="Enter SKU"
                className="focus-gold"
              />
              {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category *</label>
              <Select onValueChange={(value) => setValue('categoryId', parseInt(value))}>
                <SelectTrigger className="focus-gold">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Supplier *</label>
              <Select onValueChange={(value) => setValue('supplierId', parseInt(value))}>
                <SelectTrigger className="focus-gold">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.map((supplier: any) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Unit *</label>
              <Select onValueChange={(value) => setValue('unit', value)}>
                <SelectTrigger className="focus-gold">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="g">Gram (g)</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="ml">Milliliter (ml)</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="packet">Packet</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="bottle">Bottle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">HSN Code</label>
              <Input
                {...register('hsnCode')}
                placeholder="Enter HSN code"
                className="focus-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Purchase Price *</label>
              <Input
                type="number"
                step="0.01"
                {...register('purchasePrice', { required: 'Purchase price is required', valueAsNumber: true })}
                placeholder="0.00"
                className="focus-gold"
              />
              {errors.purchasePrice && <p className="text-sm text-red-500">{errors.purchasePrice.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Selling Price *</label>
              <Input
                type="number"
                step="0.01"
                {...register('sellingPrice', { required: 'Selling price is required', valueAsNumber: true })}
                placeholder="0.00"
                className="focus-gold"
              />
              {errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">MRP</label>
              <Input
                type="number"
                step="0.01"
                {...register('mrp', { valueAsNumber: true })}
                placeholder="0.00"
                className="focus-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">GST Rate (%)</label>
              <Input
                type="number"
                step="0.01"
                {...register('gstRate', { valueAsNumber: true })}
                placeholder="0.00"
                className="focus-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Minimum Stock Level *</label>
              <Input
                type="number"
                {...register('minStockLevel', { required: 'Minimum stock level is required', valueAsNumber: true })}
                placeholder="0"
                className="focus-gold"
              />
              {errors.minStockLevel && <p className="text-sm text-red-500">{errors.minStockLevel.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Maximum Stock Level *</label>
              <Input
                type="number"
                {...register('maxStockLevel', { required: 'Maximum stock level is required', valueAsNumber: true })}
                placeholder="0"
                className="focus-gold"
              />
              {errors.maxStockLevel && <p className="text-sm text-red-500">{errors.maxStockLevel.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Enter product description"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProductMutation.isPending} className="btn-3d">
              <Save className="h-4 w-4 mr-2" />
              {createProductMutation.isPending ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}