export const skusData = [
  {
    id: "SKU-001",
    parentResource: "Packaging Material",
    name: "Carton Box",
    brand: "ABC",
    procuredDate: "2025-02-10",
    location: "U1-W1-Z2-R3",
    skuCode: "PM-009-S4566",
    availableQuantity: 1000,
    skuUnit: "Count",
    unit: "Unit 1",
    department: "Packaging",
    wastageQuantity: "PM for ABC product",
    description: "Brown Carton Box for packaging",
    minQuantity: 50,
    type: "Primary",
    category: "Packaging Material",
    unitCost: 25.5,
    currency: "USD",
    unitWeight: 2.3,
    weightUnit: "kg",
    quantityUnit: "pieces",
    qualityRating: "A",
    qualityCheckDone: true,
    qualityCheckDate: "2023-11-01",
    qualityCheckNotes: "Passed all quality tests. No defects found.",
    taggedForProduction: 10,
    wastage: 5,
    totalProcured: 1000,
  },
  {
    id: "SKU-002",
    parentResource: "RAW Material",
    name: "RAW Material 1",
    brand: "XYZ",
    procuredDate: "2025-05-18",
    location: "U1-W1-Z4",
    skuCode: "RAW-009-S4566",
    availableQuantity: 300,
    skuUnit: "KG",
    unit: "",
    department: "Production",
    wastageQuantity: "RM for ABC product",
    description: "High quality raw material for production",
    minQuantity: 40,
    type: "Secondary",
    category: "RAW Material",
    unitCost: 28.75,
    currency: "USD",
    unitWeight: 2.1,
    weightUnit: "kg",
    quantityUnit: "pieces",
    qualityRating: "B",
    qualityCheckDone: true,
    qualityCheckDate: "2023-11-02",
    qualityCheckNotes: "Minor grain inconsistencies, but within acceptable range.",
    taggedForProduction: 15,
    wastage: 0,
    totalProcured: 300,
  },
  {
    id: "SKU-003",
    parentResource: "Pallets",
    name: "Wooden Pallet",
    brand: "MNM",
    procuredDate: "2025-03-16",
    location: "U1-W2",
    skuCode: "PM-009-98976",
    availableQuantity: 150,
    skuUnit: "Count",
    unit: "",
    department: "Warehouse",
    wastageQuantity: "",
    description: "Standard wooden pallet for storage",
    minQuantity: 25,
    type: "Secondary",
    category: "Others",
    unitCost: 32.0,
    currency: "USD",
    unitWeight: 2.5,
    weightUnit: "kg",
    quantityUnit: "pieces",
    qualityRating: "A",
    qualityCheckDone: false,
    qualityCheckDate: "",
    qualityCheckNotes: "",
    taggedForProduction: 5,
    wastage: 0,
    totalProcured: 150,
  },
]
