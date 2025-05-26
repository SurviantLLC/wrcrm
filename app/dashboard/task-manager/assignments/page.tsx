"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Users } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Local types
interface Task {
  id: string
  name: string
  createdBy: string
  createdOn: string
  type: string
  skill: string
  unit: string
  description: string
}

interface TaskGroup {
  id: string
  name: string
  createdBy: string
  createdOn: string
  typeOfTG: string
  tgType: string
  numberOfTasks: string
  unit: string
  status: string
  department: string
  startDateTime?: string
  description?: string
  tasks: any[]
}

// Sample units data
const units = [
  { id: 1, name: "All" },
  { id: 2, name: "Unit 1" },
  { id: 3, name: "Production Unit 1" },
  { id: 4, name: "Asset Storing Facility" },
  { id: 5, name: "Main Office" },
]

// Sample task groups data with correct org unit and department values
const sampleTaskGroups: TaskGroup[] = [
  {
    id: "TG-001",
    name: "Daily Maintenance Tasks",
    createdBy: "John Manager",
    createdOn: "15/01/2024",
    typeOfTG: "Repetitive",
    tgType: "Maintenance Work",
    numberOfTasks: "3",
    unit: "Production Unit 1",
    status: "Active",
    department: "IT",
    startDateTime: "2024-01-15T08:00",
    description: "Daily maintenance routine for production equipment",
    tasks: [
      {
        id: 1,
        name: "Equipment Inspection",
        stepNumber: "1",
        assignToRole: "Maintenance",
        schedulingType: "repetitive",
        repeatPattern: "daily",
        duration: "2",
        assignTo: "John Smith",
        dependentSteps: [],
        startDateTime: "2024-01-15T08:00",
      },
      {
        id: 2,
        name: "Lubrication Check",
        stepNumber: "2",
        assignToRole: "Maintenance",
        schedulingType: "repetitive",
        repeatPattern: "daily",
        duration: "1.5",
        assignTo: "Mike Davis",
        dependentSteps: ["1"],
        startDateTime: "2024-01-15T10:00",
      },
      {
        id: 3,
        name: "Safety Systems Test",
        stepNumber: "3",
        assignToRole: "Supervisor",
        schedulingType: "repetitive",
        repeatPattern: "daily",
        duration: "1",
        assignTo: "Sarah Johnson",
        dependentSteps: ["1", "2"],
        startDateTime: "2024-01-15T11:30",
      },
    ],
  },
  {
    id: "TG-002",
    name: "Quality Audit Process",
    createdBy: "Sarah Supervisor",
    createdOn: "12/01/2024",
    typeOfTG: "One-time",
    tgType: "Auditing Work",
    numberOfTasks: "5",
    unit: "Asset Storing Facility",
    status: "Planned",
    department: "Auditing",
    startDateTime: "2024-01-20T09:00",
    description: "Comprehensive quality audit for stored assets",
    tasks: [
      {
        id: 4,
        name: "Documentation Review",
        stepNumber: "1",
        assignToRole: "Quality Control",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "3",
        assignTo: "Emily Brown",
        dependentSteps: [],
        startDateTime: "2024-01-20T09:00",
      },
      {
        id: 5,
        name: "Physical Asset Inspection",
        stepNumber: "2",
        assignToRole: "Quality Control",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "4",
        assignTo: "David Wilson",
        dependentSteps: ["1"],
        startDateTime: "2024-01-20T12:00",
      },
      {
        id: 6,
        name: "Compliance Verification",
        stepNumber: "3",
        assignToRole: "Quality Control",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "2",
        assignTo: "Lisa Anderson",
        dependentSteps: ["2"],
        startDateTime: "2024-01-20T16:00",
      },
      {
        id: 7,
        name: "Report Generation",
        stepNumber: "4",
        assignToRole: "Supervisor",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "2",
        assignTo: "Robert Taylor",
        dependentSteps: ["3"],
        startDateTime: "2024-01-21T09:00",
      },
      {
        id: 8,
        name: "Management Review",
        stepNumber: "5",
        assignToRole: "Manager",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "1",
        assignTo: "Jennifer Martinez",
        dependentSteps: ["4"],
        startDateTime: "2024-01-21T11:00",
      },
    ],
  },
  {
    id: "TG-003",
    name: "Office Setup Tasks",
    createdBy: "Mike Admin",
    createdOn: "10/01/2024",
    typeOfTG: "One-time",
    tgType: "Internal Orders",
    numberOfTasks: "4",
    unit: "Main Office",
    status: "Completed",
    department: "IT",
    startDateTime: "2024-01-10T10:00",
    description: "Setup tasks for new office space",
    tasks: [
      {
        id: 9,
        name: "Network Infrastructure Setup",
        stepNumber: "1",
        assignToRole: "Worker",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "4",
        assignTo: "Christopher Lee",
        dependentSteps: [],
        startDateTime: "2024-01-10T10:00",
      },
      {
        id: 10,
        name: "Workstation Configuration",
        stepNumber: "2",
        assignToRole: "Worker",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "3",
        assignTo: "Amanda Garcia",
        dependentSteps: ["1"],
        startDateTime: "2024-01-10T14:00",
      },
      {
        id: 11,
        name: "Software Installation",
        stepNumber: "3",
        assignToRole: "Worker",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "2",
        assignTo: "John Smith",
        dependentSteps: ["2"],
        startDateTime: "2024-01-11T09:00",
      },
      {
        id: 12,
        name: "System Testing",
        stepNumber: "4",
        assignToRole: "Supervisor",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "1.5",
        assignTo: "Sarah Johnson",
        dependentSteps: ["3"],
        startDateTime: "2024-01-11T11:00",
      },
    ],
  },
  {
    id: "TG-004",
    name: "Production Line Check",
    createdBy: "Lisa Engineer",
    createdOn: "08/01/2024",
    typeOfTG: "Repetitive",
    tgType: "Production Work",
    numberOfTasks: "6",
    unit: "Unit 1",
    status: "Active",
    department: "Quality Check",
    startDateTime: "2024-01-08T07:00",
    description: "Regular production line inspection and maintenance",
    tasks: [
      {
        id: 13,
        name: "Line Startup Inspection",
        stepNumber: "1",
        assignToRole: "Worker",
        schedulingType: "repetitive",
        repeatPattern: "daily",
        duration: "1",
        assignTo: "Mike Davis",
        dependentSteps: [],
        startDateTime: "2024-01-08T07:00",
      },
      {
        id: 14,
        name: "Quality Control Check",
        stepNumber: "2",
        assignToRole: "Quality Control",
        schedulingType: "repetitive",
        repeatPattern: "daily",
        duration: "2",
        assignTo: "Emily Brown",
        dependentSteps: ["1"],
        startDateTime: "2024-01-08T08:00",
      },
      {
        id: 15,
        name: "Production Rate Monitoring",
        stepNumber: "3",
        assignToRole: "Supervisor",
        schedulingType: "repetitive",
        repeatPattern: "daily",
        duration: "1.5",
        assignTo: "David Wilson",
        dependentSteps: ["2"],
        startDateTime: "2024-01-08T10:00",
      },
      {
        id: 16,
        name: "Equipment Calibration",
        stepNumber: "4",
        assignToRole: "Maintenance",
        schedulingType: "repetitive",
        repeatPattern: "weekly",
        duration: "3",
        assignTo: "Lisa Anderson",
        dependentSteps: ["1"],
        startDateTime: "2024-01-08T11:30",
      },
      {
        id: 17,
        name: "Safety Protocol Review",
        stepNumber: "5",
        assignToRole: "Supervisor",
        schedulingType: "repetitive",
        repeatPattern: "daily",
        duration: "0.5",
        assignTo: "Robert Taylor",
        dependentSteps: ["3"],
        startDateTime: "2024-01-08T14:30",
      },
      {
        id: 18,
        name: "End of Shift Report",
        stepNumber: "6",
        assignToRole: "Worker",
        schedulingType: "repetitive",
        repeatPattern: "daily",
        duration: "0.5",
        assignTo: "Jennifer Martinez",
        dependentSteps: ["5"],
        startDateTime: "2024-01-08T15:00",
      },
    ],
  },
  {
    id: "TG-005",
    name: "Facility Security Review",
    createdBy: "Robert Security",
    createdOn: "05/01/2024",
    typeOfTG: "One-time",
    tgType: "Auditing Work",
    numberOfTasks: "2",
    unit: "Asset Storing Facility",
    status: "Planned",
    department: "Auditing",
    startDateTime: "2024-01-25T14:00",
    description: "Security assessment of storage facilities",
    tasks: [
      {
        id: 19,
        name: "Access Control Audit",
        stepNumber: "1",
        assignToRole: "Quality Control",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "3",
        assignTo: "Christopher Lee",
        dependentSteps: [],
        startDateTime: "2024-01-25T14:00",
      },
      {
        id: 20,
        name: "Security System Testing",
        stepNumber: "2",
        assignToRole: "Supervisor",
        schedulingType: "one-time",
        repeatPattern: "",
        duration: "2",
        assignTo: "Amanda Garcia",
        dependentSteps: ["1"],
        startDateTime: "2024-01-25T17:00",
      },
    ],
  },
]

