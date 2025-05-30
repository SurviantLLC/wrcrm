"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useReferenceData } from "@/contexts/reference-data-context"
import { skusData } from "@/lib/skus-data"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define types for the SKU options
type SkuOption = {
  label: string
  value: string
  category: string
  type: string
  unit: string
}

// Convert reference data to options for dropdowns
const getSkuOptions = (): SkuOption[] => {
  // Use the SKU names from skusData but include extra metadata from the reference context
  return skusData.map((sku) => ({
    label: `${sku.name} (${sku.skuCode})`,
    value: sku.id,
    category: sku.category,
    type: sku.type,
    unit: sku.skuUnit
  }))
}

// Form schema
const formSchema = z.object({
  // Product details
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a product category.",
  }),
  status: z.enum(["active", "decommissioned"], {
    required_error: "Please select a status.",
  }),
  description: z.string().optional(),
  minimumProductionLot: z.string().min(1, {
    message: "Minimum production lot is required.",
  }),
  countPerLot: z.string().min(1, {
    message: "Count per lot is required.",
  }),
  perUnitWeightGrams: z.string().min(1, {
    message: "Per unit weight is required.",
  }),
  
  // SKU fields
  skuName: z.string({
    required_error: "Please select a SKU.",
  }),
  skuType: z.enum(["primary", "secondary"], {
    required_error: "Please select the SKU type.",
  }),
  quantityPerLot: z.string().min(1, {
    message: "Quantity per production lot is required.",
  }),
  unit: z.enum(["kg", "count"], {
    required_error: "Please select a unit.",
  }),
})

type ProductFormValues = z.infer<typeof formSchema>

interface SimpleProductFormProps {
  onSubmit: (data: ProductFormValues) => void
  onCancel: () => void
}

export function SimpleProductForm({ onSubmit, onCancel }: SimpleProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { productCategories, skuCategories, skuTypes, skuUnits } = useReferenceData()
  
  // Generate the SKU options using our helper function
  const skuOptions = getSkuOptions()
  
  // Helper function to update form fields based on selected SKU
  const updateFormWithSkuData = (skuId: string) => {
    // Find the selected SKU
    const selectedSku = skuOptions.find(option => option.value === skuId)
    
    if (selectedSku) {
      // Update SKU type field - ensure it matches our enum values
      const skuType = selectedSku.type.toLowerCase() === 'primary' ? 'primary' : 'secondary'
      form.setValue('skuType', skuType as 'primary' | 'secondary')
      
      // Update unit field - ensure it matches our enum values
      const unit = selectedSku.unit.toLowerCase() === 'kg' ? 'kg' : 'count'
      form.setValue('unit', unit as 'kg' | 'count')
      
      // You could also populate other fields based on the SKU data if needed
    }
  }

  // Default form values
  const defaultValues: Partial<ProductFormValues> = {
    name: "",
    category: "",
    status: "active",
    description: "",
    minimumProductionLot: "1",
    countPerLot: "1",
    perUnitWeightGrams: "0",
    skuName: "",
    skuType: "primary",
    quantityPerLot: "1",
    unit: "kg",
  }

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })

  // Handle form submission
  const handleSubmit = (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      onSubmit(data)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-foreground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <h3 className="text-lg font-medium">Product Details</h3>
          
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">Product Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product name"
                    className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* Product Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">Product Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background dark:bg-gray-800 border-border dark:border-gray-600">
                    {productCategories.map((category) => (
                      <SelectItem
                        key={category.PRC_ID}
                        value={category.PRC_ID}
                        className="text-foreground dark:text-gray-100 hover:bg-accent dark:hover:bg-gray-700 focus:bg-accent dark:focus:bg-gray-700"
                      >
                        {category.PRC_Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* Product Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">Product Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background dark:bg-gray-800 border-border dark:border-gray-600">
                    <SelectItem value="active" className="text-foreground dark:text-gray-100 hover:bg-accent dark:hover:bg-gray-700">Active</SelectItem>
                    <SelectItem value="decommissioned" className="text-foreground dark:text-gray-100 hover:bg-accent dark:hover:bg-gray-700">Decommissioned</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* Product Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="min-h-[100px] bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive dark:text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            {/* Minimum Production Lot */}
            <FormField
              control={form.control}
              name="minimumProductionLot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-gray-200">Minimum Production Lot</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Count per Lot */}
            <FormField
              control={form.control}
              name="countPerLot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-gray-200">Count per Lot</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Per Unit Weight */}
            <FormField
              control={form.control}
              name="perUnitWeightGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-gray-200">Per Unit Weight (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-lg font-medium mt-8">SKU Details</h3>
          
          {/* SKU Name */}
          <FormField
            control={form.control}
            name="skuName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">SKU Name</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Update other form fields based on selected SKU
                    updateFormWithSkuData(value);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100">
                      <SelectValue placeholder="Select an SKU" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background dark:bg-gray-800 border-border dark:border-gray-600">
                    {skuOptions.map((sku) => (
                      <SelectItem
                        key={sku.value}
                        value={sku.value}
                        className="text-foreground dark:text-gray-100 hover:bg-accent dark:hover:bg-gray-700 focus:bg-accent dark:focus:bg-gray-700"
                      >
                        {sku.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* SKU Type */}
          <FormField
            control={form.control}
            name="skuType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">SKU Type</FormLabel>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="primary-sku"
                      value="primary"
                      checked={field.value === "primary"}
                      onChange={() => field.onChange("primary")}
                      className="h-4 w-4 text-primary border-gray-600 focus:ring-primary"
                    />
                    <label htmlFor="primary-sku" className="text-foreground dark:text-gray-200">Primary SKU</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="secondary-sku"
                      value="secondary"
                      checked={field.value === "secondary"}
                      onChange={() => field.onChange("secondary")}
                      className="h-4 w-4 text-primary border-gray-600 focus:ring-primary"
                    />
                    <label htmlFor="secondary-sku" className="text-foreground dark:text-gray-200">Secondary SKU</label>
                  </div>
                </div>
                <FormMessage className="text-destructive dark:text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity per Production Lot */}
            <FormField
              control={form.control}
              name="quantityPerLot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-gray-200">Quantity per Production Lot</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Unit */}
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-gray-200">Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100">
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background dark:bg-gray-800 border-border dark:border-gray-600">
                      <SelectItem value="kg" className="text-foreground dark:text-gray-100 hover:bg-accent dark:hover:bg-gray-700">KG</SelectItem>
                      <SelectItem value="count" className="text-foreground dark:text-gray-100 hover:bg-accent dark:hover:bg-gray-700">Count</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border dark:border-gray-600">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-border dark:border-gray-600 text-foreground dark:text-gray-200 hover:bg-accent dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
