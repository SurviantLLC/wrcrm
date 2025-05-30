// Shared users data that can be imported by both user management and dashboard pages
export const usersData = [
  {
    id: "1",
    name: "johndoe",
    fullName: "John Doe",
    email: "john.doe@worcoor.com",
    role: "Admin",
    mobile: "9876543210",
    maskMobile: true,
    ipBasedAccess: true,
    timeBasedAccess: true,
    geoLocationAccess: false,
    unit: "Main Office",
    department: "IT",
    userType: "Executives",
    skillSet: [],
    workTiming: {
      checkIn: "08:00",
      checkOut: "17:00",
    },
    emergencyContact: "",
  },
  {
    id: "2",
    name: "janesmith",
    fullName: "Jane Smith",
    email: "jane.smith@worcoor.com",
    role: "Operation Manager",
    mobile: "8765432109",
    maskMobile: false,
    ipBasedAccess: true,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Production Unit",
    department: "All",
    userType: "Manager",
    skillSet: [],
    workTiming: {
      checkIn: "09:00",
      checkOut: "18:00",
    },
    emergencyContact: "",
  },
  {
    id: "3",
    name: "mikebrown",
    fullName: "Mike Brown",
    email: "mike.brown@worcoor.com",
    role: "Technician",
    mobile: "7654321098",
    maskMobile: false,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: false,
    unit: "Unit 1",
    department: "Quality Check",
    userType: "Technicians",
    skillSet: ["Electrical", "Mechanical"],
    workTiming: {
      checkIn: "07:30",
      checkOut: "16:30",
    },
    emergencyContact: "9988776655",
  },
  {
    id: "4",
    name: "sarahlee",
    fullName: "Sarah Lee",
    email: "sarah.lee@worcoor.com",
    role: "Worker",
    mobile: "6543210987",
    maskMobile: true,
    ipBasedAccess: false,
    timeBasedAccess: false,
    geoLocationAccess: false,
    unit: "Production Unit",
    department: "Quality Check",
    userType: "Worker",
    skillSet: ["Quality Control", "Testing"],
    workTiming: {
      checkIn: "08:30",
      checkOut: "17:30",
    },
    emergencyContact: "8877665544",
  },
  {
    id: "5",
    name: "davidwilson",
    fullName: "David Wilson",
    email: "david.wilson@worcoor.com",
    role: "Task Manager",
    mobile: "5432109876",
    maskMobile: false,
    ipBasedAccess: true,
    timeBasedAccess: false,
    geoLocationAccess: true,
    unit: "Asset Storing Facility",
    department: "All",
    userType: "Manager",
    skillSet: [],
    workTiming: {
      checkIn: "09:00",
      checkOut: "18:00",
    },
    emergencyContact: "",
  },
  {
    id: "6",
    name: "alexjohnson",
    fullName: "Alex Johnson",
    email: "alex.johnson@worcoor.com",
    role: "Technician",
    mobile: "4321098765",
    maskMobile: true,
    ipBasedAccess: true,
    timeBasedAccess: true,
    geoLocationAccess: false,
    unit: "Unit 1",
    department: "Quality Check",
    userType: "Technicians",
    skillSet: ["Welding", "Assembly"],
    workTiming: {
      checkIn: "06:00",
      checkOut: "15:00",
    },
    emergencyContact: "7766554433",
  },
  {
    id: "7",
    name: "emilydavis",
    fullName: "Emily Davis",
    email: "emily.davis@worcoor.com",
    role: "Product Manager",
    mobile: "3210987654",
    maskMobile: false,
    ipBasedAccess: true,
    timeBasedAccess: false,
    geoLocationAccess: true,
    unit: "Production Unit",
    department: "Quality Check",
    userType: "Manager",
    skillSet: [],
    workTiming: {
      checkIn: "08:00",
      checkOut: "17:00",
    },
    emergencyContact: "",
  },
  {
    id: "8",
    name: "robertmiller",
    fullName: "Robert Miller",
    email: "robert.miller@worcoor.com",
    role: "Worker",
    mobile: "2109876543",
    maskMobile: false,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: false,
    unit: "Unit 1",
    department: "Quality Check",
    userType: "Worker",
    skillSet: ["Machine Operation", "Safety"],
    workTiming: {
      checkIn: "07:00",
      checkOut: "16:00",
    },
    emergencyContact: "6655443322",
  },
  {
    id: "9",
    name: "lisagarcia",
    fullName: "Lisa Garcia",
    email: "lisa.garcia@worcoor.com",
    role: "Executive",
    mobile: "1098765432",
    maskMobile: true,
    ipBasedAccess: true,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Main Office",
    department: "IT",
    userType: "Executives",
    skillSet: [],
    workTiming: {
      checkIn: "09:00",
      checkOut: "18:00",
    },
    emergencyContact: "",
  },
  {
    id: "10",
    name: "kevinwilson",
    fullName: "Kevin Wilson",
    email: "kevin.wilson@worcoor.com",
    role: "Technician",
    mobile: "0987654321",
    maskMobile: false,
    ipBasedAccess: true,
    timeBasedAccess: false,
    geoLocationAccess: false,
    unit: "Unit 1",
    department: "IT",
    userType: "Technicians",
    skillSet: ["Electrical", "Troubleshooting"],
    workTiming: {
      checkIn: "08:30",
      checkOut: "17:30",
    },
    emergencyContact: "5544332211",
  },
  {
    id: "11",
    name: "rachelthomas",
    fullName: "Rachel Thomas",
    email: "rachel.thomas@worcoor.com",
    role: "Operation Manager",
    mobile: "9876543201",
    maskMobile: true,
    ipBasedAccess: true,
    timeBasedAccess: true,
    geoLocationAccess: false,
    unit: "Production Unit",
    department: "All",
    userType: "Manager",
    skillSet: [],
    workTiming: {
      checkIn: "08:00",
      checkOut: "17:00",
    },
    emergencyContact: "",
  },
  {
    id: "12",
    name: "markanderson",
    fullName: "Mark Anderson",
    email: "mark.anderson@worcoor.com",
    role: "Worker",
    mobile: "8765432190",
    maskMobile: false,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Production Unit",
    department: "Quality Check",
    userType: "Worker",
    skillSet: ["Inspection", "Documentation"],
    workTiming: {
      checkIn: "07:30",
      checkOut: "16:30",
    },
    emergencyContact: "4433221100",
  },
  {
    id: "13",
    name: "jennifertaylor",
    fullName: "Jennifer Taylor",
    email: "jennifer.taylor@worcoor.com",
    role: "Technician",
    mobile: "7654321089",
    maskMobile: true,
    ipBasedAccess: true,
    timeBasedAccess: false,
    geoLocationAccess: false,
    unit: "Unit 1",
    department: "Quality Check",
    userType: "Technicians",
    skillSet: ["Assembly", "Quality Control"],
    workTiming: {
      checkIn: "06:30",
      checkOut: "15:30",
    },
    emergencyContact: "3322110099",
  },
  {
    id: "14",
    name: "danielwhite",
    fullName: "Daniel White",
    email: "daniel.white@worcoor.com",
    role: "Admin",
    mobile: "6543210978",
    maskMobile: false,
    ipBasedAccess: true,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Main Office",
    department: "IT",
    userType: "Executives",
    skillSet: [],
    workTiming: {
      checkIn: "09:00",
      checkOut: "18:00",
    },
    emergencyContact: "",
  },
  {
    id: "15",
    name: "amyharris",
    fullName: "Amy Harris",
    email: "amy.harris@worcoor.com",
    role: "Worker",
    mobile: "5432109867",
    maskMobile: true,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: false,
    unit: "Unit 1",
    department: "Quality Check",
    userType: "Worker",
    skillSet: ["Packaging", "Labeling"],
    workTiming: {
      checkIn: "08:00",
      checkOut: "17:00",
    },
    emergencyContact: "2211009988",
  },
  // New users with only Time based and Geo based access (no IP based)
  {
    id: "16",
    name: "tomjackson",
    fullName: "Tom Jackson",
    email: "tom.jackson@worcoor.com",
    role: "Technician",
    mobile: "4321098756",
    maskMobile: false,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Unit 1",
    department: "Quality Check",
    userType: "Technicians",
    skillSet: ["CNC Operation", "Programming"],
    workTiming: {
      checkIn: "06:00",
      checkOut: "15:00",
    },
    emergencyContact: "1100998877",
  },
  {
    id: "17",
    name: "lindaclark",
    fullName: "Linda Clark",
    email: "linda.clark@worcoor.com",
    role: "Worker",
    mobile: "3210987645",
    maskMobile: true,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Unit 1",
    department: "All",
    userType: "Worker",
    skillSet: ["Material Handling", "Inventory"],
    workTiming: {
      checkIn: "07:00",
      checkOut: "16:00",
    },
    emergencyContact: "9988776644",
  },
  {
    id: "18",
    name: "stevenwright",
    fullName: "Steven Wright",
    email: "steven.wright@worcoor.com",
    role: "Technician",
    mobile: "2109876534",
    maskMobile: false,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Production Unit",
    department: "Quality Check",
    userType: "Technicians",
    skillSet: ["Testing", "Calibration"],
    workTiming: {
      checkIn: "08:00",
      checkOut: "17:00",
    },
    emergencyContact: "8877665533",
  },
  {
    id: "19",
    name: "mariaperez",
    fullName: "Maria Perez",
    email: "maria.perez@worcoor.com",
    role: "Worker",
    mobile: "1098765423",
    maskMobile: true,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Asset Storing Facility",
    department: "All",
    userType: "Worker",
    skillSet: ["Packaging", "Shipping"],
    workTiming: {
      checkIn: "09:00",
      checkOut: "18:00",
    },
    emergencyContact: "7766554422",
  },
  {
    id: "20",
    name: "brianlee",
    fullName: "Brian Lee",
    email: "brian.lee@worcoor.com",
    role: "Technician",
    mobile: "0987654312",
    maskMobile: false,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Unit 1",
    department: "IT",
    userType: "Technicians",
    skillSet: ["Hydraulics", "Pneumatics"],
    workTiming: {
      checkIn: "07:30",
      checkOut: "16:30",
    },
    emergencyContact: "6655443311",
  },
  {
    id: "21",
    name: "carolturner",
    fullName: "Carol Turner",
    email: "carol.turner@worcoor.com",
    role: "Worker",
    mobile: "9876543012",
    maskMobile: true,
    ipBasedAccess: false,
    timeBasedAccess: true,
    geoLocationAccess: true,
    unit: "Asset Storing Facility",
    department: "Auditing",
    userType: "Worker",
    skillSet: ["Assembly Line", "Quality Check"],
    workTiming: {
      checkIn: "06:30",
      checkOut: "15:30",
    },
    emergencyContact: "5544332200",
  },
]
