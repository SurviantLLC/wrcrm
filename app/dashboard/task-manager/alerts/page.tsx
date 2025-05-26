"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { PageHeader } from "@/components/dashboard/page-header"

// Define interfaces for type safety
interface Alert {
  id: string;
  raisedBy: string;
  raisedOn: string;
  description: string;
  sourceProject: string;
  sourceTaskName: string;
  alertStatus: string;
  assignedTo: string;
  assignedTaskName: string;
  assignedTaskStatus: string;
  resolutionComments: string;
}

interface ContextMenu {
  visible: boolean;
  x: number;
  y: number;
  alertId: string;
}

interface FormData {
  taskType: string;
  selectTask: string;
  assignTo: string;
  assignDate: string;
  assignTime: string;
  sourceProjectName: string;
  sourceTaskName: string;
}

interface Task {
  id: string;
  name: string;
  stepNumber: string;
  assignToRole: string;
  schedulingType: string;
  repeatPattern: string;
  duration: string;
  assignTo: string;
}

interface Project {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  typeOfProject: string;
  projectType: string;
  numberOfTasks: string;
  unit: string;
  status: string;
  department: string;
  startDateTime: string;
  description: string;
  tasks: Task[];
}

// Mock data for task alerts
const taskAlerts: Alert[] = [
  {
    id: "AL-001",
    raisedBy: "John",
    raisedOn: "10/02/2025 09:00 hrs",
    description: "Machine Failure",
    sourceProject: "Production",
    sourceTaskName: "Packing",
    alertStatus: "Not Assigned",
    assignedTo: "",
    assignedTaskName: "",
    assignedTaskStatus: "",
    resolutionComments: "",
  },
  {
    id: "AL-002",
    raisedBy: "Matt",
    raisedOn: "09/02/2025 13:00 hrs",
    description: "SKU Shortage",
    sourceProject: "Maintenance",
    sourceTaskName: "Oil Change",
    alertStatus: "Assigned",
    assignedTo: "Tom",
    assignedTaskName: "Inventory Fulfillment",
    assignedTaskStatus: "In-Progress",
    resolutionComments: "",
  },
  {
    id: "AL-003",
    raisedBy: "Soy",
    raisedOn: "07/02/2025 13:00 hrs",
    description: "Audit form not assigned",
    sourceProject: "Weekly Audit and Maintenance",
    sourceTaskName: "Audit Machine Quality",
    alertStatus: "Closed",
    assignedTo: "Support",
    assignedTaskName: "Software Issue",
    assignedTaskStatus: "Closed",
    resolutionComments: "Form made available",
  },
]

// Mock data for dropdowns
const taskTypes: string[] = ["Maintenance", "Inventory", "Quality Check", "Software", "Hardware"]
const assignees: string[] = ["Tom", "Sarah", "Mike", "Emma", "Support"]
const tasks: string[] = ["Inventory Fulfillment", "Machine Repair", "Software Issue", "Quality Inspection"]
const projects: string[] = ["Production", "Maintenance", "Weekly Audit and Maintenance", "Inventory"]
const departments: string[] = ["Production", "Quality", "Maintenance", "Logistics", "Administration"]
const units: string[] = ["All", "M1", "M2", "Assembly Unit A", "Assembly Unit B", "Woodworking Unit", "Finishing Unit"]

