"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Plus, Search, Edit, Trash, Copy, Eye, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/dashboard/page-header"
import { rolesData } from "@/lib/roles-data"

// Permission types
const permissionTypes = [
  { id: "create", name: "Create" },
  { id: "read", name: "Read" },
  { id: "update", name: "Update" },
  { id: "delete", name: "Delete" },
]

// Context menu position type
type ContextMenuPosition = {
  x: number
  y: number
  visible: boolean
  roleId: number | null
}

// Define the structure of permissions for each module
type PermissionType = "create" | "read" | "update" | "delete";

// Define the exact structure of permissions as used in the rolesData
type RolePermissions = {
  [moduleId: string]: {
    [screenId: string]: {
      [permissionType in PermissionType]?: boolean
    }
  }
}

// Define the role structure
type Role = {
  id: number
  name: string
  description: string
  createdDate: string
  createdBy: string
  updatedDate: string
  updatedBy: string
  permissions: RolePermissions
}

// System modules and screens for permissions - updated to match sidebar exactly
const systemModules = [
  {
    id: "admin",
    name: "Admin Panel",
    screens: [
      { id: "roles", name: "Role Management" },
      { id: "users", name: "User Management" },
      { id: "reference-data", name: "Reference Data Management" },
      { id: "settings", name: "System Settings" },
    ],
  },
  {
    id: "product-management",
    name: "Product Management",
    screens: [
      { id: "products", name: "Product Definition" },
      { id: "manufacturing", name: "Manufacturing Process" },
      { id: "specifications", name: "Product Specifications" },
      { id: "analytics", name: "Product Analytics" },
    ],
  },
  {
    id: "task-management",
    name: "Task Management",
    screens: [
      { id: "alerts", name: "Task Alerts Management" },
      { id: "repository", name: "Task Repository" },
      { id: "assignments", name: "Task Assignment" },
      { id: "dashboards", name: "Task Dashboard" },
      { id: "performance-analytics", name: "Performance Analytics" },
    ],
  },
  {
    id: "inventory-management",
    name: "Inventory Management",
    screens: [
      { id: "skus", name: "SKU Management" },
      { id: "wastage", name: "Wastage Tracking" },
      { id: "procurement", name: "Procurement" },
      { id: "analytics", name: "Inventory Analytics" },
    ],
  },
  {
    id: "asset-management",
    name: "Asset Management",
    screens: [
      { id: "assets", name: "Asset Management" },
      { id: "dashboard", name: "Asset Dashboard" },
    ],
  },
  {
    id: "audit-management",
    name: "Audit Management",
    screens: [
      { id: "forms", name: "Audit Form Management" },
      { id: "reports", name: "Audit Report" },
    ],
  },
]

