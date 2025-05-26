"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  FileText,
  BarChart3,
  CheckCircle,
  Tag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { SkuForm } from "@/components/inventory/sku-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/dashboard/page-header"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import * as z from "zod"

// Sample data - replace with actual data import
const skusData = [
  {
    id: "SKU-001",
    parentResource: "WD-001",
    name: "Oak Wood Panel",
    brand: "Premium Woods Co.",
    procuredDate: "2024-01-15",
    location: "Warehouse A",
    skuCode: "OWP-001",
    availableQuantity: 150,
    skuUnit: "pieces",
    unit: "pcs",
    department: "Materials",
    wastageQuantity: "5",
    description: "High-quality oak wood panel for furniture",
    minQuantity: 20,
    type: "Primary",
    category: "Wood",
    unitCost: 45.50,
    currency: "USD",
    unitWeight: 2.5,
    weightUnit: "kg",
    quantityUnit: "pieces",
    qualityRating: "A",
    qualityCheckDone: true,
    qualityCheckDate: "2024-01-16",
    qualityCheckNotes: "Excellent quality, no defects",
    taggedForProduction: 30,
    wastage: 5,
    totalProcured: 180,
  },
  {
    id: "SKU-002",
    parentResource: "MT-001",
    name: "Steel Brackets",
    brand: "MetalWorks Inc.",
    procuredDate: "2024-01-20",
    location: "Warehouse B",
    skuCode: "SB-002",
    availableQuantity: 200,
    skuUnit: "pieces",
    unit: "pcs",
    department: "Hardware",
    wastageQuantity: "3",
    description: "Galvanized steel brackets for support",
    minQuantity: 50,
    type: "Secondary",
    category: "Metal",
    unitCost: 12.75,
    currency: "USD",
    unitWeight: 0.8,
    weightUnit: "kg",
    quantityUnit: "pieces",
    qualityRating: "B",
    qualityCheckDone: false,
    qualityCheckDate: "",
    qualityCheckNotes: "",
    taggedForProduction: 20,
    wastage: 3,
    totalProcured: 225,
  },
]

// Search and Filter Form Schema
const searchFilterSchema = z.object({
  searchTerm: z.string().optional(),
  categoryFilter: z.string().default("All"),
  typeFilter: z.string().default("All"),
  qualityFilter: z.string().default("All"),
})

// Quality Check Form Schema
const qualityCheckSchema = z.object({
  qualityRating: z.string().min(1, "Please select a quality rating"),
  qualityCheckDone: z.boolean(),
  qualityCheckNotes: z.string().optional(),
})

type SearchFilterFormValues = z.infer<typeof searchFilterSchema>
type QualityCheckFormValues = z.infer<typeof qualityCheckSchema>

// SKU interface
interface Sku {
  id: string;
  parentResource?: string;
  name: string;
  brand?: string;
  procuredDate?: string;
  location?: string;
  skuCode?: string;
  availableQuantity: number;
  skuUnit?: string;
  unit?: string;
  department?: string;
  wastageQuantity?: string;
  description: string;
  minQuantity: number;
  type: string;
  category: string;
  unitCost: number;
  currency: string;
  unitWeight: number;
  weightUnit: string;
  quantityUnit: string;
  qualityRating: string;
  qualityCheckDone: boolean;
  qualityCheckDate?: string;
  qualityCheckNotes?: string;
  taggedForProduction: number;
  wastage: number;
  totalProcured: number;
}