// Helper function for status badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Not Assigned":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          {status}
        </Badge>
      )
    case "Assigned":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          {status}
        </Badge>
      )
    case "Closed":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          {status}
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function TaskAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(taskAlerts)
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ visible: false, x: 0, y: 0, alertId: "" })
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [ticketCreated, setTicketCreated] = useState(false)
  const [createdProject, setCreatedProject] = useState<Project | null>(null)
  const initialFormData: FormData = {
    taskType: "",
    selectTask: "",
    assignTo: "",
    assignDate: "",
    assignTime: "",
    sourceProjectName: "",
    sourceTaskName: "",
  }
  const [formData, setFormData] = useState(initialFormData)

  const totalAlerts = alerts.length
  const openAlerts = alerts.filter((alert) => alert.alertStatus !== "Closed").length
  const closedAlerts = alerts.filter((alert) => alert.alertStatus === "Closed").length
  const unassignedAlerts = alerts.filter((alert) => alert.alertStatus === "Not Assigned").length
  const assignedAlerts = alerts.filter((alert) => alert.alertStatus === "Assigned").length

  const handleContextMenu = (e: React.MouseEvent, alertId: string) => {
    e.preventDefault()
    const alert = alerts.find((a) => a.id === alertId)
    if (!alert || alert.alertStatus === "Closed") return // Don't show context menu for closed alerts

    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      alertId,
    })
  }

  const handleAssignTicket = () => {
    const alert = alerts.find((a) => a.id === contextMenu.alertId)
    if (alert) {
      setSelectedAlert(alert)
      setFormData({
        ...formData,
        sourceProjectName: alert.sourceProject,
        sourceTaskName: alert.sourceTaskName,
      })
    }
    setContextMenu({ visible: false, x: 0, y: 0, alertId: "" })
    setAssignDialogOpen(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleCreateTicket = (e: React.FormEvent) => {
    if (
      !formData.taskType ||
      !formData.selectTask ||
      !formData.assignTo ||
      !formData.assignDate ||
      !formData.assignTime
    ) {
      // Show validation error
      return
    }

    // Create a new project with the name format: Source Project Name_AlertID
    const today = format(new Date(), "dd/MM/yyyy")
    const projectName = `${formData.sourceProjectName}_${selectedAlert?.id}`

    const newProject = {
      id: `TG-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      name: projectName,
      createdBy: "Current User", // This would come from auth context in a real app
      createdOn: today,
      typeOfProject: "One-time",
      projectType: "Maintenance",
      numberOfTasks: "1",
      unit: "All", // Default value, could be changed
      status: "Planned",
      department: "Production", // Default value, could be changed
      startDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      description: `Project created from alert: ${selectedAlert?.description}`,
      tasks: [
        {
          id: `T-${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`,
          name: formData.selectTask,
          stepNumber: "1",
          assignToRole: formData.taskType,
          schedulingType: "one-time",
          repeatPattern: "",
          duration: "4", // Default value
          assignTo: formData.assignTo,
        },
      ],
    }

    // Update the alert status
    const updatedAlerts = alerts.map((alert) => {
      if (alert.id === selectedAlert?.id) {
        return {
          ...alert,
          alertStatus: "Assigned",
          assignedTo: formData.assignTo,
          assignedTaskName: formData.selectTask,
          assignedTaskStatus: "In-Progress",
        }
      }
      return alert
    })

    setAlerts(updatedAlerts)
    setTicketCreated(true)
    setAssignDialogOpen(false)

    // Auto-hide the notification after 5 seconds
    setTimeout(() => {
      setTicketCreated(false)
    }, 5000)
  }

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, alertId: "" })
  }

  // Close context menu when clicking outside
  const handleDocumentClick = (e: React.MouseEvent) => {
    if (contextMenu.visible) {
      handleCloseContextMenu()
    }
  }

  

  return (
    <div className="space-y-4" onClick={handleDocumentClick}>
      <div className="flex justify-between items-center">
        <PageHeader title="Task Alert" description="" icon={AlertTriangle} />
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary text-primary-foreground">
            Total: {totalAlerts}
          </Badge>
          <Badge variant="outline" className="bg-yellow-500 text-white">
            Open: {openAlerts}
          </Badge>
          <Badge variant="outline" className="bg-green-500 text-white">
            Closed: {closedAlerts}
          </Badge>
        </div>
      </div>

      {/* Ticket Created Notification */}
      {ticketCreated && createdProject && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Ticket Created</AlertTitle>
          <AlertDescription className="text-green-700">
            Project &quot;{createdProject.name}&quot; has been created successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Task Status Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({totalAlerts})</TabsTrigger>
          <TabsTrigger value="unassigned">Not Assigned ({unassignedAlerts})</TabsTrigger>
          <TabsTrigger value="assigned">Assigned ({assignedAlerts})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedAlerts})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <AlertsTable alerts={alerts} onContextMenu={handleContextMenu} />
        </TabsContent>

        <TabsContent value="unassigned" className="mt-4">
          <AlertsTable
            alerts={alerts.filter((alert) => alert.alertStatus === "Not Assigned")}
            onContextMenu={handleContextMenu}
          />
        </TabsContent>

        <TabsContent value="assigned" className="mt-4">
          <AlertsTable
            alerts={alerts.filter((alert) => alert.alertStatus === "Assigned")}
            onContextMenu={handleContextMenu}
          />
        </TabsContent>

        <TabsContent value="closed" className="mt-4">
          <AlertsTable
            alerts={alerts.filter((alert) => alert.alertStatus === "Closed")}
            onContextMenu={handleContextMenu}
          />
        </TabsContent>
      </Tabs>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 min-w-[180px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <div className="px-2">
            <button
              className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 rounded-md transition-all duration-200 flex items-center gap-3 group"
              onClick={handleAssignTicket}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Assign Ticket</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Create task to resolve alert</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Assign Ticket Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Assign Ticket</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alertId" className="text-slate-700 dark:text-slate-300 font-medium">
                  Alert ID*
                </Label>
                <Input
                  id="alertId"
                  value={selectedAlert?.id || ""}
                  readOnly
                  className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertDescription" className="text-slate-700 dark:text-slate-300 font-medium">
                  Alert Description
                </Label>
                <Textarea
                  id="alertDescription"
                  value={selectedAlert?.description || ""}
                  readOnly
                  className="h-24 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sourceProjectName" className="text-slate-700 dark:text-slate-300 font-medium">
                  Source Project Name
                </Label>
                <Select
                  value={formData.sourceProjectName}
                  onValueChange={(value) => handleInputChange("sourceProjectName", value)}
                >
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Select Multiple Role Drop Down" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((group: string) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceTaskName" className="text-slate-700 dark:text-slate-300 font-medium">
                  Source Task Name
                </Label>
                <Select
                  value={formData.sourceTaskName}
                  onValueChange={(value) => handleInputChange("sourceTaskName", value)}
                >
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Select Multiple Role Drop Down" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task: string) => (
                      <SelectItem key={task} value={task}>
                        {task}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border border-blue-500 rounded-md p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taskType" className="text-slate-700 dark:text-slate-300 font-medium">
                    Task Type*
                  </Label>
                  <Select value={formData.taskType} onValueChange={(value) => handleInputChange("taskType", value)}>
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600">
                      <SelectValue placeholder="Select Task Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((type: string) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selectTask" className="text-slate-700 dark:text-slate-300 font-medium">
                    Select Task*
                  </Label>
                  <Select value={formData.selectTask} onValueChange={(value) => handleInputChange("selectTask", value)}>
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600">
                      <SelectValue placeholder="Select Task" />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.filter((task: string) => !task.includes("new")).map((task: string) => (
                        <SelectItem key={task} value={task}>
                          {task}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assignTo" className="text-slate-700 dark:text-slate-300 font-medium">
                    Assign To*
                  </Label>
                  <Select value={formData.assignTo} onValueChange={(value) => handleInputChange("assignTo", value)}>
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600">
                      <SelectValue placeholder="Select Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee: string) => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignDate" className="text-slate-700 dark:text-slate-300 font-medium">
                    Assign Date*
                  </Label>
                  <Input
                    id="assignDate"
                    type="date"
                    value={formData.assignDate}
                    onChange={(e) => handleInputChange("assignDate", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignTime" className="text-slate-700 dark:text-slate-300 font-medium">
                    Assign Time*
                  </Label>
                  <Input
                    id="assignTime"
                    type="time"
                    value={formData.assignTime}
                    onChange={(e) => handleInputChange("assignTime", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCreateTicket}
                disabled={
                  !formData.taskType ||
                  !formData.selectTask ||
                  !formData.assignTo ||
                  !formData.assignDate ||
                  !formData.assignTime
                }
              >
                Create Project Ticket
              </Button>
              <Button
                variant="secondary"
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                onClick={() => setAssignDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// AlertsTable component to display alert data
function AlertsTable({ alerts, onContextMenu }: { alerts: Alert[], onContextMenu: (e: React.MouseEvent, alertId: string) => void }) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-gray-800 text-white">
          <TableRow className="hover:bg-gray-800">
            <TableHead className="text-white font-semibold">Alert ID</TableHead>
            <TableHead className="text-white font-semibold">Raised By</TableHead>
            <TableHead className="text-white font-semibold">Raised On (Date & Time)</TableHead>
            <TableHead className="text-white font-semibold">Description</TableHead>
            <TableHead className="text-white font-semibold">Source Project</TableHead>
            <TableHead className="text-white font-semibold">Source Task Name</TableHead>
            <TableHead className="text-white font-semibold">Alert Status</TableHead>
            <TableHead className="text-white font-semibold">Assigned To</TableHead>
            <TableHead className="text-white font-semibold">Assigned Task Name</TableHead>
            <TableHead className="text-white font-semibold">Assigned Task Status</TableHead>
            <TableHead className="text-white font-semibold">Resolution Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id} onContextMenu={(e) => onContextMenu(e, alert.id)}>
              <TableCell>{alert.id}</TableCell>
              <TableCell>{alert.raisedBy}</TableCell>
              <TableCell>{alert.raisedOn}</TableCell>
              <TableCell>{alert.description}</TableCell>
              <TableCell>{alert.sourceProject}</TableCell>
              <TableCell>{alert.sourceTaskName}</TableCell>
              <TableCell>
                {getStatusBadge(alert.alertStatus as string)}
              </TableCell>
              <TableCell>{alert.assignedTo}</TableCell>
              <TableCell>{alert.assignedTaskName}</TableCell>
              <TableCell>
                {alert.assignedTaskStatus && (
                  <Badge
                    variant="outline"
                    className={`
                      ${alert.assignedTaskStatus === "In-Progress" ? "bg-blue-100 text-blue-800 border-blue-300" : ""}
                      ${alert.assignedTaskStatus === "Closed" ? "bg-green-100 text-green-800 border-green-300" : ""}
                    `}
                  >
                    {alert.assignedTaskStatus}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{alert.resolutionComments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
