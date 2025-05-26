"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Sample data for categories
const categories = [
  { label: "Furniture", value: "furniture" },
  { label: "Office Supplies", value: "office-supplies" },
  { label: "Electronics", value: "electronics" },
  { label: "Storage", value: "storage" },
  { label: "Lighting", value: "lighting" },
  { label: "Decor", value: "decor" },
]

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  sku: z.string().min(2, {
    message: "SKU must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().optional(),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  minimumStock: z.string().min(1, {
    message: "Minimum stock is required.",
  }),
})

type ProductFormValues = z.infer<typeof formSchema>

interface SimpleProductFormProps {
  onSubmit: (data: ProductFormValues) => void
  onCancel: () => void
}

export function SimpleProductForm({ onSubmit, onCancel }: SimpleProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default form values
  const defaultValues: Partial<ProductFormValues> = {
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    minimumStock: "0",
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

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">SKU</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter SKU"
                    className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100">
                      <SelectValue
                        placeholder="Select a category"
                        className="placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background dark:bg-gray-800 border-border dark:border-gray-600">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={category.value}
                        className="text-foreground dark:text-gray-100 hover:bg-accent dark:hover:bg-gray-700 focus:bg-accent dark:focus:bg-gray-700"
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground dark:text-gray-200">Description</FormLabel>
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-gray-200">Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="bg-background dark:bg-gray-800 border-border dark:border-gray-600 text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-gray-200">Minimum Stock</FormLabel>
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
