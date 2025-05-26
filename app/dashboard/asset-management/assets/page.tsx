"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Upload, Edit, Trash2, Package } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PageHeader } from "@/components/dashboard/page-header"

// Asset form schema
const assetFormSchema = z.object({
  parentResource: z.string({ required_error: "Parent resource is required" }),
  name: z.string().min(2, { message: "Asset name must be at least 2 characters" }),
  category: z.string({ required_error: "Category is required" }),
  description: z.string().optional(),
  status: z.string({ required_error: "Status is required" }),
  locationTag: z.string({ required_error: "Location tag is required" }),
  unit: z.string({ required_error: "Unit is required" }),
  department: z.string({ required_error: "Department is required" }),
})

type AssetFormValues = z.infer<typeof assetFormSchema>

// Sample asset data
const initialAssetData = [
  {
    id: "AI-001",
    parentResource: "Pallets",
    name: "Pallet-001",
    locationTag: "U1-W1-Z2-R3",
    code: "PA-009-S4565",
    unit: "Unit 1",
    department: "Auditing",
    description:
      "Wooden Pallets for storing heavy materials. These are standard size pallets suitable for forklift operations.",
    category: "Lifting Machine",
    status: "Active",
  },
  {
    id: "AI-002",
    parentResource: "Forklift Machine",
    name: "Forklift Machine-001",
    locationTag: "U1-W1-Z4",
    code: "FM-987-S7678",
    unit: "Production Unit 1",
    department: "Quality Check",
    description: "Heavy-duty forklift with 2-ton lifting capacity. Used for moving pallets in the main warehouse area.",
    category: "Lifting Machine",
    status: "Active",
  },
  {
    id: "AI-003",
    parentResource: "Forklift Machine",
    name: "Forklift Machine-002",
    locationTag: "U1-W1-Z5",
    code: "FM-987-S7689",
    unit: "Production Unit 1",
    department: "Quality Check",
    description:
      "Medium-duty forklift currently undergoing scheduled maintenance. Expected to return to service next week.",
    category: "Lifting Machine",
    status: "Under Maintenance",
  },
  {
    id: "AI-004",
    parentResource: "Forklift Machine",
    name: "Forklift Machine-003",
    locationTag: "U1-W2",
    code: "FM-987-S7765",
    unit: "Asset Storing Facility",
    department: "Auditing",
    description:
      "Old forklift that has been decommissioned due to irreparable hydraulic system failure. Awaiting disposal.",
    category: "Lifting Machine",
    status: "Decommissioned",
  },
  {
    id: "AI-005",
    parentResource: "Conveyor Belt",
    name: "Conveyor Belt-001",
    locationTag: "U1-W3-CR1",
    code: "CB-123-S4567",
    unit: "Production Unit 1",
    department: "Quality Check",
    description: "Medium-sized conveyor belt used in the main production line for transporting packaged goods.",
    category: "Transportation Asset",
    status: "Active",
  },
  {
    id: "AI-006",
    parentResource: "Packaging Machine",
    name: "Packaging Machine-001",
    locationTag: "Packaging Store 1",
    code: "PM-456-S7890",
    unit: "Production Unit 1",
    department: "Quality Check",
    description:
      "Automatic packaging machine capable of handling various product sizes. Recently upgraded with new software.",
    category: "Manufacturing Machine",
    status: "Active",
  },
  {
    id: "AI-007",
    parentResource: "Computer",
    name: "Computer-001",
    locationTag: "W4-Spare-Part-Z1",
    code: "IT-789-S1234",
    unit: "Main Office",
    department: "IT",
    description:
      "Desktop computer used by administrative staff. Equipped with dual monitors and standard office software.",
    category: "IT Asset",
    status: "Active",
  },
  {
    id: "AI-008",
    parentResource: "Desk",
    name: "Desk-001",
    locationTag: "W4-Spare-Part-Z1",
    code: "OF-012-S5678",
    unit: "Main Office",
    department: "IT",
    description: "Standard office desk with adjustable height feature. Located in the main administrative area.",
    category: "Office Asset",
    status: "Active",
  },
]