// Sample departments data
const departments = [
  { id: 1, name: "All" },
  { id: 2, name: "Auditing" },
  { id: 3, name: "Quality Check" },
  { id: 4, name: "IT" },
]

// Sample task names for dropdown
const taskNames = [
  "Equipment Inspection",
  "Lubrication Check",
  "Safety Systems Test",
  "Documentation Review",
  "Physical Asset Inspection",
  "Compliance Verification",
  "Report Generation",
  "Management Review",
  "Network Infrastructure Setup",
  "Workstation Configuration",
  "Software Installation",
  "System Testing",
  "Line Startup Inspection",
  "Quality Control Check",
  "Production Rate Monitoring",
  "Equipment Calibration",
  "Safety Protocol Review",
  "End of Shift Report",
  "Access Control Audit",
  "Security System Testing",
  "Preventive Maintenance",
  "Emergency Response Drill",
  "Inventory Count",
  "Asset Tagging",
  "Performance Testing",
  "Data Backup",
  "System Monitoring",
  "Training Session",
  "Process Optimization",
  "Waste Management",
  "Environmental Check",
  "Fire Safety Inspection",
  "Electrical Testing",
  "Mechanical Inspection",
  "Cleaning and Sanitization",
  "Material Handling",
  "Order Processing",
  "Shipping Preparation",
  "Receiving Inspection",
  "Storage Organization",
]

