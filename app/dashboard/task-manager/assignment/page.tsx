"use client"

import { useState } from "react"
import { Search, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Sample task groups data
const initialTaskGroups = [
  {
    id: "TG-001",
    name: "Audits",
    createdBy: "John",
    createdOn: "10/05/2025",
    type: "Repetitive",
    tgType: "Internal",
    taskCount: 10,
    unit: "All",
    status: "Planned",
    department: "Production",
  },
  {
    id: "TG-002",
    name: "Order Name",
    createdBy: "John",
    createdOn: "10/05/2025",
    type: "One-time",
    tgType: "External Order",
    taskCount: 20,
    unit: "M1",
    status: "Active",
    department: "Production",
  },
  {
    id: "TG-003",
    name: "Name",
    createdBy: "Mathew",
    createdOn: "10/05/2025",
    type: "One-time",
    tgType: "Internal Production",
    taskCount: 12,
    unit: "M2",
    status: "Active",
    department: "Production",
  },
  {
    id: "TG-004",
    name: "Maintenance",
    createdBy: "Roy",
    createdOn: "10/05/2025",
    type: "Repetitive",
    tgType: "Internal",
    taskCount: 1,
    unit: "All",
    status: "Planned",
    department: "All",
  },
  {
    id: "TG-005",
    name: "Adhoc Task",
    createdBy: "John",
    createdOn: "12/05/2025",
    type: "One-time",
    tgType: "Internal",
    taskCount: 5,
    unit: "M3",
    status: "Completed",
    department: "Quality",
  },
]

// Sample tasks data
const initialTasks = [
  {
    id: 1,
    name: "Audit",
    stepNumber: 1,
    dependentStep: "NA",
    role: "Auditor",
    assignTo: "John",
    scheduleType: "One-Time",
    duration: 60,
  },
  {
    id: 2,
    name: "Production Task",
    stepNumber: 2,
    dependentStep: "1",
    role: "Worker",
    assignTo: "Smith,John",
    scheduleType: "One-Time",
    duration: 180,
  },
  {
    id: 3,
    name: "Compliance Test",
    stepNumber: 2,
    dependentStep: "1",
    role: "Technician",
    assignTo: "Roger",
    scheduleType: "One-Time",
    duration: 60,
  },
]

// Sample tasks repository
const taskRepository = [
  { id: "T-001", name: "Audit of Inventory", type: "Audit", skill: "Auditor" },
  { id: "T-002", name: "Metal Cutting", type: "Cutting", skill: "Sheet Cutting" },
  { id: "T-003", name: "Product Packaging", type: "Packing", skill: "Packaging" },
  { id: "T-004", name: "Compliance Check", type: "Generic", skill: "Auditor" },
  { id: "T-005", name: "Product Quality Check", type: "Quality Check", skill: "Auditor" },
]

// Sample users by role
const usersByRole = {
  Auditor: ["John", "Emily", "Michael"],
  Worker: ["Smith", "John", "Sarah"],
  Technician: ["Roger", "David", "Anna"],
}

export default function TaskAssignmentPage() {
  const [taskGroups, setTaskGroups] = useState(initialTaskGroups)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTaskGroup, setSelectedTaskGroup] = useState<any>(null)
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState({
    name: "",
    stepNumber: "",
    dependentStep: "",
    role: "",
    assignTo: "",
    scheduleType: "One-Time",
    duration: "",
  })
  const [newTaskGroup, setNewTaskGroup] = useState({
    name: "",
    unit: "",
    department: "",
    scheduleType: "One-Time",
    startDate: new Date(),
  })

  // Filter task groups based on search term and status filter
  const filteredTaskGroups = taskGroups.filter((taskGroup) => {
    const matchesSearch = taskGroup.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || taskGroup.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle adding a new task to the task list
  const handleAddTask = () => {
    if (!newTask.name || !newTask.stepNumber || !newTask.role) return

    const newTaskObj = {
      id: tasks.length + 1,
      name: newTask.name,
      stepNumber: Number.parseInt(newTask.stepNumber),
      dependentStep: newTask.dependentStep || "NA",
      role: newTask.role,
      assignTo: newTask.assignTo,
      scheduleType: newTask.scheduleType,
      duration: Number.parseInt(newTask.duration) || 60,
    }

    setTasks([...tasks, newTaskObj])
    setNewTask({
      name: "",
      stepNumber: "",
      dependentStep: "",
      role: "",
      assignTo: "",
      scheduleType: "One-Time",
      duration: "",
    })
  }

  // Handle saving the task group
  const handleSaveTaskGroup = () => {
    if (!newTaskGroup.name || !newTaskGroup.unit || !newTaskGroup.department) return

    const newTaskGroupObj = {
      id: `TG-${String(taskGroups.length + 1).padStart(3, "0")}`,
      name: newTaskGroup.name,
      createdBy: "Current User",
      createdOn: format(new Date(), "MM/dd/yyyy"),
      type: newTaskGroup.scheduleType === "One-Time" ? "One-time" : "Repetitive",
      tgType: "Internal",
      taskCount: tasks.length,
      unit: newTaskGroup.unit,
      status: "Planned",
      department: newTaskGroup.department,
    }

    setTaskGroups([...taskGroups, newTaskGroupObj])
    setIsCreateDialogOpen(false)
    setTasks(initialTasks) // Reset tasks for next creation
    setNewTaskGroup({
      name: "",
      unit: "",
      department: "",
      scheduleType: "One-Time",
      startDate: new Date(),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Task Assignment</h1>
        <p className="text-muted-foreground">Task Group Creation & Assignment</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search task groups..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={(value) => setStatusFilter(value)} defaultValue="All">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task Group
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Groups</CardTitle>
          <CardDescription>Manage task groups and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>TG Name</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Type of TG</TableHead>
                  <TableHead>TG Type</TableHead>
                  <TableHead>No# of Task</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>TG Status</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTaskGroups.length > 0 ? (
                  filteredTaskGroups.map((taskGroup) => (
                    <TableRow key={taskGroup.id} className="cursor-pointer">
                      <TableCell className="font-medium">{taskGroup.id}</TableCell>
                      <TableCell>{taskGroup.name}</TableCell>
                      <TableCell>{taskGroup.createdBy}</TableCell>
                      <TableCell>{taskGroup.createdOn}</TableCell>
                      <TableCell>{taskGroup.type}</TableCell>
                      <TableCell>{taskGroup.tgType}</TableCell>
                      <TableCell>{taskGroup.taskCount}</TableCell>
                      <TableCell>{taskGroup.unit}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            taskGroup.status === "Active" && "bg-green-100 text-green-800",
                            taskGroup.status === "Planned" && "bg-blue-100 text-blue-800",
                            taskGroup.status === "Completed" && "bg-gray-100 text-gray-800",
                          )}
                        >
                          {taskGroup.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{taskGroup.department}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
                      No task groups found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>Create Task Group</DialogTitle>
            <DialogDescription>Create a new task group and assign tasks to it.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="task-group" className="space-y-4">
            <TabsList>
              <TabsTrigger value="task-group">Task Group</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="task-group">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Task Group Name</Label>
                  <Input
                    id="name"
                    placeholder="Task Group Name"
                    value={newTaskGroup.name}
                    onChange={(e) => setNewTaskGroup({ ...newTaskGroup, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="Unit"
                    value={newTaskGroup.unit}
                    onChange={(e) => setNewTaskGroup({ ...newTaskGroup, unit: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="Department"
                    value={newTaskGroup.department}
                    onChange={(e) => setNewTaskGroup({ ...newTaskGroup, department: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduleType">Schedule Type</Label>
                  <Select
                    onValueChange={(value) => setNewTaskGroup({ ...newTaskGroup, scheduleType: value })}
                    defaultValue="One-Time"
                  >
                    <SelectTrigger className="w-[100%]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-Time">One-Time</SelectItem>
                      <SelectItem value="Repetitive">Repetitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] justify-start text-left font-normal",
                          !newTaskGroup.startDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newTaskGroup.startDate ? format(newTaskGroup.startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newTaskGroup.startDate || undefined}
                        onSelect={(date: Date | undefined) => {
                          if (date) {
                            setNewTaskGroup({ ...newTaskGroup, startDate: date });
                          }
                        }}
                        disabled={(date) => {
                          if (!date) return false;
                          return date < new Date();
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tasks">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Task Name</Label>
                  <Input
                    id="name"
                    placeholder="Task Name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="stepNumber">Step Number</Label>
                  <Input
                    id="stepNumber"
                    placeholder="Step Number"
                    value={newTask.stepNumber}
                    onChange={(e) => setNewTask({ ...newTask, stepNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dependentStep">Dependent Step</Label>
                  <Input
                    id="dependentStep"
                    placeholder="Dependent Step"
                    value={newTask.dependentStep}
                    onChange={(e) => setNewTask({ ...newTask, dependentStep: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    onValueChange={(value) => setNewTask({ ...newTask, role: value })}
                    defaultValue={newTask.role}
                  >
                    <SelectTrigger className="w-[100%]">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(usersByRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignTo">Assign To</Label>
                  <Select
                    onValueChange={(value) => setNewTask({ ...newTask, assignTo: value })}
                    defaultValue={newTask.assignTo}
                  >
                    <SelectTrigger className="w-[100%]">
                      <SelectValue placeholder="Assign To" />
                    </SelectTrigger>
                    <SelectContent>
                      {newTask.role && (usersByRole as Record<string, string[]>)[newTask.role] ? (
                        (usersByRole as Record<string, string[]>)[newTask.role].map((user: string) => (
                          <SelectItem key={user} value={user}>
                            {user}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          Select a role first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduleType">Schedule Type</Label>
                  <Select
                    onValueChange={(value) => setNewTask({ ...newTask, scheduleType: value })}
                    defaultValue="One-Time"
                  >
                    <SelectTrigger className="w-[100%]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-Time">One-Time</SelectItem>
                      <SelectItem value="Repetitive">Repetitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Duration"
                    value={newTask.duration}
                    onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                  />
                </div>
                <div>
                  <Button onClick={handleAddTask}>Add Task</Button>
                </div>
              </div>

              {tasks.length > 0 && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task ID</TableHead>
                        <TableHead>Task Name</TableHead>
                        <TableHead>Step #</TableHead>
                        <TableHead>Dependent Step</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Assign To</TableHead>
                        <TableHead>Schedule Type</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.id}</TableCell>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.stepNumber}</TableCell>
                          <TableCell>{task.dependentStep}</TableCell>
                          <TableCell>{task.role}</TableCell>
                          <TableCell>{task.assignTo}</TableCell>
                          <TableCell>{task.scheduleType}</TableCell>
                          <TableCell>{task.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="submit" onClick={handleSaveTaskGroup}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
