"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Search, AlertTriangle, User, Activity } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/dashboard/page-header"

export default function TaskTrackingPage() {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [unitFilter, setUnitFilter] = useState("all")
  const [assignedToFilter, setAssignedToFilter] = useState("")

  // Mock data for tasks
  const tasks = [
    {
      id: "T-001",
      taskGroupId: "P-2023-001",
      taskGroupName: "Quality Audit Process",
      name: "Operate Forklift",
      assignedTo: "John Doe",
      deadline: "2025-06-02",
      status: "In Progress",
      progress: 65,
      priority: "High",
      department: "Assembly",
      startDate: "2023-12-01",
      unit: "Assembly Unit A",
      timeElapsed: 40, // in minutes
      expectedTime: 100, // in minutes
    },
    {
      id: "T-002",
      taskGroupId: "P-2023-002",
      taskGroupName: "Office Setup Production Line Check",
      name: "Production Line Operation",
      assignedTo: "Jane Smith",
      deadline: "2025-06-01",
      status: "Completed",
      progress: 100,
      priority: "Medium",
      department: "Quality Control",
      startDate: "2023-12-03",
      unit: "Quality Control Unit",
      timeElapsed: 90, // in minutes
      expectedTime: 90, // in minutes
    },
    {
      id: "T-003",
      taskGroupId: "P-2023-003",
      taskGroupName: "Facility Security Review",
      name: "Equipment Maintenance Planning",
      assignedTo: "Mike Johnson",
      deadline: "2025-06-05",
      status: "Not Started",
      progress: 0,
      priority: "Low",
      department: "Packaging",
      startDate: "2023-12-12",
      unit: "Packaging Unit",
      timeElapsed: 0, // in minutes
      expectedTime: 120, // in minutes
    },
    {
      id: "T-004",
      taskGroupId: "P-2023-004",
      taskGroupName: "Quality Audit Process",
      name: "Quality Control Inspection",
      assignedTo: "Sarah Williams",
      deadline: "2025-06-03",
      status: "Delayed",
      progress: 30,
      priority: "High",
      department: "Materials",
      startDate: "2023-12-02",
      unit: "Materials Unit",
      timeElapsed: 150, // in minutes
      expectedTime: 120, // in minutes
    },
    {
      id: "T-005",
      taskGroupId: "P-2023-005",
      taskGroupName: "Office Setup Production Line Check",
      name: "Facility Maintenance",
      assignedTo: "Robert Brown",
      deadline: "2025-06-07",
      status: "In Progress",
      progress: 45,
      priority: "Medium",
      department: "Quality Control",
      startDate: "2023-12-05",
      unit: "Quality Control Unit",
      timeElapsed: 60, // in minutes
      expectedTime: 120, // in minutes
    },
    {
      id: "T-006",
      taskGroupId: "P-2023-006",
      taskGroupName: "Facility Security Review",
      name: "Inventory Management",
      assignedTo: "Emily Davis",
      deadline: "2025-06-02",
      status: "In Progress",
      progress: 80,
      priority: "High",
      department: "Testing",
      startDate: "2023-12-01",
      unit: "Testing Unit",
      timeElapsed: 100, // in minutes
      expectedTime: 120, // in minutes
    },
    {
      id: "T-007",
      taskGroupId: "P-2023-007",
      taskGroupName: "Quality Audit Process",
      name: "Safety Compliance Audit",
      assignedTo: "David Wilson",
      deadline: "2025-06-01",
      status: "Completed",
      progress: 100,
      priority: "Medium",
      department: "Inventory",
      startDate: "2023-12-04",
      unit: "Inventory Unit",
      timeElapsed: 60, // in minutes
      expectedTime: 60, // in minutes
    },
    {
      id: "T-008",
      taskGroupId: "P-2023-008",
      taskGroupName: "Office Setup Production Line Check",
      name: "Machine Setup and Configuration",
      assignedTo: "Lisa Martinez",
      deadline: "2025-06-04",
      status: "Not Started",
      progress: 0,
      priority: "High",
      department: "Maintenance",
      startDate: "2023-12-14",
      unit: "Maintenance Unit",
      timeElapsed: 0, // in minutes
      expectedTime: 180, // in minutes
    },
    {
      id: "T-009",
      taskGroupId: "P-2023-004",
      taskGroupName: "Facility Security Review",
      name: "Equipment Performance Monitoring",
      assignedTo: "Sarah Williams",
      deadline: "2025-06-03",
      status: "Overdue",
      progress: 50,
      priority: "High",
      department: "Materials",
      startDate: "2023-12-03",
      unit: "Materials Unit",
      timeElapsed: 200, // in minutes
      expectedTime: 90, // in minutes
    },
    {
      id: "T-010",
      taskGroupId: "P-2023-009",
      taskGroupName: "Administrative Tasks",
      name: "Administrative Coordination",
      assignedTo: "Carlos Rodriguez",
      deadline: "2025-06-10",
      status: "In Progress",
      progress: 20,
      priority: "Low",
      department: "Administration",
      startDate: "2023-12-06",
      unit: "Admin Unit",
      timeElapsed: 30, // in minutes
      expectedTime: 150, // in minutes
    },
  ]

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    // Filter by search term
    const matchesSearch =
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "in-progress" && task.status === "In Progress") ||
      (statusFilter === "completed" && task.status === "Completed") ||
      (statusFilter === "not-started" && task.status === "Not Started") ||
      (statusFilter === "delayed" && task.status === "Delayed") ||
      (statusFilter === "overdue" && task.status === "Overdue")

    // Filter by department
    const matchesDepartment =
      departmentFilter === "all" || task.department.toLowerCase() === departmentFilter.toLowerCase()

    // Filter by unit
    const matchesUnit = unitFilter === "all" || task.unit.toLowerCase().includes(unitFilter.toLowerCase())

    // Filter by assigned to
    const matchesAssignedTo =
      !assignedToFilter || task.assignedTo.toLowerCase().includes(assignedToFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesDepartment && matchesUnit && matchesAssignedTo
  })

  // Calculate task statistics
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter((task) => task.status === "Completed").length
  const inProgressTasks = filteredTasks.filter((task) => task.status === "In Progress").length
  const notStartedTasks = filteredTasks.filter((task) => task.status === "Not Started").length
  const delayedTasks = filteredTasks.filter((task) => task.status === "Delayed" || task.status === "Overdue").length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const averageProgress =
    totalTasks > 0 ? Math.round(filteredTasks.reduce((sum, task) => sum + task.progress, 0) / totalTasks) : 0

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case "Not Started":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Not Started
          </Badge>
        )
      case "Delayed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Delayed
          </Badge>
        )
      case "Overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Overdue
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Helper function to get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
            High
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">
            Medium
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // Helper function to get time progress color
  const getTimeProgressColor = (elapsed: number, expected: number) => {
    const percentage = (elapsed / expected) * 100
    return percentage > 100 ? "bg-red-500" : "bg-blue-500"
  }

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault()
    // Add context menu functionality here
    console.log(`Right-clicked on ${taskId}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Task Tracking"
        description="Monitor and update task progress and completion status"
        icon={Activity}
      />

      {/* Task Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <div className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">All assigned manufacturing tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
            <Progress value={averageProgress} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delayedTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks behind schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1 md:max-w-sm">
            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Assigned to..."
              className="pl-8"
              value={assignedToFilter}
              onChange={(e) => setAssignedToFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter" className="whitespace-nowrap">
              Status:
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="w-[140px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="delayed">Delayed/Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="department-filter" className="whitespace-nowrap">
              Department:
            </Label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger id="department-filter" className="w-[160px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="assembly">Assembly</SelectItem>
                <SelectItem value="quality control">Quality Control</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="unit-filter" className="whitespace-nowrap">
              Unit:
            </Label>
            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger id="unit-filter" className="w-[160px]">
                <SelectValue placeholder="All Units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                <SelectItem value="assembly unit a">Assembly Unit A</SelectItem>
                <SelectItem value="assembly unit b">Assembly Unit B</SelectItem>
                <SelectItem value="quality control unit">Quality Control Unit</SelectItem>
                <SelectItem value="packaging unit">Packaging Unit</SelectItem>
                <SelectItem value="materials unit">Materials Unit</SelectItem>
                <SelectItem value="testing unit">Testing Unit</SelectItem>
                <SelectItem value="maintenance unit">Maintenance Unit</SelectItem>
                <SelectItem value="inventory unit">Inventory Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Task Status Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({totalTasks})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressTasks})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks})</TabsTrigger>
          <TabsTrigger value="not-started">Not Started ({notStartedTasks})</TabsTrigger>
          <TabsTrigger value="delayed">Delayed ({delayedTasks})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Task ID</TableHead>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Project</TableHead>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Task Name</TableHead>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Assigned To</TableHead>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Deadline</TableHead>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Progress</TableHead>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Time Elapsed</TableHead>
                  <TableHead className="bg-muted text-muted-foreground font-medium">Expected Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const timeProgressPercentage = (task.timeElapsed / task.expectedTime) * 100
                  return (
                    <TableRow
                      key={task.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      onContextMenu={(e) => handleContextMenu(e, task.id)}
                    >
                      <TableCell className="p-2 align-middle">{task.id}</TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{task.taskGroupName}</span>
                          <span className="text-xs text-muted-foreground">{task.taskGroupId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle font-medium">{task.name}</TableCell>
                      <TableCell className="p-2 align-middle">{task.assignedTo}</TableCell>
                      <TableCell className="p-2 align-middle">{task.deadline}</TableCell>
                      <TableCell className="p-2 align-middle">{getStatusBadge(task.status)}</TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="flex items-center gap-2">
                          <Progress value={task.progress} className="h-2 w-[60px]" />
                          <span className="text-xs">{task.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className={`text-xs ${timeProgressPercentage > 100 ? "text-red-500 font-bold" : ""}`}>
                          {task.timeElapsed} mins
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="text-xs">{task.expectedTime} mins</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Other tab contents would be similar but filtered by status */}
        <TabsContent value="in-progress" className="mt-4">
          {/* Similar table but filtered for in-progress tasks */}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {/* Similar table but filtered for completed tasks */}
        </TabsContent>
        <TabsContent value="not-started" className="mt-4">
          {/* Similar table but filtered for not-started tasks */}
        </TabsContent>
        <TabsContent value="delayed" className="mt-4">
          {/* Similar table but filtered for delayed tasks */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