export default function RoleManagementPage() {
  // Type assertion to ensure rolesData matches our Role type definition
  const [roles, setRoles] = useState<Role[]>(rolesData as Role[])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition>({
    x: 0,
    y: 0,
    visible: false,
    roleId: null,
  })
  const [permissions, setPermissions] = useState<RolePermissions>({})
  const [editMode, setEditMode] = useState(false)
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null)

  // Refs
  const contextMenuRef = useRef<HTMLDivElement>(null)

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle row click for view details
  const handleViewDetails = (role: Role) => {
    setSelectedRole(role)
    setIsDetailsDialogOpen(true)
  }

  // Handle right click on row
  const handleContextMenu = (e: React.MouseEvent, roleId: number) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      roleId,
    })
  }

  // Open edit dialog and populate form
  const openEditDialog = (role: Role) => {
    setSelectedRole(role)
    setEditMode(true)
    setRoleName(role.name)
    setRoleDescription(role.description)
    setPermissions(role.permissions)
    setIsEditDialogOpen(true)

    // Close context menu if open
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false })
    }
  }

  // Handle adding a new role
  const handleAddRole = () => {
    if (!roleName) return

    const newRole: Role = {
      id: roles.length + 1,
      name: roleName,
      description: roleDescription,
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      createdBy: "Current User", // In a real app, this would be the logged-in user
      updatedDate: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      updatedBy: "Current User",
      permissions,
    }

    setRoles([...roles, newRole])
    setIsAddDialogOpen(false)
    resetForm()
  }

  // Handle updating a role
  const handleUpdateRole = () => {
    if (!selectedRole) return

    const updatedRoles = roles.map((role) => {
      if (role.id === selectedRole.id) {
        return {
          ...role,
          name: roleName,
          description: roleDescription,
          updatedDate: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
          updatedBy: "Current User",
          permissions,
        } as Role
      }
      return role
    })

    setRoles(updatedRoles)
    setIsEditDialogOpen(false)
    resetForm()
  }

  // Reset form fields
  const resetForm = () => {
    setRoleName("")
    setRoleDescription("")
    setPermissions({})
    setEditMode(false)
    setSelectedRole(null)
  }

  // Handle permission change
  const handlePermissionChange = (moduleId: string, screenId: string, permissionId: string, checked: boolean) => {
    setPermissions((prev) => {
      const newPermissions = { ...prev }
      if (!newPermissions[moduleId]) {
        newPermissions[moduleId] = {}
      }
      if (!newPermissions[moduleId][screenId]) {
        newPermissions[moduleId][screenId] = {}
      }
      // Type assertion to ensure TypeScript knows this is a valid permission type
      newPermissions[moduleId][screenId][permissionId as PermissionType] = checked
      return newPermissions
    })
  }

  // Handle edit role from context menu
  const handleEditRole = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId)
    if (role) {
      openEditDialog(role)
    }
  }

  // Handle delete role - show confirmation dialog
  const handleDeleteRole = (roleId: number) => {
    setRoleToDelete(roleId)
    setIsDeleteDialogOpen(true)
    setContextMenu({ ...contextMenu, visible: false })
  }

  // Confirm delete role
  const confirmDeleteRole = () => {
    if (roleToDelete) {
      setRoles(roles.filter((role) => role.id !== roleToDelete))
      if (isDetailsDialogOpen) {
        setIsDetailsDialogOpen(false)
      }
    }
    setIsDeleteDialogOpen(false)
    setRoleToDelete(null)
  }

  // Handle clone role
  const handleCloneRole = (roleId: number) => {
    const roleToClone = roles.find((r) => r.id === roleId)
    if (roleToClone) {
      const newRole = {
        ...roleToClone,
        id: roles.length + 1,
        name: `${roleToClone.name} (Copy)`,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
        createdBy: "Current User",
        updatedDate: new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          year: "numeric",
        }),
        updatedBy: "Current User",
      }
      setRoles([...roles, newRole])
    }
    setContextMenu({ ...contextMenu, visible: false })
  }

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ ...contextMenu, visible: false })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [contextMenu])

  // Reset form when add dialog opens
  useEffect(() => {
    if (isAddDialogOpen) {
      resetForm()
    }
  }, [isAddDialogOpen])

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Role Management" description="Create and manage system roles" icon={Shield} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>System Roles</CardTitle>
            <CardDescription>Manage roles in the system</CardDescription>
          </div>
          <Button className="flex items-center gap-1" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Add New Role</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Created By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <TableRow
                        key={role.id}
                        onContextMenu={(e) => handleContextMenu(e, role.id)}
                        onDoubleClick={() => handleViewDetails(role)}
                        className="cursor-pointer hover:bg-muted transition-colors"
                      >
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.createdDate}</TableCell>
                        <TableCell>{role.createdBy}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No roles found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="absolute z-50 min-w-[160px] bg-gray-900 rounded-md shadow-md border border-gray-700"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center gap-2"
              onClick={() => {
                const role = roles.find((r) => r.id === contextMenu.roleId)
                if (role) handleViewDetails(role)
              }}
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center gap-2"
              onClick={() => handleEditRole(contextMenu.roleId!)}
            >
              <Edit className="h-4 w-4" />
              Edit Role
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center gap-2"
              onClick={() => handleCloneRole(contextMenu.roleId!)}
            >
              <Copy className="h-4 w-4" />
              Clone Role
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
              onClick={() => handleDeleteRole(contextMenu.roleId!)}
            >
              <Trash className="h-4 w-4" />
              Delete Role
            </button>
          </div>
        </div>
      )}

      {/* Role Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle>{selectedRole?.name} - Role Details</DialogTitle>
            <DialogDescription>View role details and permissions</DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm">Role Name</h4>
                  <p className="text-base font-medium">{selectedRole.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Created Date</h4>
                  <p className="text-sm">{selectedRole.createdDate}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Created By</h4>
                  <p className="text-sm">{selectedRole.createdBy}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Updated Date</h4>
                  <p className="text-sm">{selectedRole.updatedDate}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Updated By</h4>
                  <p className="text-sm">{selectedRole.updatedBy}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Role Access Matrix</h3>

                {Object.entries(selectedRole.permissions || {}).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(selectedRole.permissions || {}).map(([moduleId, screens]) => {
                      const module = systemModules.find((m) => m.id === moduleId)
                      if (!module) return null

                      return (
                        <div key={moduleId} className="space-y-2">
                          <h4 className="font-medium">{module.name}</h4>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Screen Name</TableHead>
                                  <TableHead>Create</TableHead>
                                  <TableHead>Read</TableHead>
                                  <TableHead>Update</TableHead>
                                  <TableHead>Delete</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(screens).map(([screenId, perms]) => {
                                  const screen = module.screens.find((s) => s.id === screenId)
                                  if (!screen) return null

                                  // Type assertion to fix 'perms is of type unknown' error
                                  const permObj = perms as { 
                                    create?: boolean, 
                                    read?: boolean, 
                                    update?: boolean, 
                                    delete?: boolean 
                                  }

                                  return (
                                    <TableRow key={screenId}>
                                      <TableCell>{screen.name}</TableCell>
                                      <TableCell>{permObj.create ? "✓" : "✗"}</TableCell>
                                      <TableCell>{permObj.read ? "✓" : "✗"}</TableCell>
                                      <TableCell>{permObj.update ? "✓" : "✗"}</TableCell>
                                      <TableCell>{permObj.delete ? "✓" : "✗"}</TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No permissions assigned to this role.</p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailsDialogOpen(false)
                    openEditDialog(selectedRole)
                  }}
                >
                  Edit Role
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Role Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (isAddDialogOpen) setIsAddDialogOpen(open)
          if (isEditDialogOpen) setIsEditDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Role" : "Add New Role"}</DialogTitle>
            <DialogDescription>
              {editMode ? "Update role details and permissions" : "Create a new role in the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name*</Label>
                <Input
                  id="name"
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  disabled={editMode} // Disable name field in edit mode as it's the primary key
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter role description"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Assign Screen Access</h3>
              <p className="text-sm text-muted-foreground">Select the permissions for each module and screen</p>

              <div className="space-y-6">
                {systemModules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <h4 className="font-medium">{module.name}</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Screen Name</TableHead>
                            {permissionTypes.map((permission) => (
                              <TableHead key={permission.id}>{permission.name}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {module.screens.map((screen) => (
                            <TableRow key={screen.id}>
                              <TableCell>{screen.name}</TableCell>
                              {permissionTypes.map((permission) => (
                                <TableCell key={permission.id}>
                                  <Checkbox
                                    checked={permissions[module.id]?.[screen.id]?.[permission.id as PermissionType] || false}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(module.id, screen.id, permission.id, checked === true)
                                    }
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (isAddDialogOpen) setIsAddDialogOpen(false)
                  if (isEditDialogOpen) setIsEditDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={editMode ? handleUpdateRole : handleAddRole} disabled={!roleName}>
                {editMode ? "Save" : "Add Role"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone and may affect users assigned to
              this role.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setRoleToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRole}>
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