// Sample data for dropdowns
const parentResources = [
  { value: "Pallets", label: "Pallets" },
  { value: "Crates", label: "Crates" },
  { value: "Forklift Machine", label: "Forklift Machine" },
  { value: "Crane", label: "Crane" },
  { value: "Packaging Material", label: "Packaging Material" },
  { value: "RAW Material", label: "RAW Material" },
  { value: "Laptop", label: "Laptop" },
  { value: "Tables", label: "Tables" },
  { value: "Miscellaneous", label: "Miscellaneous" },
]

const categories = [
  { value: "Lifting Machine", label: "Lifting Machine" },
  { value: "Transportation Asset", label: "Transportation Asset" },
  { value: "Manufacturing Machine", label: "Manufacturing Machine" },
  { value: "Equipment", label: "Equipment" },
  { value: "Tool", label: "Tool" },
  { value: "IT Asset", label: "IT Asset" },
  { value: "Office Asset", label: "Office Asset" },
]

const statuses = [
  { value: "Active", label: "Active" },
  { value: "Under Maintenance", label: "Under Maintenance" },
  { value: "Decommissioned", label: "Decommissioned" },
]

const locationTags = [
  { value: "U1-W1-Z2-R3", label: "U1-W1-Z2-R3" },
  { value: "U1-W1-Z4", label: "U1-W1-Z4" },
  { value: "U1-W1-Z5", label: "U1-W1-Z5" },
  { value: "U1-W2", label: "U1-W2" },
  { value: "U1-W3-CR1", label: "U1-W3-CR1" },
  { value: "Packaging Store 1", label: "Packaging Store 1" },
  { value: "W4-Spare-Part-Z1", label: "W4-Spare-Part-Z1" },
]

const units = [
  { value: "All", label: "All" },
  { value: "Unit 1", label: "Unit 1" },
  { value: "Production Unit 1", label: "Production Unit 1" },
  { value: "Asset Storing Facility", label: "Asset Storing Facility" },
  { value: "Main Office", label: "Main Office" },
]

const departments = [
  { value: "All", label: "All" },
  { value: "Auditing", label: "Auditing" },
  { value: "Quality Check", label: "Quality Check" },
  { value: "IT", label: "IT" },
]

