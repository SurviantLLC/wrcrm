"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Clock, MapPin, Wifi, Users } from "lucide-react"
import { useReferenceData } from "@/contexts/reference-data-context"
import { PageHeader } from "@/components/dashboard/page-header"
import { usersData } from "@/lib/users-data"
import { rolesData } from "@/lib/roles-data"

// Add this function after the skillSets array and before the UsersPage component
const maskPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return ""
  // Keep the last 4 digits visible, mask the rest
  const visibleDigits = phoneNumber.slice(-4)
  const maskedPart = phoneNumber.slice(0, -4).replace(/[0-9]/g, "*")
  return maskedPart + visibleDigits
}

export default function UsersPage() {
  const { units = [], departments = [], userTypes = [], skillSets = [] } = useReferenceData() || {}
  const [users, setUsers] = useState(usersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, userId: "" })
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    roles: [] as string[],
    mobile: "",
    maskMobile: false,
    ipBasedAccess: false,
    timeBasedAccess: false,
    geoLocationAccess: false,
    timeAccessStart: "09:00",
    timeAccessEnd: "17:00",
    units: [] as string[],
    departments: [] as string[],
    userType: "",
    skillSets: [] as string[],
    checkInTime: "09:00",
    checkOutTime: "17:00",
    emergencyContact: "",
    sameAsWorkTiming: false,
  })

  // Clear time and geo location access when Admin role is selected
  useEffect(() => {
    if (formData.roles[0] === "Admin") {
      handleInputChange("timeBasedAccess", false)
      handleInputChange("geoLocationAccess", false)
    }
  }, [formData.roles])

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const roleMatch = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
    return searchMatch && roleMatch
  })

  // Handle context menu
  const handleContextMenu = (e: any, userId: string) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      userId,
    })
  }

  // Handle view details
  const handleViewDetails = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setContextMenu({ ...contextMenu, visible: false })
      setIsViewDialogOpen(true)
    }
  }

  // Handle edit user
  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setFormData({
        username: user.name,
        fullName: user.fullName,
        email: user.email,
        roles: [user.role],
        mobile: user.mobile,
        maskMobile: user.maskMobile,
        ipBasedAccess: user.ipBasedAccess,
        timeBasedAccess: user.timeBasedAccess,
        geoLocationAccess: user.geoLocationAccess,
        timeAccessStart: user.workTiming?.checkIn || "09:00",
        timeAccessEnd: user.workTiming?.checkOut || "17:00",
        units: [user.unit],
        departments: [user.department],
        userType: user.userType,
        skillSets: Array.isArray(user.skillSet) ? user.skillSet : user.skillSet ? [user.skillSet] : [],
        checkInTime: user.workTiming?.checkIn || "09:00",
        checkOutTime: user.workTiming?.checkOut || "17:00",
        emergencyContact: user.emergencyContact,
        sameAsWorkTiming: false,
      })
      setContextMenu({ ...contextMenu, visible: false })
      setIsEditDialogOpen(true)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle adding a new user
  const handleAddUser = () => {
    // Validate required fields
    if (!formData.username || !formData.fullName || formData.roles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newUser = {
      id: String(users.length + 1),
      name: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.roles[0], // Just use the first role for display
      mobile: formData.mobile,
      maskMobile: formData.maskMobile,
      ipBasedAccess: formData.ipBasedAccess,
      timeBasedAccess: formData.timeBasedAccess,
      geoLocationAccess: formData.geoLocationAccess,
      unit: formData.units[0], // Just use the first unit for display
      department: formData.departments[0], // Just use the first department for display
      userType: formData.userType,
      skillSet: formData.skillSets,
      workTiming: {
        checkIn: formData.checkInTime,
        checkOut: formData.checkOutTime,
      },
      emergencyContact: formData.emergencyContact,
    }

    setUsers([...users, newUser])
    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "User Added",
      description: `User ${formData.username} has been added successfully.`,
    })
  }

  // Handle updating a user
  const handleUpdateUser = () => {
    if (!selectedUser) return

    // Validate required fields
    if (!formData.username || !formData.fullName || formData.roles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          role: formData.roles[0], // Just use the first role for display
          mobile: formData.mobile,
          maskMobile: formData.maskMobile,
          ipBasedAccess: formData.ipBasedAccess,
          timeBasedAccess: formData.timeBasedAccess,
          geoLocationAccess: formData.geoLocationAccess,
          unit: formData.units[0], // Just use the first unit for display
          department: formData.departments[0], // Just use the first department for display
          userType: formData.userType,
          skillSet: formData.skillSets,
          workTiming: {
            checkIn: formData.checkInTime,
            checkOut: formData.checkOutTime,
          },
          emergencyContact: formData.emergencyContact,
        }
      }
      return user
    })

    setUsers(updatedUsers)
    resetForm()
    setIsEditDialogOpen(false)

    toast({
      title: "User Updated",
      description: `User ${formData.username} has been updated successfully.`,
    })
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      username: "",
      fullName: "",
      email: "",
      roles: [],
      mobile: "",
      maskMobile: false,
      ipBasedAccess: false,
      timeBasedAccess: false,
      geoLocationAccess: false,
      timeAccessStart: "09:00",
      timeAccessEnd: "17:00",
      units: [],
      departments: [],
      userType: "",
      skillSets: [],
      checkInTime: "09:00",
      checkOutTime: "17:00",
      emergencyContact: "",
      sameAsWorkTiming: false,
    })
    setSelectedUser(null)
  }

  // Close context menu when clicking outside
  const handleDocumentClick = () => {
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false })
    }
  }

  // Function to render the user form (used in both Add and Edit dialogs)
  const renderUserForm = (isEditMode = false) => (
    <>
      <div className="grid grid-cols-2 gap-6 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">User Name*</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={isEditMode}
              readOnly={isEditMode}
              className={isEditMode ? "bg-gray-50 text-gray-700 cursor-not-allowed" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name*</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              disabled={isEditMode}
              readOnly={isEditMode}
              className={isEditMode ? "bg-gray-50 text-gray-700 cursor-not-allowed" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isEditMode}
              readOnly={isEditMode}
              className={isEditMode ? "bg-gray-50 text-gray-700 cursor-not-allowed" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role*</Label>
            <Select value={formData.roles[0]} onValueChange={(value) => handleInputChange("roles", [value])}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {rolesData.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              disabled={isEditMode}
              readOnly={isEditMode}
              className={isEditMode ? "bg-gray-50 text-gray-700 cursor-not-allowed" : ""}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="maskMobile"
              checked={formData.maskMobile}
              onCheckedChange={(checked) => handleInputChange("maskMobile", checked)}
            />
            <Label htmlFor="maskMobile">Mask Mobile Number</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit">Org Unit*</Label>
            <Select value={formData.units[0]} onValueChange={(value) => handleInputChange("units", [value])}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select Multiple Org Unit Drop Down" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(units) ? (
                  units.map((unit) => (
                    <SelectItem key={unit.Unit_ID} value={unit.Unit_Name}>
                      {unit.Unit_Name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading">Loading...</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department*</Label>
            <Select
              value={formData.departments[0]}
              onValueChange={(value) => handleInputChange("departments", [value])}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select Multiple Department Drop Down" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(departments) ? (
                  departments.map((dept) => (
                    <SelectItem key={dept.Department_ID} value={dept.Department_Name}>
                      {dept.Department_Name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading">Loading...</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">User Type*</Label>
            <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
              <SelectTrigger id="userType">
                <SelectValue placeholder="Executives/Manager/Technicians/Worker" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(userTypes) ? (
                  userTypes.map((type) => (
                    <SelectItem key={type.User_Type_ID} value={type.User_Type_Name}>
                      {type.User_Type_Name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading">Loading...</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Work Timing - appears right after User Type selection for Technician or Worker */}
          {(formData.userType === "Technicians" || formData.userType === "Worker") && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800 mt-2 mb-4">
              <h4 className="font-medium mb-3 text-slate-900 dark:text-slate-100">Work Timing</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInTime">Check In Time</Label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleInputChange("checkInTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOutTime">Check Out Time</Label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => handleInputChange("checkOutTime", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Only show skill set for Technician or Worker */}
          {(formData.userType === "Technicians" || formData.userType === "Worker") && (
            <div className="space-y-2">
              <Label htmlFor="skillSet">Skill Set*</Label>
              <Select
                onValueChange={(value) => {
                  const updatedSkills = [...formData.skillSets]
                  if (!updatedSkills.includes(value)) {
                    updatedSkills.push(value)
                    handleInputChange("skillSets", updatedSkills)
                  }
                }}
              >
                <SelectTrigger id="skillSet">
                  <SelectValue placeholder="Select Multiple Skill Sets from drop down" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(skillSets) ? (
                    skillSets.map((skill) => (
                      <SelectItem key={skill.Skill_Set_ID} value={skill.Skill_Set_Name}>
                        {skill.Skill_Set_Name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading">Loading...</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {formData.skillSets.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillSets.map((skill) => (
                    <Badge key={skill} variant="outline" className="flex items-center gap-1">
                      {skill}
                      <button
                        className="ml-1 text-xs"
                        onClick={() => {
                          const updatedSkills = formData.skillSets.filter((s) => s !== skill)
                          handleInputChange("skillSets", updatedSkills)
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Only show emergency contact for Technician or Worker */}
          {(formData.userType === "Technicians" || formData.userType === "Worker") && (
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact*</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Access Control</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ipBasedAccess"
                checked={formData.ipBasedAccess}
                onCheckedChange={(checked) => handleInputChange("ipBasedAccess", checked)}
              />
              <Label htmlFor="ipBasedAccess" className="flex items-center gap-1">
                <Wifi className="h-4 w-4" /> IP Based Access
              </Label>
            </div>
          </div>

          {/* Only show Time Based Access for non-Admin roles */}
          {formData.roles[0] !== "Admin" && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timeBasedAccess"
                  checked={formData.timeBasedAccess}
                  onCheckedChange={(checked) => handleInputChange("timeBasedAccess", checked)}
                />
                <Label htmlFor="timeBasedAccess" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Time Based Access
                </Label>
              </div>
              {formData.timeBasedAccess && (
                <div className="space-y-3 mt-3">
                  {/* Radio button asking if time access should be same as work timing */}
                  {(formData.userType === "Technicians" || formData.userType === "Worker") && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="sameAsWorkTiming"
                        checked={formData.sameAsWorkTiming}
                        onCheckedChange={(checked) => {
                          handleInputChange("sameAsWorkTiming", checked)
                          if (checked) {
                            handleInputChange("timeAccessStart", formData.checkInTime)
                            handleInputChange("timeAccessEnd", formData.checkOutTime)
                          }
                        }}
                      />
                      <Label htmlFor="sameAsWorkTiming">Same as Work Timing</Label>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="timeAccessStart">Start Time</Label>
                      <Input
                        id="timeAccessStart"
                        type="time"
                        value={formData.timeAccessStart}
                        onChange={(e) => handleInputChange("timeAccessStart", e.target.value)}
                        disabled={formData.sameAsWorkTiming}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeAccessEnd">End Time</Label>
                      <Input
                        id="timeAccessEnd"
                        type="time"
                        value={formData.timeAccessEnd}
                        onChange={(e) => handleInputChange("timeAccessEnd", e.target.value)}
                        disabled={formData.sameAsWorkTiming}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Only show Geo Location Access for non-Admin roles */}
          {formData.roles[0] !== "Admin" && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="geoLocationAccess"
                  checked={formData.geoLocationAccess}
                  onCheckedChange={(checked) => handleInputChange("geoLocationAccess", checked)}
                />
                <Label htmlFor="geoLocationAccess" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Geo Location Based Access
                </Label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <div className="flex flex-col gap-6" onClick={handleDocumentClick}>
      <PageHeader
        title="User Management"
        description="Role Based, Time Based and Geo Based Access Control"
        icon={Users}
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="role-filter" className="whitespace-nowrap">
              Role:
            </Label>
            <Select onValueChange={(value) => setRoleFilter(value)} defaultValue="all">
              <SelectTrigger id="role-filter" className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {rolesData.map((role) => (
                  <SelectItem key={role.id} value={role.name.toLowerCase()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add New User</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>IP Based Access</TableHead>
              <TableHead>Time Based Access</TableHead>
              <TableHead>Geo Location Access</TableHead>
              <TableHead>Org Unit</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  onContextMenu={(e) => handleContextMenu(e, user.id)}
                  onDoubleClick={() => handleEditUser(user.id)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{maskPhoneNumber(user.mobile)}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.ipBasedAccess ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.timeBasedAccess ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.geoLocationAccess ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.unit}</TableCell>
                  <TableCell>{user.department}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-gray-900 rounded-md shadow-md border border-gray-700 py-1"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
            onClick={() => handleViewDetails(contextMenu.userId)}
          >
            View Details
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
            onClick={() => handleEditUser(contextMenu.userId)}
          >
            Edit User
          </button>
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] !animate-pure-fade !data-[state=open]:animate-none !data-[state=closed]:animate-none !data-[side=top]:animate-none !data-[side=bottom]:animate-none !data-[side=left]:animate-none !data-[side=right]:animate-none">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          {renderUserForm(false)}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] !animate-pure-fade !data-[state=open]:animate-none !data-[state=closed]:animate-none !data-[side=top]:animate-none !data-[side=bottom]:animate-none !data-[side=left]:animate-none !data-[side=right]:animate-none">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {renderUserForm(true)}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsEditDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] !animate-pure-fade !data-[state=open]:animate-none !data-[state=closed]:animate-none !data-[side=top]:animate-none !data-[side=bottom]:animate-none !data-[side=left]:animate-none !data-[side=right]:animate-none">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">User Name</Label>
                  <p className="text-sm text-gray-600">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="font-medium">Full Name</Label>
                  <p className="text-sm text-gray-600">{selectedUser.fullName}</p>
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="font-medium">Mobile</Label>
                  <p className="text-sm text-gray-600">
                    {selectedUser.maskMobile ? maskPhoneNumber(selectedUser.mobile) : selectedUser.mobile}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Role</Label>
                  <p className="text-sm text-gray-600">{selectedUser.role}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Org Unit</Label>
                  <p className="text-sm text-gray-600">{selectedUser.unit}</p>
                </div>
                <div>
                  <Label className="font-medium">Department</Label>
                  <p className="text-sm text-gray-600">{selectedUser.department}</p>
                </div>
                <div>
                  <Label className="font-medium">User Type</Label>
                  <p className="text-sm text-gray-600">{selectedUser.userType}</p>
                </div>
                {selectedUser.workTiming && (
                  <div>
                    <Label className="font-medium">Work Timing</Label>
                    <p className="text-sm text-gray-600">
                      {selectedUser.workTiming.checkIn} - {selectedUser.workTiming.checkOut}
                    </p>
                  </div>
                )}
                {selectedUser.emergencyContact && (
                  <div>
                    <Label className="font-medium">Emergency Contact</Label>
                    <p className="text-sm text-gray-600">{selectedUser.emergencyContact}</p>
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <Label className="font-medium">Access Control</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm">IP Based: {selectedUser.ipBasedAccess ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Time Based: {selectedUser.timeBasedAccess ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Geo Location: {selectedUser.geoLocationAccess ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
