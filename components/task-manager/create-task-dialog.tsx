"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ensureNonEmptyValue } from "@/lib/utils"

// Define types for task data
interface TaskType {
  id: string
  name: string
  description?: string
}

interface TaskGroupType {
  id: string
  name: string
  description?: string
}

interface TaskGroupSchedule {
  id: string
  name: string
  description?: string
}

interface TaskData {
  id?: string
  name: string
  description: string
  priority: string
  startDate?: string | Date
  endDate?: string | Date
  unit?: string
  scheduleType?: string
  tasks?: {
    id: number
    step: string
    skill: string
    duration: string
    startDate: string
    endDate: string
  }[]
  [key: string]: string | number | boolean | Date | object | null | undefined // Allow specific types for additional fields
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (taskData: TaskData) => void
  taskTypes?: TaskType[]
  tgTypes?: TaskGroupType[]
  tgSchedules?: TaskGroupSchedule[]
}

export function CreateTaskDialog({ open, onOpenChange, onSave, taskTypes = [], tgTypes = [], tgSchedules = [] }: CreateTaskDialogProps) {
  const [taskGroupData, setTaskGroupData] = useState({
    id: `TG-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
    name: "",
    unit: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    scheduleType: "one-time",
  })

  const [tasks, setTasks] = useState<
    Array<{
      id: number
      step: string
      skill: string
      duration: string
      startDate: string
      endDate: string
    }>
  >([])

  const [nextTaskId, setNextTaskId] = useState(1)

  // Sample units for dropdown
  const units = [
    "Assembly Unit A",
    "Assembly Unit B",
    "Woodworking Unit",
    "Finishing Unit",
    "Mechanical Unit",
    "Quality Control Unit",
  ]

  // Sample skills for dropdown
  const skills = ["Assembly", "Woodworking", "Finishing", "Upholstery", "Mechanical", "Electrical", "Quality Control"]

  const handleAddTask = () => {
    const newTask = {
      id: nextTaskId,
      step: `Step ${nextTaskId}`,
      skill: "",
      duration: "",
      startDate: taskGroupData.startDate, // Default to task group start date
      endDate: "",
    }
    setTasks([...tasks, newTask])
    setNextTaskId(nextTaskId + 1)
  }

  const handleRemoveTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleTaskChange = (id: number, field: string, value: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)))
  }

  const handleSave = () => {
    const taskGroupWithTasks = {
      ...taskGroupData,
      tasks,
    }
    onSave(taskGroupWithTasks)
    resetForm()
  }

  const resetForm = () => {
    setTaskGroupData({
      id: `TG-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      name: "",
      unit: "",
      description: "",
      startDate: "",
      endDate: "",
      priority: "Medium",
      scheduleType: "one-time",
    })
    setTasks([])
    setNextTaskId(1)
  }

  const validateTaskDates = (taskStartDate: string, taskGroupStartDate: string) => {
    if (!taskStartDate || !taskGroupStartDate) return true
    return new Date(taskStartDate) >= new Date(taskGroupStartDate)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Task Group</DialogTitle>
          <DialogDescription>Create a new task group and add individual tasks to it.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="task-group-id">Task Group ID</Label>
              <Input id="task-group-id" value={taskGroupData.id} disabled className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-group-name">Task Group Name*</Label>
              <Input
                id="task-group-name"
                value={taskGroupData.name}
                onChange={(e) => setTaskGroupData({ ...taskGroupData, name: e.target.value })}
                placeholder="Enter task group name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit*</Label>
              <Select
                value={ensureNonEmptyValue(taskGroupData.unit)}
                onValueChange={(value) =>
                  setTaskGroupData({ ...taskGroupData, unit: value === "unassigned" ? "" : value })
                }
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Select unit</SelectItem>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={taskGroupData.priority}
                onValueChange={(value) => setTaskGroupData({ ...taskGroupData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              value={taskGroupData.description}
              onChange={(e) => setTaskGroupData({ ...taskGroupData, description: e.target.value })}
              placeholder="Enter task group description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date*</Label>
              <Input
                id="start-date"
                type="date"
                value={taskGroupData.startDate}
                onChange={(e) => setTaskGroupData({ ...taskGroupData, startDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date*</Label>
              <Input
                id="end-date"
                type="date"
                value={taskGroupData.endDate}
                onChange={(e) => setTaskGroupData({ ...taskGroupData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Schedule Type</Label>
            <RadioGroup
              value={taskGroupData.scheduleType}
              onValueChange={(value) => setTaskGroupData({ ...taskGroupData, scheduleType: value })}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time">One-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="n-times" id="n-times" />
                <Label htmlFor="n-times">N-times (same schedule)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Tasks</h3>
              <Button onClick={handleAddTask} size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>

            {tasks.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Step</TableHead>
                      <TableHead>Required Skill</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <Input
                            value={task.step}
                            onChange={(e) => handleTaskChange(task.id, "step", e.target.value)}
                            placeholder="Enter step name"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={ensureNonEmptyValue(task.skill)}
                            onValueChange={(value) =>
                              handleTaskChange(task.id, "skill", value === "unassigned" ? "" : value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select skill" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Select skill</SelectItem>
                              {skills.map((skill) => (
                                <SelectItem key={skill} value={skill}>
                                  {skill}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={task.duration}
                            onChange={(e) => handleTaskChange(task.id, "duration", e.target.value)}
                            placeholder="e.g., 2 hours"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={task.startDate}
                            onChange={(e) => handleTaskChange(task.id, "startDate", e.target.value)}
                            className={
                              !validateTaskDates(task.startDate, taskGroupData.startDate) ? "border-red-500" : ""
                            }
                          />
                          {!validateTaskDates(task.startDate, taskGroupData.startDate) && (
                            <p className="text-xs text-red-500 mt-1">Must be ≥ task group start date</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={task.endDate}
                            onChange={(e) => handleTaskChange(task.id, "endDate", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveTask(task.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md bg-muted/50">
                <p className="text-muted-foreground">
                  No tasks added yet. Click &quot;Add Task&quot; to add tasks to this group.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !taskGroupData.name ||
              !taskGroupData.unit ||
              !taskGroupData.startDate ||
              !taskGroupData.endDate ||
              tasks.length === 0
            }
          >
            Create Task Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