export default function AssetManagementPage() {
  const [assetData, setAssetData] = useState(initialAssetData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [locationTagFilter, setLocationTagFilter] = useState("all")
  const [unitFilter, setUnitFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false)
  const [isViewAssetOpen, setIsViewAssetOpen] = useState(false)
  const [isEditAssetOpen, setIsEditAssetOpen] = useState(false)
  const [isDeleteAssetOpen, setIsDeleteAssetOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [formMode, setFormMode] = useState<"add" | "edit" | "view">("add")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([])

  // Initialize form
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      parentResource: "",
      name: "",
      category: "",
      description: "",
      status: "",
      locationTag: "",
      unit: "",
      department: "",
    },
  })

  const imageInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  // Filter assets based on search term and filters
  const filteredAssets = assetData.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.locationTag.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || asset.status === statusFilter
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter
    const matchesLocationTag = locationTagFilter === "all" || asset.locationTag === locationTagFilter
    const matchesUnit = unitFilter === "all" || asset.unit === unitFilter
    const matchesDepartment = departmentFilter === "all" || asset.department === departmentFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesLocationTag && matchesUnit && matchesDepartment
  })

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Under Maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "Decommissioned":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle row double click
  const handleRowDoubleClick = (asset: any) => {
    setSelectedAsset(asset)
    setIsViewAssetOpen(true)
  }

  // Open edit dialog
  const handleEditAsset = (asset: any) => {
    setSelectedAsset(asset)
    setFormMode("edit")
    form.reset({
      parentResource: asset.parentResource,
      name: asset.name,
      category: asset.category,
      description: asset.description,
      status: asset.status,
      locationTag: asset.locationTag,
      unit: asset.unit,
      department: asset.department,
    })
    setIsEditAssetOpen(true)
  }

  // Open delete dialog
  const handleDeleteAsset = (asset: any) => {
    setSelectedAsset(asset)
    setIsDeleteAssetOpen(true)
  }

  // Handle add asset
  const handleAddAsset = () => {
    setFormMode("add")
    form.reset({
      parentResource: "",
      name: "",
      category: "",
      description: "",
      status: "",
      locationTag: "",
      unit: "",
      department: "",
    })
    setSelectedImages([])
    setSelectedDocuments([])
    setIsAddAssetOpen(true)
  }

  // Submit form
  const onSubmit = (data: AssetFormValues) => {
    if (formMode === "add") {
      // Generate a new ID
      const newId = `AI-${String(assetData.length + 1).padStart(3, "0")}`

      // Generate a code based on parent resource
      const prefix = data.parentResource.substring(0, 2).toUpperCase()
      const randomNum = Math.floor(Math.random() * 1000)
      const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase()
      const newCode = `${prefix}-${randomNum}-${randomStr}`

      // Create new asset
      const newAsset = {
        id: newId,
        parentResource: data.parentResource,
        name: data.name,
        category: data.category,
        description: data.description || "",
        status: data.status,
        locationTag: data.locationTag,
        unit: data.unit,
        department: data.department,
        code: newCode,
      }

      // Add to asset data
      setAssetData([...assetData, newAsset])

      // Show success message
      toast({
        title: "Asset Added",
        description: `${data.name} has been added successfully.`,
      })

      // Close dialog
      setIsAddAssetOpen(false)
      setSelectedImages([])
      setSelectedDocuments([])
    } else if (formMode === "edit") {
      // Update asset
      const updatedAssets = assetData.map((asset) => {
        if (asset.id === selectedAsset.id) {
          return {
            ...asset,
            parentResource: data.parentResource,
            name: data.name,
            category: data.category,
            description: data.description || "",
            status: data.status,
            locationTag: data.locationTag,
            unit: data.unit,
            department: data.department,
          }
        }
        return asset
      })

      // Update asset data
      setAssetData(updatedAssets)

      // Show success message
      toast({
        title: "Asset Updated",
        description: `${data.name} has been updated successfully.`,
      })

      // Close dialog
      setIsEditAssetOpen(false)
    }
  }

  // Handle delete confirmation
  const confirmDeleteAsset = () => {
    if (!selectedAsset) return

    // Filter out the asset to delete
    const updatedAssets = assetData.filter((asset) => asset.id !== selectedAsset.id)

    // Update asset data
    setAssetData(updatedAssets)

    // Show success message
    toast({
      title: "Asset Deleted",
      description: `${selectedAsset.name} has been deleted successfully.`,
    })

    // Close both dialogs
    setIsDeleteAssetOpen(false)
    setIsViewAssetOpen(false)
  }

  // Handle image upload
  const handleImageUpload = () => {
    imageInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(files)
  }

  // Handle document upload
  const handleDocumentUpload = () => {
    documentInputRef.current?.click()
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedDocuments(files)
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader title="Asset Management" description="Manage and track all your assets in one place" icon={Package} />

      <div className="flex flex-col gap-4 pl-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={unitFilter} onValueChange={setUnitFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Units</SelectItem>
                  {units
                    .filter((unit) => unit.value !== "All")
                    .map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="flex items-center gap-2" onClick={handleAddAsset}>
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments
                .filter((dept) => dept.value !== "All")
                .map((department) => (
                  <SelectItem key={department.value} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={locationTagFilter} onValueChange={setLocationTagFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by location tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Location Tags</SelectItem>
              {locationTags.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Instance ID</TableHead>
                  <TableHead>Parent Resource</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Location Tag</TableHead>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Asset Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      No assets found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow
                      key={asset.id}
                      onDoubleClick={() => handleRowDoubleClick(asset)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{asset.id}</TableCell>
                      <TableCell>{asset.parentResource}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.locationTag}</TableCell>
                      <TableCell>{asset.code}</TableCell>
                      <TableCell>{asset.unit}</TableCell>
                      <TableCell>{asset.department}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(asset.status)}>{asset.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={asset.description}>
                        {asset.description}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Asset Dialog */}
      <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
              <DialogDescription>Enter the details of the asset you want to add.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-6 mb-2">
                  <FormField
                    control={form.control}
                    name="parentResource"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="mb-2 block">Parent Resource*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full px-3 py-2">
                              <SelectValue placeholder="Select parent resource" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {parentResources.map((resource) => (
                              <SelectItem key={resource.value} value={resource.value} className="py-2.5">
                                {resource.label}
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category*</FormLabel>
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
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter asset name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Specification</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter asset specification" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Status*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
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
                    name="locationTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Tag*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locationTags.map((location) => (
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
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {units.map((unit) => (
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
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem key={department.value} value={department.value}>
                                {department.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Upload Image</Label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" className="w-full" onClick={handleImageUpload}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                  {selectedImages.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {selectedImages.length} image(s) selected: {selectedImages.map((f) => f.name).join(", ")}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Upload Documents</Label>
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                    multiple
                    onChange={handleDocumentChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" className="w-full" onClick={handleDocumentUpload}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  </div>
                  {selectedDocuments.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {selectedDocuments.length} document(s) selected: {selectedDocuments.map((f) => f.name).join(", ")}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddAssetOpen(false)
                      setSelectedImages([])
                      setSelectedDocuments([])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Asset Dialog */}
      <Dialog open={isViewAssetOpen} onOpenChange={setIsViewAssetOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>View details of the selected asset.</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Asset ID</Label>
                  <p className="font-medium">{selectedAsset.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Asset Code</Label>
                  <p className="font-medium">{selectedAsset.code}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Asset Name</Label>
                <p className="font-medium">{selectedAsset.name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Parent Resource</Label>
                <p className="font-medium">{selectedAsset.parentResource}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Category</Label>
                <p className="font-medium">{selectedAsset.category}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <p className="font-medium">{selectedAsset.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p>
                    <Badge className={getStatusBadgeColor(selectedAsset.status)}>{selectedAsset.status}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Location Tag</Label>
                  <p className="font-medium">{selectedAsset.locationTag}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Unit</Label>
                  <p className="font-medium">{selectedAsset.unit}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Department</Label>
                  <p className="font-medium">{selectedAsset.department}</p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsViewAssetOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewAssetOpen(false)
                    handleEditAsset(selectedAsset)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteAsset(selectedAsset)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditAssetOpen} onOpenChange={setIsEditAssetOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update the details of the selected asset.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-6 mb-2">
                <FormField
                  control={form.control}
                  name="parentResource"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="mb-2 block">Parent Resource*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full px-3 py-2">
                            <SelectValue placeholder="Select parent resource" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {parentResources.map((resource) => (
                            <SelectItem key={resource.value} value={resource.value} className="py-2.5">
                              {resource.label}
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
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
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter asset name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Specification</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter asset specification" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
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
                  name="locationTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Tag*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location tag" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locationTags.map((location) => (
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
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units.map((unit) => (
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
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem key={department.value} value={department.value}>
                              {department.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditAssetOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Asset Dialog */}
      <Dialog open={isDeleteAssetOpen} onOpenChange={setIsDeleteAssetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="py-4">
              <p className="mb-2">
                You are about to delete: <strong>{selectedAsset.name}</strong> ({selectedAsset.id})
              </p>
              <p className="text-destructive">This will permanently remove the asset and all associated records.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAssetOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAsset}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
