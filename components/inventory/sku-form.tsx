"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Form schema for adding/editing a SKU
const skuFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "SKU name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  type: z.string({
    required_error: "Please select a type.",
  }),
  parentResource: z.string().optional(),
  brand: z.string().optional(),
  procuredDate: z.string().optional(),
  skuCode: z.string().optional(),
  availableQuantity: z.coerce.number().min(0, {
    message: "Available quantity must be a positive number.",
  }).default(0),
  skuUnit: z.string().optional(),
  unit: z.string().optional(),
  department: z.string().optional(),
  wastageQuantity: z.string().optional(),
  quantity: z.coerce.number().min(0, {
    message: "Quantity must be a positive number.",
  }).default(0),
  minQuantity: z.coerce.number().min(0, {
    message: "Minimum quantity must be a positive number.",
  }).default(0),
  location: z.string({
    required_error: "Please select a location.",
  }),
  unitCost: z.coerce.number().min(0, {
    message: "Unit cost must be a positive number.",
  }).default(0),
  currency: z.string().default("USD"),
  unitWeight: z.coerce.number().min(0, {
    message: "Unit weight must be a positive number.",
  }).default(0),
  weightUnit: z.string().default("kg"),
  quantityUnit: z.string().default("pieces"),
  qualityRating: z.string().default("Not Rated"),
  qualityCheckDone: z.boolean().default(false),
  qualityCheckNotes: z.string().optional(),
  fileUpload: z.any().optional(),
})

// Explicitly define the form values type to match zod schema
type SkuFormValues = z.infer<typeof skuFormSchema>

// Sample categories - updated with specific SKU category data
const categories = [
  { label: "RAW Material", value: "RAW Material", id: "SC-001" },
  { label: "Spare Parts", value: "Spare Parts", id: "SC-002" },
  { label: "Packaging Material", value: "Packaging Material", id: "SC-003" },
  { label: "Others", value: "Others", id: "SC-004" },
]

// Sample types
const types = [
  { label: "Primary", value: "Primary" },
  { label: "Secondary", value: "Secondary" },
]

// Sample locations
const locations = [
  { label: "U1-W1-Z2-R3", value: "U1-W1-Z2-R3" },
  { label: "U1-W1-Z4", value: "U1-W1-Z4" },
  { label: "U1-W1-Z5", value: "U1-W1-Z5" },
  { label: "U1-W2", value: "U1-W2" },
  { label: "U1-W3-CR1", value: "U1-W3-CR1" },
  { label: "Packaging Store 1", value: "Packaging Store 1" },
  { label: "W4-Spare-Part-Z1", value: "W4-Spare-Part-Z1" },
]

const parentResources = [
  { label: "Pallets", value: "Pallets" },
  { label: "Crates", value: "Crates" },
  { label: "Forklift Machine", value: "Forklift Machine" },
  { label: "Crane", value: "Crane" },
  { label: "Packaging Material", value: "Packaging Material" },
  { label: "RAW Material", value: "RAW Material" },
  { label: "Laptop", value: "Laptop" },
  { label: "Tables", value: "Tables" },
  { label: "Miscellaneous", value: "Miscellaneous" },
]

// Sample quality ratings
const qualityRatings = [
  { label: "A - Premium", value: "A" },
  { label: "B - Standard", value: "B" },
  { label: "C - Economy", value: "C" },
  { label: "Not Rated", value: "Not Rated" },
]

// Sample quantity units
const quantityUnits = [
  { label: "Pieces", value: "pieces" },
  { label: "Meters", value: "meters" },
  { label: "Kilograms", value: "kilograms" },
  { label: "Liters", value: "liters" },
  { label: "Boxes", value: "boxes" },
  { label: "Pairs", value: "pairs" },
  { label: "Rolls", value: "rolls" },
  { label: "Sheets", value: "sheets" },
]

// Sample weight units
const weightUnits = [
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Grams (g)", value: "g" },
  { label: "Pounds (lb)", value: "lb" },
  { label: "Ounces (oz)", value: "oz" },
]

// Sample currencies
const currencies = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "JPY (¥)", value: "JPY" },
  { label: "CAD (C$)", value: "CAD" },
  { label: "AUD (A$)", value: "AUD" },
]

interface SkuFormProps {
  initialData?: Partial<SkuFormValues>
  onSubmit: (data: SkuFormValues) => void
  onCancel: () => void
}

export function SkuForm({ initialData = {}, onSubmit, onCancel }: SkuFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Initialize form with default values or initial data
  const form = useForm<SkuFormValues>({
    resolver: zodResolver(skuFormSchema) as any,
    defaultValues: {
      id: initialData?.id || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      type: initialData?.type || "Primary",
      parentResource: initialData?.parentResource || "",
      brand: initialData?.brand || "",
      procuredDate: initialData?.procuredDate || "",
      skuCode: initialData?.skuCode || "",
      availableQuantity: initialData?.availableQuantity || 0,
      skuUnit: initialData?.skuUnit || "",
      unit: initialData?.unit || "",
      department: initialData?.department || "",
      wastageQuantity: initialData?.wastageQuantity || "",
      quantity: initialData?.quantity || 0,
      minQuantity: initialData?.minQuantity || 0,
      location: initialData?.location || "",
      unitCost: initialData?.unitCost || 0,
      currency: initialData?.currency || "USD",
      unitWeight: initialData?.unitWeight || 0,
      weightUnit: initialData?.weightUnit || "kg",
      quantityUnit: initialData?.quantityUnit || "pieces",
      qualityRating: initialData?.qualityRating || "Not Rated",
      qualityCheckDone: initialData?.qualityCheckDone || false,
      qualityCheckNotes: initialData?.qualityCheckNotes || "",
      fileUpload: undefined,
    },
  })

  // Submit handler
  const handleSubmit = (data: SkuFormValues) => {
    // Since we're using z.coerce in the schema, the values should already be properly typed
    onSubmit(data)
    form.reset()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="w-full space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SKU Information</h3>

            {/* Parent Resource - moved to top */}
            <FormField
              control={form.control}
              name="parentResource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Resource</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent resource" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parentResources.map((resource) => (
                        <SelectItem key={resource.value} value={resource.value}>
                          {resource.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Basic Information fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU Instance ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Auto-generated" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU Brand/Vendor</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand or vendor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload Section */}
            <FormField
              control={form.control}
              name="fileUpload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Images/Documents</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </FormControl>
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Inventory & Tracking fields */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Inventory & Quality Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="procuredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU Procured Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Tag</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location tag" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.value} value={location.value}>
                              {location.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="skuCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="availableQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU Available Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Primary SKUs are essential for production, while secondary SKUs are alternatives or supplements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="unitCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Cost</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="qualityRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quality Rating</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {qualityRatings.map((rating) => (
                            <SelectItem key={rating.value} value={rating.value}>
                              {rating.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="unitWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Weight</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="weightUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select weight unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weightUnits.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="minQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="quantityUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quantity unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {quantityUnits.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="skuUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU unit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter unit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="wastageQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wastage Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter wastage quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="qualityCheckDone"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Quality check completed</FormLabel>
                      <FormDescription>
                        Mark this checkbox if quality check has been completed for this SKU.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityCheckNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quality Check Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter quality check notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update SKU" : "Add SKU"}</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