// Update the getStatusBadge function to use semantic colors
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Planned":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Planned
        </Badge>
      )
    case "Active":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Active
        </Badge>
      )
    case "Completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Completed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function TaskAssignmentPage() {
  // Local state management
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(sampleTaskGroups)
  const [tasks, setTasks] = useState<Task[]>([])
  const [lastCreatedTaskGroup, setLastCreatedTaskGroup] = useState<TaskGroup | null>(null)
  const [showTaskGroupCreatedNotification, setShowTaskGroupCreatedNotification] = useState(false)
  const [lastCreatedTask, setLastCreatedTask] = useState<Task | null>(null)
  const [showTaskCreatedNotification, setShowTaskCreatedNotification] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTaskGroup, setSelectedTaskGroup] = useState<TaskGroup | null>(null)

  // Form state
  const [newTaskGroup, setNewTaskGroup] = useState({
    name: "",
    typeOfTG: "",
    tgType: "",
    numberOfTasks: "",
    unit: "",
    department: "",
    description: "",
    startDateTime: "",
    tasks: [] as any[],
  })

  // Current task being added to the task map
  const [currentTask, setCurrentTask] = useState({
    name: "",
    stepNumber: "",
    assignToRole: "",
    schedulingType: "",
    repeatPattern: "",
    duration: "",
    assignTo: "",
    dependentSteps: [] as string[],
    startDateTime: "",
  })

  // Form validation
  const [errors, setErrors] = useState({
    name: false,
    typeOfTG: false,
    unit: false,
    department: false,
  })

  // Task validation
  const [taskErrors, setTaskErrors] = useState({
    name: false,
    assignToRole: false,
    stepNumber: false,
  })

  const itemsPerPage = 5

  // Local functions
  const addTaskGroup = (taskGroup: TaskGroup) => {
    setTaskGroups((prev) => [...prev, taskGroup])
    setLastCreatedTaskGroup(taskGroup)
    setShowTaskGroupCreatedNotification(true)
    setTimeout(() => setShowTaskGroupCreatedNotification(false), 5000)
  }

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task])
    setLastCreatedTask(task)
    setShowTaskCreatedNotification(true)
    setTimeout(() => setShowTaskCreatedNotification(false), 5000)
  }

  // Filter task groups based on search term and status filter
  const filteredTaskGroups = taskGroups.filter((taskGroup) => {
    const matchesSearch =
      taskGroup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taskGroup.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || taskGroup.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Paginate task groups
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTaskGroups = filteredTaskGroups.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTaskGroups.length / itemsPerPage)

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Handle row click to show details
  const handleRowClick = (taskGroup: TaskGroup) => {
    setSelectedTaskGroup(taskGroup)
    setIsDetailsDialogOpen(true)
  }

  // Handle row double click to edit
  const handleRowDoubleClick = (taskGroup: TaskGroup) => {
    setSelectedTaskGroup(taskGroup)

    // Initialize the edit form with the selected task group data
    setNewTaskGroup({
      name: taskGroup.name,
      typeOfTG: taskGroup.typeOfTG,
      tgType: taskGroup.tgType,
      numberOfTasks: taskGroup.numberOfTasks,
      unit: taskGroup.unit,
      department: taskGroup.department,
      description: taskGroup.description || "",
      startDateTime: taskGroup.startDateTime || "",
      tasks: [...taskGroup.tasks],
    })

    setIsEditDialogOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewTaskGroup({
      ...newTaskGroup,
      [field]: value,
    })

    // Clear error for this field if it has a value
    if (value) {
      setErrors({
        ...errors,
        [field]: false,
      })
    }
  }

  // Generate next task ID
  const generateNextTaskId = () => {
    // Extract numbers from task IDs and find the highest
    const taskNumbers = tasks
      .map((task) => {
        const match = task.id?.match(/T-(\d+)/)
        return match ? Number.parseInt(match[1], 10) : 0
      })
      .filter((num) => !isNaN(num))

    const highestNumber = taskNumbers.length > 0 ? Math.max(...taskNumbers) : 0
    const nextNumber = highestNumber + 1
    return `T-${String(nextNumber).padStart(3, "0")}`
  }

  // Format current date as MM/DD/YYYY
  const getCurrentDate = () => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const year = now.getFullYear()
    return `${month}/${day}/${year}`
  }

  // Get available step numbers from existing tasks
  const getAvailableStepNumbers = () => {
    return newTaskGroup.tasks
      .filter((task) => task.stepNumber)
      .map((task) => task.stepNumber)
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
  }

  // Handle dependent step selection
  const handleDependentStepChange = (selectedSteps: string[]) => {
    setCurrentTask({
      ...currentTask,
      dependentSteps: selectedSteps,
    })
  }

  // Validate step number (must be a positive integer starting from 1)
  const validateStepNumber = (value: string) => {
    const numValue = Number.parseInt(value, 10)
    return !isNaN(numValue) && numValue > 0
  }

  // Handle step number input change with validation
  const handleStepNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty value (for clearing the input)
    if (value === "") {
      setCurrentTask({
        ...currentTask,
        stepNumber: "",
      })
      setTaskErrors({
        ...taskErrors,
        stepNumber: false,
      })
      return
    }

    // Only allow positive integers
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      setCurrentTask({
        ...currentTask,
        stepNumber: numValue.toString(),
      })
      setTaskErrors({
        ...taskErrors,
        stepNumber: false,
      })
    } else {
      setTaskErrors({
        ...taskErrors,
        stepNumber: true,
      })
    }
  }

  // Handle adding a task to the task map
  const handleAddTask = () => {
    // Validate required fields
    const newTaskErrors = {
      name: !currentTask.name,
      assignToRole: !currentTask.assignToRole,
      stepNumber: currentTask.stepNumber !== "" && !validateStepNumber(currentTask.stepNumber),
    }

    setTaskErrors(newTaskErrors)

    if (newTaskErrors.name || newTaskErrors.assignToRole || newTaskErrors.stepNumber) {
      return
    }

    // Add task to the task group
    setNewTaskGroup({
      ...newTaskGroup,
      tasks: [...newTaskGroup.tasks, { ...currentTask, id: Date.now() }],
    })

    // Reset current task form
    setCurrentTask({
      name: "",
      stepNumber: "",
      assignToRole: "",
      schedulingType: newTaskGroup.typeOfTG === "One-time" ? "one-time" : "repetitive",
      repeatPattern: "daily",
      duration: "",
      assignTo: "",
      dependentSteps: [],
      startDateTime: "",
    })
  }

  // Handle removing a task from the task map
  const handleRemoveTask = (taskId: number) => {
    setNewTaskGroup({
      ...newTaskGroup,
      tasks: newTaskGroup.tasks.filter((task) => task.id !== taskId),
    })
  }

  // Handle task input changes
  const handleTaskInputChange = (field: string, value: string) => {
    setCurrentTask({
      ...currentTask,
      [field]: value,
    })

    // Clear error for this field if it has a value
    if (value && taskErrors[field as keyof typeof taskErrors]) {
      setTaskErrors({
        ...taskErrors,
        [field]: false,
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: !newTaskGroup.name,
      typeOfTG: !newTaskGroup.typeOfTG,
      unit: !newTaskGroup.unit,
      department: !newTaskGroup.department,
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  // Handle creating a new task group
  const handleCreateTaskGroup = () => {
    if (!validateForm()) return

    const newId = `TG-${String(taskGroups.length + 1).padStart(3, "0")}`
    const today = format(new Date(), "dd/MM/yyyy")

    // Add each task in the task group to the task repository
    newTaskGroup.tasks.forEach((task) => {
      // Generate a new task ID based on the highest existing ID
      const nextTaskId = generateNextTaskId()

      addTask({
        id: nextTaskId,
        name: task.name,
        createdBy: "Current User",
        createdOn: getCurrentDate(),
        type: newTaskGroup.typeOfTG,
        skill: task.assignToRole,
        unit: newTaskGroup.unit,
        description: `Task from group: ${newTaskGroup.name}`,
      })
    })

    const newGroup: TaskGroup = {
      id: newId,
      name: newTaskGroup.name,
      createdBy: "Current User",
      createdOn: today,
      typeOfTG: newTaskGroup.typeOfTG,
      tgType: newTaskGroup.tgType,
      numberOfTasks: newTaskGroup.tasks.length.toString(),
      unit: newTaskGroup.unit,
      status: "Planned",
      department: newTaskGroup.department,
      startDateTime: newTaskGroup.startDateTime,
      description: newTaskGroup.description,
      tasks: newTaskGroup.tasks,
    }

    addTaskGroup(newGroup)
    setIsCreateDialogOpen(false)

    // Reset form
    resetTaskGroupForm()
  }

  // Handle updating an existing task group
  const handleUpdateTaskGroup = () => {
    if (!validateForm() || !selectedTaskGroup) return

    const updatedTaskGroups = taskGroups.map((taskGroup) =>
      taskGroup.id === selectedTaskGroup.id
        ? {
            ...taskGroup,
            name: newTaskGroup.name,
            typeOfTG: newTaskGroup.typeOfTG,
            tgType: newTaskGroup.tgType,
            numberOfTasks: newTaskGroup.tasks.length.toString(),
            unit: newTaskGroup.unit,
            department: newTaskGroup.department,
            startDateTime: newTaskGroup.startDateTime,
            description: newTaskGroup.description,
            tasks: newTaskGroup.tasks,
          }
        : taskGroup,
    )

    setTaskGroups(updatedTaskGroups)
    setIsEditDialogOpen(false)

    // Reset form
    resetTaskGroupForm()
  }

  // Reset task group form
  const resetTaskGroupForm = () => {
    setNewTaskGroup({
      name: "",
      typeOfTG: "",
      tgType: "",
      numberOfTasks: "",
      unit: "",
      department: "",
      description: "",
      startDateTime: "",
      tasks: [],
    })

    setCurrentTask({
      name: "",
      stepNumber: "",
      assignToRole: "",
      schedulingType: "",
      repeatPattern: "daily",
      duration: "",
      assignTo: "",
      dependentSteps: [],
      startDateTime: "",
    })
  }

  // Handle marking a task group as completed
  const handleMarkAsCompleted = (taskGroupId: string) => {
    const updatedTaskGroups = taskGroups.map((taskGroup) =>
      taskGroup.id === taskGroupId
        ? {
            ...taskGroup,
            status: "Completed",
          }
        : taskGroup,
    )

    setTaskGroups(updatedTaskGroups)
    setIsDetailsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Task Assignment"
        description="This is mainly for creating Task Groups based on Orders/Projects or Without Orders. In MVP we will concentrate on Task Groups without Orders"
        icon={Users}
      />

      {/* Task Created Notification */}
      {showTaskCreatedNotification && lastCreatedTask && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Task Created</AlertTitle>
          <AlertDescription className="text-green-700">
            Task "{lastCreatedTask.name}" has been added to the repository with ID {lastCreatedTask.id}.
          </AlertDescription>
        </Alert>
      )}

      {/* Task Group Created Notification */}
      {showTaskGroupCreatedNotification && lastCreatedTaskGroup && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Task Group Created</AlertTitle>
          <AlertDescription className="text-green-700">
            Task Group "{lastCreatedTaskGroup.name}" has been created successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="border-t border-b py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div>
              <Label htmlFor="search" className="font-medium">
                Search
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Label htmlFor="search" className="whitespace-nowrap">
                  Task Group Name
                </Label>
                <div className="relative w-full sm:w-64">
                  <Input
                    id="search"
                    placeholder="Search task groups..."
                    className="bg-background border-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter" className="font-medium">
                Task Group Status
              </Label>
              <div className="mt-1">
                <Select onValueChange={(value) => setStatusFilter(value)} defaultValue="All">
                  <SelectTrigger id="status-filter" className="w-[220px] bg-background border-input">
                    <SelectValue placeholder="Active/Planned/Completed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Task Group
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader className="bg-gray-800 text-white">
            <TableRow className="hover:bg-gray-800">
              <TableHead className="text-white font-semibold">Task GID</TableHead>
              <TableHead className="text-white font-semibold">TG Name</TableHead>
              <TableHead className="text-white font-semibold">Created By</TableHead>
              <TableHead className="text-white font-semibold">Created On</TableHead>
              <TableHead className="text-white font-semibold">Type of TG</TableHead>
              <TableHead className="text-white font-semibold">TG Type</TableHead>
              <TableHead className="text-white font-semibold">No# of Task</TableHead>
              <TableHead className="text-white font-semibold">Org Unit</TableHead>
              <TableHead className="text-white font-semibold">TG Status</TableHead>
              <TableHead className="text-white font-semibold">Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTaskGroups.length > 0 ? (
              currentTaskGroups.map((taskGroup, index) => (
                <TableRow
                  key={taskGroup.id}
                  className="bg-muted/30"
                  onClick={() => handleRowClick(taskGroup)}
                  onDoubleClick={() => handleRowDoubleClick(taskGroup)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell className="font-medium">{taskGroup.id}</TableCell>
                  <TableCell>{taskGroup.name}</TableCell>
                  <TableCell>{taskGroup.createdBy}</TableCell>
                  <TableCell>{taskGroup.createdOn}</TableCell>
                  <TableCell>{taskGroup.typeOfTG}</TableCell>
                  <TableCell>{taskGroup.tgType}</TableCell>
                  <TableCell>{taskGroup.numberOfTasks}</TableCell>
                  <TableCell>{taskGroup.unit}</TableCell>
                  <TableCell>{getStatusBadge(taskGroup.status)}</TableCell>
                  <TableCell>{taskGroup.department}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No task groups found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredTaskGroups.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTaskGroups.length)} of{" "}
            {filteredTaskGroups.length} task groups
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
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

      {/* Create Task Group Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle>Create New Task Group</DialogTitle>
            <DialogDescription>Add a new task group and map its tasks</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Task Group Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Task Group Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-group-name" className={errors.name ? "text-red-500" : ""}>
                    Task Group Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="task-group-name"
                    value={newTaskGroup.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm">Task group name is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tg-type">TG Type</Label>
                  <Select value={newTaskGroup.tgType} onValueChange={(value) => handleInputChange("tgType", value)}>
                    <SelectTrigger id="tg-type">
                      <SelectValue placeholder="Select TG type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maintainance Work">Maintainance Work</SelectItem>
                      <SelectItem value="Auditing Work">Auditing Work</SelectItem>
                      <SelectItem value="Production Work">Production Work</SelectItem>
                      <SelectItem value="Internal Orders">Internal Orders</SelectItem>
                      <SelectItem value="External Orders">External Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="task-group-type" className={errors.typeOfTG ? "text-red-500" : ""}>
                    Task Group Schedule Type<span className="text-red-500">*</span>
                  </Label>
                  <Select value={newTaskGroup.typeOfTG} onValueChange={(value) => handleInputChange("typeOfTG", value)}>
                    <SelectTrigger id="task-group-type" className={errors.typeOfTG ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Repetitive">Repetitive Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.typeOfTG && <p className="text-red-500 text-sm">Schedule type is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="unit" className={errors.unit ? "text-red-500" : ""}>
                    Org Unit<span className="text-red-500">*</span>
                  </Label>
                  <Select value={newTaskGroup.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger id="unit" className={errors.unit ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select org unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unit && <p className="text-red-500 text-sm">Org Unit is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department" className={errors.department ? "text-red-500" : ""}>
                    Department<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newTaskGroup.department}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger id="department" className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-red-500 text-sm">Department is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="start-date-time">Start Date & Time</Label>
                  <Input
                    id="start-date-time"
                    type="datetime-local"
                    value={newTaskGroup.startDateTime}
                    onChange={(e) => handleInputChange("startDateTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2 mt-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTaskGroup.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter task group description"
                />
              </div>
            </div>

            {/* Task Map */}
            <div className="border-4 border-blue-500 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Task Map</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-name" className={taskErrors.name ? "text-red-500" : ""}>
                    Task Name<span className="text-red-500">*</span>
                  </Label>
                  <Select value={currentTask.name} onValueChange={(value) => handleTaskInputChange("name", value)}>
                    <SelectTrigger id="task-name" className={taskErrors.name ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select task name" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskNames.map((taskName) => (
                        <SelectItem key={taskName} value={taskName}>
                          {taskName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {taskErrors.name && <p className="text-red-500 text-sm">Task name is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="step-number" className={taskErrors.stepNumber ? "text-red-500" : ""}>
                    Step Number
                  </Label>
                  <Input
                    id="step-number"
                    type="number"
                    min="1"
                    value={currentTask.stepNumber}
                    onChange={handleStepNumberChange}
                    className={taskErrors.stepNumber ? "border-red-500" : ""}
                    placeholder="Enter a positive number (1, 2, 3...)"
                  />
                  {taskErrors.stepNumber && (
                    <p className="text-red-500 text-sm">Step number must be a positive integer (1 or greater)</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="task-start-date-time">Start Date & Time</Label>
                  <Input
                    id="task-start-date-time"
                    type="datetime-local"
                    value={currentTask.startDateTime}
                    onChange={(e) => handleTaskInputChange("startDateTime", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dependent-steps">Dependent Steps</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    {getAvailableStepNumbers().length > 0 ? (
                      getAvailableStepNumbers().map((stepNumber) => (
                        <div key={stepNumber} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`step-${stepNumber}`}
                            className="mr-1"
                            checked={currentTask.dependentSteps.includes(stepNumber)}
                            onChange={(e) => {
                              const updatedSteps = e.target.checked
                                ? [...currentTask.dependentSteps, stepNumber]
                                : currentTask.dependentSteps.filter((step) => step !== stepNumber)
                              handleDependentStepChange(updatedSteps)
                            }}
                          />
                          <Label htmlFor={`step-${stepNumber}`} className="text-sm">
                            Step {stepNumber}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No steps available yet</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Scheduling Type</Label>
                  <RadioGroup
                    value={newTaskGroup.typeOfTG}
                    onValueChange={(value) => handleInputChange("typeOfTG", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="One-time" id="one-time" />
                      <Label htmlFor="one-time" className="font-normal">
                        One-time
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Repetitive" id="repetitive" />
                      <Label htmlFor="repetitive" className="font-normal">
                        Repetitive
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {newTaskGroup.typeOfTG === "Repetitive" && (
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-pattern">Repeat Pattern</Label>
                    <Select
                      value={currentTask.repeatPattern}
                      onValueChange={(value) => handleTaskInputChange("repeatPattern", value)}
                    >
                      <SelectTrigger id="repeat-pattern">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="task-duration">Task Duration (hours)</Label>
                  <Input
                    id="task-duration"
                    type="number"
                    min="0"
                    step="0.1"
                    value={currentTask.duration}
                    onChange={(e) => handleTaskInputChange("duration", e.target.value)}
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assign-to-role" className={taskErrors.assignToRole ? "text-red-500" : ""}>
                      Assign to Role<span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={currentTask.assignToRole}
                      onValueChange={(value) => handleTaskInputChange("assignToRole", value)}
                    >
                      <SelectTrigger id="assign-to-role" className={taskErrors.assignToRole ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Worker">Worker</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Quality Control">Quality Control</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    {taskErrors.assignToRole && <p className="text-red-500 text-sm">Role is required</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="assign-to">Assign To</Label>
                    <Select
                      value={currentTask.assignTo}
                      onValueChange={(value) => handleTaskInputChange("assignTo", value)}
                    >
                      <SelectTrigger id="assign-to">
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                        <SelectItem value="Emily Brown">Emily Brown</SelectItem>
                        <SelectItem value="David Wilson">David Wilson</SelectItem>
                        <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
                        <SelectItem value="Robert Taylor">Robert Taylor</SelectItem>
                        <SelectItem value="Jennifer Martinez">Jennifer Martinez</SelectItem>
                        <SelectItem value="Christopher Lee">Christopher Lee</SelectItem>
                        <SelectItem value="Amanda Garcia">Amanda Garcia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button onClick={handleAddTask} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Task
                </Button>
              </div>

              {/* Task Table */}
              <div className="mt-4 rounded-md border">
                <Table>
                  <TableHeader className="bg-primary text-primary-foreground">
                    <TableRow>
                      <TableHead className="text-primary-foreground">Task Name</TableHead>
                      <TableHead className="text-primary-foreground">Step</TableHead>
                      <TableHead className="text-primary-foreground">Start Date & Time</TableHead>
                      <TableHead className="text-primary-foreground">Role</TableHead>
                      <TableHead className="text-primary-foreground">Scheduling</TableHead>
                      <TableHead className="text-primary-foreground">Duration</TableHead>
                      <TableHead className="text-primary-foreground">Assigned To</TableHead>
                      <TableHead className="text-primary-foreground">Dependent Steps</TableHead>
                      <TableHead className="text-primary-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newTaskGroup.tasks.length > 0 ? (
                      newTaskGroup.tasks.map((task, index) => (
                        <TableRow key={task.id} className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.stepNumber || "-"}</TableCell>
                          <TableCell>
                            {task.startDateTime ? new Date(task.startDateTime).toLocaleString() : "-"}
                          </TableCell>
                          <TableCell>{task.assignToRole}</TableCell>
                          <TableCell>
                            {newTaskGroup.typeOfTG === "One-time" ? "One-time" : `Repetitive (${task.repeatPattern})`}
                          </TableCell>
                          <TableCell>{task.duration ? `${task.duration} hours` : "-"}</TableCell>
                          <TableCell>{task.assignTo || "-"}</TableCell>
                          <TableCell>
                            {task.dependentSteps && task.dependentSteps.length > 0
                              ? task.dependentSteps.map((step: number | string) => `Step ${step}`).join(", ")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTask(task.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No tasks added yet. Add tasks using the form above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTaskGroup}
              disabled={!newTaskGroup.name || !newTaskGroup.typeOfTG || !newTaskGroup.unit || !newTaskGroup.department}
              className="bg-primary hover:bg-primary/90"
            >
              Create Task Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle>Edit Task Group</DialogTitle>
            <DialogDescription>Edit an existing task group and its tasks</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Task Group Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Task Group Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-group-name" className={errors.name ? "text-red-500" : ""}>
                    Task Group Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-task-group-name"
                    value={newTaskGroup.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm">Task group name is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-tg-type">TG Type</Label>
                  <Select value={newTaskGroup.tgType} onValueChange={(value) => handleInputChange("tgType", value)}>
                    <SelectTrigger id="edit-tg-type">
                      <SelectValue placeholder="Select TG type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maintainance Work">Maintainance Work</SelectItem>
                      <SelectItem value="Auditing Work">Auditing Work</SelectItem>
                      <SelectItem value="Production Work">Production Work</SelectItem>
                      <SelectItem value="Internal Orders">Internal Orders</SelectItem>
                      <SelectItem value="External Orders">External Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-task-group-type" className={errors.typeOfTG ? "text-red-500" : ""}>
                    Task Group Schedule Type<span className="text-red-500">*</span>
                  </Label>
                  <Select value={newTaskGroup.typeOfTG} onValueChange={(value) => handleInputChange("typeOfTG", value)}>
                    <SelectTrigger id="edit-task-group-type" className={errors.typeOfTG ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Repetitive">Repetitive Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.typeOfTG && <p className="text-red-500 text-sm">Schedule type is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-unit" className={errors.unit ? "text-red-500" : ""}>
                    Org Unit<span className="text-red-500">*</span>
                  </Label>
                  <Select value={newTaskGroup.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger id="edit-unit" className={errors.unit ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select org unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unit && <p className="text-red-500 text-sm">Org Unit is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-department" className={errors.department ? "text-red-500" : ""}>
                    Department<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newTaskGroup.department}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger id="edit-department" className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-red-500 text-sm">Department is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-start-date-time">Start Date & Time</Label>
                  <Input
                    id="edit-start-date-time"
                    type="datetime-local"
                    value={newTaskGroup.startDateTime}
                    onChange={(e) => handleInputChange("startDateTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2 mt-4">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newTaskGroup.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter task group description"
                />
              </div>
            </div>

            {/* Task Map */}
            <div className="border-4 border-blue-500 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Task Map</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-name" className={taskErrors.name ? "text-red-500" : ""}>
                    Task Name<span className="text-red-500">*</span>
                  </Label>
                  <Select value={currentTask.name} onValueChange={(value) => handleTaskInputChange("name", value)}>
                    <SelectTrigger id="edit-task-name" className={taskErrors.name ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select task name" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskNames.map((taskName) => (
                        <SelectItem key={taskName} value={taskName}>
                          {taskName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {taskErrors.name && <p className="text-red-500 text-sm">Task name is required</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-step-number" className={taskErrors.stepNumber ? "text-red-500" : ""}>
                    Step Number
                  </Label>
                  <Input
                    id="edit-step-number"
                    type="number"
                    min="1"
                    value={currentTask.stepNumber}
                    onChange={handleStepNumberChange}
                    className={taskErrors.stepNumber ? "border-red-500" : ""}
                    placeholder="Enter a positive number (1, 2, 3...)"
                  />
                  {taskErrors.stepNumber && (
                    <p className="text-red-500 text-sm">Step number must be a positive integer (1 or greater)</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-task-start-date-time">Start Date & Time</Label>
                  <Input
                    id="edit-task-start-date-time"
                    type="datetime-local"
                    value={currentTask.startDateTime}
                    onChange={(e) => handleTaskInputChange("startDateTime", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-dependent-steps">Dependent Steps</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    {getAvailableStepNumbers().length > 0 ? (
                      getAvailableStepNumbers().map((stepNumber) => (
                        <div key={stepNumber} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`step-${stepNumber}`}
                            className="mr-1"
                            checked={currentTask.dependentSteps.includes(stepNumber)}
                            onChange={(e) => {
                              const updatedSteps = e.target.checked
                                ? [...currentTask.dependentSteps, stepNumber]
                                : currentTask.dependentSteps.filter((step) => step !== stepNumber)
                              handleDependentStepChange(updatedSteps)
                            }}
                          />
                          <Label htmlFor={`step-${stepNumber}`} className="text-sm">
                            Step {stepNumber}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No steps available yet</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Scheduling Type</Label>
                  <RadioGroup
                    value={newTaskGroup.typeOfTG}
                    onValueChange={(value) => handleInputChange("typeOfTG", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="One-time" id="one-time" />
                      <Label htmlFor="one-time" className="font-normal">
                        One-time
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Repetitive" id="repetitive" />
                      <Label htmlFor="repetitive" className="font-normal">
                        Repetitive
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {newTaskGroup.typeOfTG === "Repetitive" && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-repeat-pattern">Repeat Pattern</Label>
                    <Select
                      value={currentTask.repeatPattern}
                      onValueChange={(value) => handleTaskInputChange("repeatPattern", value)}
                    >
                      <SelectTrigger id="edit-repeat-pattern">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="edit-task-duration">Task Duration (hours)</Label>
                  <Input
                    id="edit-task-duration"
                    type="number"
                    min="0"
                    step="0.1"
                    value={currentTask.duration}
                    onChange={(e) => handleTaskInputChange("duration", e.target.value)}
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-assign-to-role" className={taskErrors.assignToRole ? "text-red-500" : ""}>
                      Assign to Role<span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={currentTask.assignToRole}
                      onValueChange={(value) => handleTaskInputChange("assignToRole", value)}
                    >
                      <SelectTrigger
                        id="edit-assign-to-role"
                        className={taskErrors.assignToRole ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Worker">Worker</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Quality Control">Quality Control</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    {taskErrors.assignToRole && <p className="text-red-500 text-sm">Role is required</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-assign-to">Assign To</Label>
                    <Select
                      value={currentTask.assignTo}
                      onValueChange={(value) => handleTaskInputChange("assignTo", value)}
                    >
                      <SelectTrigger id="edit-assign-to">
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                        <SelectItem value="Emily Brown">Emily Brown</SelectItem>
                        <SelectItem value="David Wilson">David Wilson</SelectItem>
                        <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
                        <SelectItem value="Robert Taylor">Robert Taylor</SelectItem>
                        <SelectItem value="Jennifer Martinez">Jennifer Martinez</SelectItem>
                        <SelectItem value="Christopher Lee">Christopher Lee</SelectItem>
                        <SelectItem value="Amanda Garcia">Amanda Garcia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button onClick={handleAddTask} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Task
                </Button>
              </div>

              {/* Task Table */}
              <div className="mt-4 rounded-md border">
                <Table>
                  <TableHeader className="bg-primary text-primary-foreground">
                    <TableRow>
                      <TableHead className="text-primary-foreground">Task Name</TableHead>
                      <TableHead className="text-primary-foreground">Step</TableHead>
                      <TableHead className="text-primary-foreground">Start Date & Time</TableHead>
                      <TableHead className="text-primary-foreground">Role</TableHead>
                      <TableHead className="text-primary-foreground">Scheduling</TableHead>
                      <TableHead className="text-primary-foreground">Duration</TableHead>
                      <TableHead className="text-primary-foreground">Assigned To</TableHead>
                      <TableHead className="text-primary-foreground">Dependent Steps</TableHead>
                      <TableHead className="text-primary-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newTaskGroup.tasks.length > 0 ? (
                      newTaskGroup.tasks.map((task, index) => (
                        <TableRow key={task.id} className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.stepNumber || "-"}</TableCell>
                          <TableCell>
                            {task.startDateTime ? new Date(task.startDateTime).toLocaleString() : "-"}
                          </TableCell>
                          <TableCell>{task.assignToRole}</TableCell>
                          <TableCell>
                            {newTaskGroup.typeOfTG === "One-time" ? "One-time" : `Repetitive (${task.repeatPattern})`}
                          </TableCell>
                          <TableCell>{task.duration ? `${task.duration} hours` : "-"}</TableCell>
                          <TableCell>{task.assignTo || "-"}</TableCell>
                          <TableCell>
                            {task.dependentSteps && task.dependentSteps.length > 0
                              ? task.dependentSteps.map((step: number | string) => `Step ${step}`).join(", ")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTask(task.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No tasks added yet. Add tasks using the form above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTaskGroup}
              disabled={!newTaskGroup.name || !newTaskGroup.typeOfTG || !newTaskGroup.unit || !newTaskGroup.department}
              className="bg-primary hover:bg-primary/90"
            >
              Update Task Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