export default function SkuManagementPage() {
  const [skus, setSkus] = useState<Sku[]>(skusData)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingSku, setEditingSku] = useState<Sku | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTotalDialogOpen, setIsTotalDialogOpen] = useState(false)
  const [isQualityCheckDialogOpen, setIsQualityCheckDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // React Hook Form for search and filters
  const searchFilterForm = useForm<SearchFilterFormValues>({
    resolver: zodResolver(searchFilterSchema) as any,
    defaultValues: {
      searchTerm: "",
      categoryFilter: "All",
      typeFilter: "All",
      qualityFilter: "All",
    },
  })

  // React Hook Form for quality check
  const qualityForm = useForm<QualityCheckFormValues>({
    resolver: zodResolver(qualityCheckSchema),
    defaultValues: {
      qualityRating: "",
      qualityCheckDone: false,
      qualityCheckNotes: "",
    },
  })

  const itemsPerPage = 5

  // Watch form values for filtering
  const searchTerm = searchFilterForm.watch("searchTerm") || ""
  const categoryFilter = searchFilterForm.watch("categoryFilter")
  const typeFilter = searchFilterForm.watch("typeFilter")
  const qualityFilter = searchFilterForm.watch("qualityFilter")

  // Filter SKUs based on search term, category filter, and type filter
  const filteredSkus = skus.filter((sku) => {
    const matchesSearch =
      sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sku.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || sku.category === categoryFilter
    const matchesType = typeFilter === "All" || sku.type === typeFilter
    const matchesQuality =
      qualityFilter === "All" ||
      (qualityFilter === "Checked" && sku.qualityCheckDone) ||
      (qualityFilter === "Pending" && !sku.qualityCheckDone)
    return matchesSearch && matchesCategory && matchesType && matchesQuality
  })

  // Paginate SKUs
  const indexOfLastSku = currentPage * itemsPerPage
  const indexOfFirstSku = indexOfLastSku - itemsPerPage
  const currentSkus = filteredSkus.slice(indexOfFirstSku, indexOfLastSku)
  const totalPages = Math.ceil(filteredSkus.length / itemsPerPage)

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Handle adding a new SKU
  const handleAddSku = (skuData: any) => {
    const newId = `SKU-${String(skus.length + 1).padStart(3, "0")}`
    const newSku: Sku = {
      id: newId,
      parentResource: skuData.parentResource || "",
      name: skuData.name || "",
      brand: skuData.brand || "",
      procuredDate: skuData.procuredDate || "",
      location: skuData.location || "",
      skuCode: skuData.skuCode || "",
      availableQuantity: skuData.availableQuantity || 0,
      skuUnit: skuData.skuUnit || "",
      unit: skuData.unit || "",
      department: skuData.department || "",
      wastageQuantity: skuData.wastageQuantity || "",
      description: skuData.description || "",
      minQuantity: skuData.minQuantity || 0,
      type: skuData.type || "Primary",
      category: skuData.category || "",
      unitCost: skuData.unitCost || 0,
      currency: skuData.currency || "USD",
      unitWeight: skuData.unitWeight || 0,
      weightUnit: skuData.weightUnit || "kg",
      quantityUnit: skuData.quantityUnit || "pieces",
      qualityRating: skuData.qualityRating || "Not Rated",
      qualityCheckDone: skuData.qualityCheckDone || false,
      qualityCheckDate: skuData.qualityCheckDone ? new Date().toISOString().split("T")[0] : "",
      qualityCheckNotes: skuData.qualityCheckNotes || "",
      taggedForProduction: 0,
      wastage: 0,
      totalProcured: skuData.availableQuantity || 0,
    }

    setSkus([...skus, newSku])
    setIsAddDialogOpen(false)

    toast({
      title: "SKU added",
      description: `SKU ${skuData.name} has been added successfully.`,
    })
  }

  // Handle editing a SKU
  const handleEditSku = (skuData: any) => {
    if (!editingSku) return

    const updatedSku: Sku = {
      ...editingSku,
      parentResource: skuData.parentResource || editingSku.parentResource,
      name: skuData.name || editingSku.name,
      brand: skuData.brand || editingSku.brand,
      procuredDate: skuData.procuredDate || editingSku.procuredDate,
      location: skuData.location || editingSku.location,
      skuCode: skuData.skuCode || editingSku.skuCode,
      availableQuantity:
        skuData.availableQuantity !== undefined ? skuData.availableQuantity : editingSku.availableQuantity,
      skuUnit: skuData.skuUnit || editingSku.skuUnit,
      unit: skuData.unit || editingSku.unit,
      department: skuData.department || editingSku.department,
      wastageQuantity: skuData.wastageQuantity || editingSku.wastageQuantity,
      description: skuData.description || editingSku.description,
      minQuantity: skuData.minQuantity !== undefined ? skuData.minQuantity : editingSku.minQuantity,
      type: skuData.type || editingSku.type,
      category: skuData.category || editingSku.category,
      unitCost: skuData.unitCost !== undefined ? skuData.unitCost : editingSku.unitCost,
      currency: skuData.currency || editingSku.currency,
      unitWeight: skuData.unitWeight !== undefined ? skuData.unitWeight : editingSku.unitWeight,
      weightUnit: skuData.weightUnit || editingSku.weightUnit,
      quantityUnit: skuData.quantityUnit || editingSku.quantityUnit,
      qualityRating: skuData.qualityRating || editingSku.qualityRating,
      qualityCheckDone: skuData.qualityCheckDone !== undefined ? skuData.qualityCheckDone : editingSku.qualityCheckDone,
      qualityCheckNotes: skuData.qualityCheckNotes || editingSku.qualityCheckNotes,
    }

    setSkus(skus.map((sku) => (sku.id === editingSku.id ? updatedSku : sku)))
    setIsEditDialogOpen(false)

    toast({
      title: "SKU updated",
      description: `SKU ${skuData.name} has been updated successfully.`,
    })
  }

  // Handle deleting a SKU
  const handleDeleteSku = () => {
    if (!editingSku) return

    setSkus(skus.filter((sku) => sku.id !== editingSku.id))
    setIsDeleteDialogOpen(false)

    toast({
      title: "SKU deleted",
      description: `SKU ${editingSku.name} has been deleted successfully.`,
    })
  }

  // Handle toggling SKU type
  const handleToggleType = (id: string, newType: string) => {
    setSkus(skus.map((sku) => (sku.id === id ? { ...sku, type: newType } : sku)))

    toast({
      title: "SKU type updated",
      description: `SKU type has been updated to ${newType}.`,
    })
  }

  // Handle double-click on SKU row
  const handleSkuRowDoubleClick = (sku: Sku) => {
    setEditingSku(sku)
    setIsEditDialogOpen(true)
  }

  // Handle quality check
  const handleQualityCheck = (data: QualityCheckFormValues) => {
    if (!editingSku) return

    const updatedSkus = skus.map((sku) => {
      if (sku.id === editingSku.id) {
        return {
          ...sku,
          qualityRating: data.qualityRating,
          qualityCheckDone: data.qualityCheckDone,
          qualityCheckNotes: data.qualityCheckNotes || "",
          qualityCheckDate: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
        }
      }
      return sku
    })

    setSkus(updatedSkus)
    setIsQualityCheckDialogOpen(false)
    qualityForm.reset()

    toast({
      title: "Quality check completed",
      description: `Quality check for ${editingSku.name} has been recorded.`,
    })
  }

  // Get quantity status badge
  const getQuantityBadge = (quantity = 0, minQuantity = 0) => {
    if (quantity <= 0) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Out of Stock</Badge>
    } else if (quantity < minQuantity) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
    }
  }

  // Get quality badge
  const getQualityBadge = (rating: string) => {
    switch (rating) {
      case "A":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">A - Premium</Badge>
      case "B":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">B - Standard</Badge>
      case "C":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">C - Economy</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Rated</Badge>
    }
  }

  // Get quality check badge
  const getQualityCheckBadge = (checked: boolean) => {
    return checked ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Checked</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Pending</Badge>
    )
  }

  // Calculate total SKU quantity
  const calculateTotalQuantity = () => {
    return skus.reduce((total, sku) => total + (sku.availableQuantity || 0), 0)
  }

  // Calculate total SKU weight
  const calculateTotalWeight = () => {
    return skus
      .reduce((total, sku) => {
        return total + (sku.availableQuantity || 0) * (sku.unitWeight || 0)
      }, 0)
      .toFixed(2)
  }

  // Count SKUs with quality check done
  const countQualityCheckedSkus = () => {
    return skus.filter((sku) => sku.qualityCheckDone).length
  }

  // Group SKUs by category
  const skusByCategory = skus.reduce<Record<string, Sku[]>>(
    (acc, sku) => {
      const category = sku.category || "Uncategorized"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(sku)
      return acc
    },
    {},
  )

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(skus.map(sku => sku.category).filter(Boolean)))
  
  // Get unique types for filter
  const uniqueTypes = Array.from(new Set(skus.map(sku => sku.type).filter(Boolean)))

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="SKU Management"
        description="Manage SKUs and inventory levels"
        icon={Tag}
        action={{
          label: "Add SKU",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setIsAddDialogOpen(true),
        }}
      />

      <div className="flex justify-end mb-4">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsTotalDialogOpen(true)}>
          <BarChart3 className="h-4 w-4" />
          View Total SKUs
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mt-[5px]">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skus.length}</div>
            <div className="text-xs text-muted-foreground">Unique stock keeping units</div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10">
            <div className="h-full bg-primary" style={{ width: `100%` }}></div>
          </div>
        </Card>
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateTotalQuantity()}</div>
            <div className="text-xs text-muted-foreground">Items in inventory</div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10">
            <div
              className="h-full bg-primary"
              style={{
                width: `${Math.min(100, (calculateTotalQuantity() / (calculateTotalQuantity() + 100)) * 100)}%`,
              }}
            ></div>
          </div>
        </Card>
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Weight (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateTotalWeight()}</div>
            <div className="text-xs text-muted-foreground">Kilograms in inventory</div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10">
            <div
              className="h-full bg-primary"
              style={{
                width: `${Math.min(100, (Number.parseFloat(calculateTotalWeight()) / (Number.parseFloat(calculateTotalWeight()) + 100)) * 100)}%`,
              }}
            ></div>
          </div>
        </Card>
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Checked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {countQualityCheckedSkus()} / {skus.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round((countQualityCheckedSkus() / (skus.length || 1)) * 100)}% completion rate
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10">
            <div
              className="h-full bg-primary"
              style={{
                width: `${(countQualityCheckedSkus() / skus.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary">SKUs</CardTitle>
              <CardDescription>Manage SKUs and inventory levels</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Form */}
            <Form {...searchFilterForm}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <FormField
                    control={searchFilterForm.control as any}
                    name="searchTerm"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search SKUs..." className="pl-8" {...field} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-48">
                  <FormField
                    control={searchFilterForm.control as any}
                    name="categoryFilter"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            {uniqueCategories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-48">
                  <FormField
                    control={searchFilterForm.control as any}
                    name="typeFilter"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="All">All Types</SelectItem>
                            {uniqueTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-48">
                  <FormField
                    control={searchFilterForm.control as any}
                    name="qualityFilter"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Quality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Checked">Checked</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </Form>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] text-left">SKU Instance ID</TableHead>
                    <TableHead className="w-[150px] text-left">Parent Resource</TableHead>
                    <TableHead className="w-[200px] text-left">SKU Name</TableHead>
                    <TableHead className="w-[150px] text-left">SKU Brand/Vendor</TableHead>
                    <TableHead className="w-[140px] text-left">SKU Procured Date</TableHead>
                    <TableHead className="w-[120px] text-left">Location</TableHead>
                    <TableHead className="w-[120px] text-left">SKU Code</TableHead>
                    <TableHead className="w-[140px] text-center">SKU Available Quantity</TableHead>
                    <TableHead className="w-[100px] text-center">SKU Unit</TableHead>
                    <TableHead className="w-[80px] text-center">Unit</TableHead>
                    <TableHead className="w-[120px] text-left">Department</TableHead>
                    <TableHead className="w-[130px] text-center">Wastage Quantity</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSkus.length > 0 ? (
                    currentSkus.map((sku) => (
                      <TableRow
                        key={sku.id}
                        onDoubleClick={() => handleSkuRowDoubleClick(sku)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium text-left">{sku.id || ""}</TableCell>
                        <TableCell className="text-left">{sku.parentResource || ""}</TableCell>
                        <TableCell className="text-left font-medium">{sku.name || ""}</TableCell>
                        <TableCell className="text-left">{sku.brand || ""}</TableCell>
                        <TableCell className="text-left">{sku.procuredDate || ""}</TableCell>
                        <TableCell className="text-left">{sku.location || ""}</TableCell>
                        <TableCell className="text-left">{sku.skuCode || ""}</TableCell>
                        <TableCell className="text-center font-medium">{sku.availableQuantity || 0}</TableCell>
                        <TableCell className="text-center">{sku.skuUnit || ""}</TableCell>
                        <TableCell className="text-center">{sku.unit || ""}</TableCell>
                        <TableCell className="text-left">{sku.department || ""}</TableCell>
                        <TableCell className="text-center">{sku.wastageQuantity || ""}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingSku(sku)
                                  qualityForm.reset({
                                    qualityRating: sku.qualityRating || "Not Rated",
                                    qualityCheckDone: sku.qualityCheckDone,
                                    qualityCheckNotes: sku.qualityCheckNotes || "",
                                  })
                                  setIsQualityCheckDialogOpen(true)
                                }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Quality Check
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingSku(sku)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingSku(sku)
                                  setIsDeleteDialogOpen(true)
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} className="h-24 text-center">
                        No SKUs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredSkus.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {indexOfFirstSku + 1} to {Math.min(indexOfLastSku, filteredSkus.length)} of{" "}
                  {filteredSkus.length} SKUs
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add SKU Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Add New SKU</DialogTitle>
            <DialogDescription>Add a new SKU to the inventory system.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <SkuForm onSubmit={handleAddSku} onCancel={() => setIsAddDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit SKU Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit SKU</DialogTitle>
            <DialogDescription>Make changes to the SKU details.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {editingSku && (
              <SkuForm initialData={editingSku} onSubmit={handleEditSku} onCancel={() => setIsEditDialogOpen(false)} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete SKU Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete SKU</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this SKU? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {editingSku && (
            <div className="py-4">
              <p>
                You are about to delete: <strong>{editingSku.name}</strong> - {editingSku.description || ""}
              </p>
              {editingSku.availableQuantity > 0 && (
                <p className="text-destructive mt-2">
                  Warning: This SKU has {editingSku.availableQuantity} units in stock. Deleting it will remove these from
                  inventory.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSku}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quality Check Dialog */}
      <Dialog open={isQualityCheckDialogOpen} onOpenChange={setIsQualityCheckDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quality Check</DialogTitle>
            <DialogDescription>{editingSku && `Perform quality check for ${editingSku.name}`}</DialogDescription>
          </DialogHeader>
          {editingSku && (
            <Form {...qualityForm}>
              <form onSubmit={qualityForm.handleSubmit(handleQualityCheck)} className="space-y-4">
                <FormField
                  control={qualityForm.control}
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
                          <SelectItem value="A">A - Premium</SelectItem>
                          <SelectItem value="B">B - Standard</SelectItem>
                          <SelectItem value="C">C - Economy</SelectItem>
                          <SelectItem value="Not Rated">Not Rated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={qualityForm.control}
                  name="qualityCheckDone"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mark as checked</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={qualityForm.control}
                  name="qualityCheckNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter quality check notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsQualityCheckDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Total SKUs Dialog */}
      <Dialog open={isTotalDialogOpen} onOpenChange={setIsTotalDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Total SKU Inventory</DialogTitle>
            <DialogDescription>Comprehensive view of all SKUs in inventory</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All SKUs</TabsTrigger>
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="quality">By Quality</TabsTrigger>
              <TabsTrigger value="production">Production & Wastage</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{skus.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{calculateTotalQuantity()}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Quantity</TableHead>
                      <TableHead>Total Procured</TableHead>
                      <TableHead>Unit Weight</TableHead>
                      <TableHead>Total Weight</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skus.map((sku) => (
                      <TableRow key={sku.id}>
                        <TableCell className="font-medium">{sku.name || ""}</TableCell>
                        <TableCell>{sku.category || ""}</TableCell>
                        <TableCell>
                          {sku.availableQuantity || 0} {sku.quantityUnit || ""}
                        </TableCell>
                        <TableCell>
                          {sku.totalProcured || 0} {sku.quantityUnit || ""}
                        </TableCell>
                        <TableCell>
                          {sku.unitWeight || 0} {sku.weightUnit || ""}
                        </TableCell>
                        <TableCell>
                          {((sku.unitWeight || 0) * (sku.availableQuantity || 0)).toFixed(2)} {sku.weightUnit || ""}
                        </TableCell>
                        <TableCell>
                          {sku.qualityRating ? getQualityBadge(sku.qualityRating) : getQualityBadge("Not Rated")}
                        </TableCell>
                        <TableCell>
                          {sku.unitCost || 0} {sku.currency || ""}
                        </TableCell>
                        <TableCell>
                          {((sku.unitCost || 0) * (sku.availableQuantity || 0)).toFixed(2)} {sku.currency || ""}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell>{calculateTotalQuantity()}</TableCell>
                      <TableCell>{skus.reduce((total, sku) => total + (sku.totalProcured || 0), 0)}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{calculateTotalWeight()}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        {skus
                          .reduce((total, sku) => total + (sku.unitCost || 0) * (sku.availableQuantity || 0), 0)
                          .toFixed(2)}{" "}
                        {skus[0]?.currency || "USD"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="category" className="space-y-4">
              {Object.entries(skusByCategory).map(([category, categorySkus]) => {
                const totalCategoryQuantity = categorySkus.reduce((sum, sku) => sum + (sku.availableQuantity || 0), 0)
                const totalCategoryWeight = categorySkus.reduce(
                  (sum, sku) => sum + (sku.unitWeight || 0) * (sku.availableQuantity || 0),
                  0,
                )
                const totalCategoryValue = categorySkus.reduce(
                  (sum, sku) => sum + (sku.unitCost || 0) * (sku.availableQuantity || 0),
                  0,
                )

                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle>{category}</CardTitle>
                      <CardDescription>
                        {categorySkus.length} SKUs | {totalCategoryQuantity} items | {totalCategoryWeight.toFixed(2)} kg
                        | {totalCategoryValue.toFixed(2)} {categorySkus[0]?.currency || "USD"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>SKU Name</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>% of Category</TableHead>
                              <TableHead>Weight</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categorySkus.map((sku) => (
                              <TableRow key={sku.id}>
                                <TableCell className="font-medium">{sku.name || ""}</TableCell>
                                <TableCell>
                                  {sku.availableQuantity || 0} {sku.quantityUnit || ""}
                                </TableCell>
                                <TableCell>
                                  {totalCategoryQuantity > 0
                                    ? Math.round(((sku.availableQuantity || 0) / totalCategoryQuantity) * 100)
                                    : 0}
                                  %
                                  <Progress
                                    value={
                                      totalCategoryQuantity > 0
                                        ? ((sku.availableQuantity || 0) / totalCategoryQuantity) * 100
                                        : 0
                                    }
                                    className="h-2 mt-1"
                                  />
                                </TableCell>
                                <TableCell>
                                  {((sku.unitWeight || 0) * (sku.availableQuantity || 0)).toFixed(2)}{" "}
                                  {sku.weightUnit || ""}
                                </TableCell>
                                <TableCell>
                                  {((sku.unitCost || 0) * (sku.availableQuantity || 0)).toFixed(2)} {sku.currency || ""}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quality Checked</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {countQualityCheckedSkus()} / {skus.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((countQualityCheckedSkus() / (skus.length || 1)) * 100)}% completion rate
                    </div>
                    <Progress value={(countQualityCheckedSkus() / (skus.length || 1)) * 100} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quality Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>A - Premium</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>B - Standard</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <span>C - Economy</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{skus.filter((s) => s.qualityRating === "A").length}</div>
                        <div>{skus.filter((s) => s.qualityRating === "B").length}</div>
                        <div>{skus.filter((s) => s.qualityRating === "C").length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU Name</TableHead>
                      <TableHead>Quality Rating</TableHead>
                      <TableHead>QC Status</TableHead>
                      <TableHead>Last Checked</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skus.map((sku) => (
                      <TableRow key={sku.id}>
                        <TableCell className="font-medium">{sku.name || ""}</TableCell>
                        <TableCell>
                          {sku.qualityRating ? getQualityBadge(sku.qualityRating) : getQualityBadge("Not Rated")}
                        </TableCell>
                        <TableCell>{getQualityCheckBadge(sku.qualityCheckDone)}</TableCell>
                        <TableCell>{sku.qualityCheckDate || "Not checked"}</TableCell>
                        <TableCell>
                          {sku.availableQuantity || 0} {sku.quantityUnit || ""}
                        </TableCell>
                        <TableCell>{sku.category || ""}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Available for Production</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {skus.reduce(
                        (total, sku) => total + (sku.availableQuantity || 0) - (sku.taggedForProduction || 0),
                        0,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">Units available for new production orders</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tagged for Production</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {skus.reduce((total, sku) => total + (sku.taggedForProduction || 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Units already allocated to production orders</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Wastage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {skus.reduce((total, sku) => total + (sku.wastage || 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Units recorded as wastage</div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU Name</TableHead>
                      <TableHead>Total Procured</TableHead>
                      <TableHead>Current Quantity</TableHead>
                      <TableHead>Tagged for Production</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Wastage</TableHead>
                      <TableHead>Wastage %</TableHead>
                      <TableHead>Wastage Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skus.map((sku) => {
                      const totalProcured = sku.totalProcured || 0
                      const wastage = sku.wastage || 0
                      const unitCost = sku.unitCost || 0
                      const availableQuantity = sku.availableQuantity || 0
                      const taggedForProduction = sku.taggedForProduction || 0

                      const wastagePercentage = totalProcured > 0 ? (wastage / totalProcured) * 100 : 0
                      const wastageCost = wastage * unitCost

                      return (
                        <TableRow key={sku.id}>
                          <TableCell className="font-medium">{sku.name || ""}</TableCell>
                          <TableCell>
                            {totalProcured} {sku.quantityUnit || ""}
                          </TableCell>
                          <TableCell>
                            {availableQuantity} {sku.quantityUnit || ""}
                          </TableCell>
                          <TableCell>
                            {taggedForProduction} {sku.quantityUnit || ""}
                          </TableCell>
                          <TableCell>
                            {availableQuantity - taggedForProduction} {sku.quantityUnit || ""}
                          </TableCell>
                          <TableCell>
                            {wastage} {sku.quantityUnit || ""}
                          </TableCell>
                          <TableCell>{wastagePercentage.toFixed(1)}%</TableCell>
                          <TableCell>
                            {wastageCost.toFixed(2)} {sku.currency || ""}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell>Total</TableCell>
                      <TableCell>{skus.reduce((total, sku) => total + (sku.totalProcured || 0), 0)}</TableCell>
                      <TableCell>{skus.reduce((total, sku) => total + (sku.availableQuantity || 0), 0)}</TableCell>
                      <TableCell>{skus.reduce((total, sku) => total + (sku.taggedForProduction || 0), 0)}</TableCell>
                      <TableCell>
                        {skus.reduce(
                          (total, sku) => total + ((sku.availableQuantity || 0) - (sku.taggedForProduction || 0)),
                          0,
                        )}
                      </TableCell>
                      <TableCell>{skus.reduce((total, sku) => total + (sku.wastage || 0), 0)}</TableCell>
                      <TableCell>
                        {(
                          (skus.reduce((total, sku) => total + (sku.wastage || 0), 0) /
                            Math.max(
                              1,
                              skus.reduce((total, sku) => total + (sku.totalProcured || 0), 0),
                            )) *
                          100
                        ).toFixed(1)}
                        %
                      </TableCell>
                      <TableCell>
                        {skus.reduce((total, sku) => total + (sku.wastage || 0) * (sku.unitCost || 0), 0).toFixed(2)}{" "}
                        {skus[0]?.currency || "USD"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTotalDialogOpen(false)}>
              Close
            </Button>
            <Button variant="default" onClick={() => setIsTotalDialogOpen(false)}>
              <FileText className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}