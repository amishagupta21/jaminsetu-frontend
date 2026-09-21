import { Property } from "@/types";

export const seedProperties: Property[] = [
  {
    id: "prop-001",
    code: "ZS-RHT-0101",
    title: "Prime Commercial Plot - Tenduni Mauza, Bikramganj",
    description: "Premium commercial property with excellent connectivity to GT Road and Bikramganj market. 24ft pakka road frontage, verified revenue records, and immediate possession available.",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494145904049-0dca7b0589b0?w=800&h=600&fit=crop",
    ],

    mauza: "Tenduni",
    anchal: "Bikramganj",
    thanaNumber: "142",
    khata: "48",
    khesra: "312",
    jamabandi: "184/B",

    areaDecimal: 6.25,
    areaKatha: 2.0,
    roadWidth: 24,
    roadType: "Pakka",
    facing: "East",

    totalPrice: 3600000,
    pricePerKatha: 1800000,

    verificationTier: 3,
    verificationChecks: {
      kycCompleted: true,
      biharBhumiMatch: true,
      physicalVerified: true,
      thirtyYearSearch: false,
    },

    sellerName: "Rajesh Kumar Singh",
    sellerPhoneRaw: "+919876543210",
    sellerPhoneMasked: "+91 98****3210",
    sellerCategory: "Individual",

    status: "Available",
    createdAt: "2025-08-15T10:30:00Z",
    updatedAt: "2025-09-15T14:22:00Z",
  },
  {
    id: "prop-002",
    code: "ZS-RHT-0102",
    title: "GT Road Bypass Commercial - Sasaram Muffasil",
    description: "High-traffic commercial location near Sasaram bypass. 40ft wide pakka road, excellent for retail or office development. All verification documents ready.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1488880418879-5d7d42f9f460?w=800&h=600&fit=crop",
    ],

    mauza: "Sasaram Muffasil",
    anchal: "Sasaram",
    thanaNumber: "156",
    khata: "127",
    khesra: "458",
    jamabandi: "92/A",

    areaDecimal: 14.4,
    areaKatha: 4.5,
    roadWidth: 40,
    roadType: "Pakka",
    facing: "North",

    totalPrice: 8100000,
    pricePerKatha: 1800000,

    verificationTier: 3,
    verificationChecks: {
      kycCompleted: true,
      biharBhumiMatch: true,
      physicalVerified: true,
      thirtyYearSearch: false,
    },

    sellerName: "Priya Sharma",
    sellerPhoneRaw: "+919845612378",
    sellerPhoneMasked: "+91 98****2378",
    sellerCategory: "Broker",

    status: "Available",
    createdAt: "2025-07-20T09:15:00Z",
    updatedAt: "2025-09-18T11:45:00Z",
  },
  {
    id: "prop-003",
    code: "ZS-RHT-0103",
    title: "Residential Plot - Dehri Township",
    description: "Well-planned residential plot in developing Dehri area. Good road connectivity, peaceful locality, ideal for villa or residential complex development.",
    images: [
      "https://images.unsplash.com/photo-1485933999819-8e15877f1402?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1479123936182-42e8693102ed?w=800&h=600&fit=crop",
    ],

    mauza: "Dehri",
    anchal: "Dehri",
    thanaNumber: "168",
    khata: "89",
    khesra: "234",
    jamabandi: "156/C",

    areaDecimal: 9.6,
    areaKatha: 3.0,
    roadWidth: 30,
    roadType: "Pakka",
    facing: "South",

    totalPrice: 2400000,
    pricePerKatha: 800000,

    verificationTier: 2,
    verificationChecks: {
      kycCompleted: true,
      biharBhumiMatch: true,
      physicalVerified: false,
      thirtyYearSearch: false,
    },

    sellerName: "Amit Kumar Verma",
    sellerPhoneRaw: "+919823456789",
    sellerPhoneMasked: "+91 98****6789",
    sellerCategory: "Individual",

    status: "Available",
    createdAt: "2025-09-01T13:20:00Z",
    updatedAt: "2025-09-19T16:10:00Z",
  },
  {
    id: "prop-004",
    code: "ZS-RHT-0104",
    title: "Agricultural Land - Bikramganj Periphery",
    description: "Fertile agricultural land suitable for farming or agro-industry. Good irrigation facilities, near gram panchayat. Flexible terms available.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-7049faf701d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
    ],

    mauza: "Banspatti",
    anchal: "Bikramganj",
    thanaNumber: "142",
    khata: "156",
    khesra: "521",
    jamabandi: "201/D",

    areaDecimal: 40.0,
    areaKatha: 12.5,
    roadWidth: 16,
    roadType: "Soling",
    facing: "West",

    totalPrice: 4800000,
    pricePerKatha: 384000,

    verificationTier: 2,
    verificationChecks: {
      kycCompleted: true,
      biharBhumiMatch: true,
      physicalVerified: false,
      thirtyYearSearch: false,
    },

    sellerName: "Ramesh Singh",
    sellerPhoneRaw: "+919834567890",
    sellerPhoneMasked: "+91 98****7890",
    sellerCategory: "Individual",

    status: "Available",
    createdAt: "2025-06-10T08:45:00Z",
    updatedAt: "2025-09-10T10:30:00Z",
  },
  {
    id: "prop-005",
    code: "ZS-RHT-0105",
    title: "Premium Commercial - Sasaram City Center",
    description: "Ultra-prime location in Sasaram city center. 32ft road, near market hub, excellent foot traffic. Ready for retail showroom or franchise opportunity.",
    images: [
      "https://images.unsplash.com/photo-1469022563149-aa64ffc5e7eb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop",
    ],

    mauza: "Sasaram City",
    anchal: "Sasaram",
    thanaNumber: "155",
    khata: "203",
    khesra: "612",
    jamabandi: "78/B",

    areaDecimal: 3.2,
    areaKatha: 1.0,
    roadWidth: 32,
    roadType: "Pakka",
    facing: "Northeast",

    totalPrice: 2800000,
    pricePerKatha: 2800000,

    verificationTier: 4,
    verificationChecks: {
      kycCompleted: true,
      biharBhumiMatch: true,
      physicalVerified: true,
      thirtyYearSearch: true,
    },

    sellerName: "Vikram Properties LLC",
    sellerPhoneRaw: "+919812345678",
    sellerPhoneMasked: "+91 98****5678",
    sellerCategory: "Developer",

    status: "Available",
    createdAt: "2025-07-05T11:00:00Z",
    updatedAt: "2025-09-17T15:30:00Z",
  },
  {
    id: "prop-006",
    code: "ZS-RHT-0106",
    title: "Mixed-Use Development Plot - Dehri Industrial Zone",
    description: "Strategic location in emerging industrial zone. Suitable for warehousing, logistics, or light manufacturing. Government industrial area nearby.",
    images: [
      "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
    ],

    mauza: "Dehri Industrial",
    anchal: "Dehri",
    thanaNumber: "169",
    khata: "312",
    khesra: "745",
    jamabandi: "145/A",

    areaDecimal: 22.4,
    areaKatha: 7.0,
    roadWidth: 50,
    roadType: "Pakka",
    facing: "North",

    totalPrice: 11200000,
    pricePerKatha: 1600000,

    verificationTier: 3,
    verificationChecks: {
      kycCompleted: true,
      biharBhumiMatch: true,
      physicalVerified: true,
      thirtyYearSearch: false,
    },

    sellerName: "Sharma Industries",
    sellerPhoneRaw: "+919867890123",
    sellerPhoneMasked: "+91 98****0123",
    sellerCategory: "Developer",

    status: "Available",
    createdAt: "2025-08-22T14:30:00Z",
    updatedAt: "2025-09-16T09:45:00Z",
  },
  {
    id: "prop-007",
    code: "ZS-RHT-0107",
    title: "Corner Plot - Bikramganj Main Road",
    description: "Excellent corner location on Bikramganj main road. High visibility for commercial use. Near school, college, and bus stand. Quick decision required.",
    images: [
      "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    ],

    mauza: "Bikramganj Main",
    anchal: "Bikramganj",
    thanaNumber: "143",
    khata: "67",
    khesra: "389",
    jamabandi: "167/A",

    areaDecimal: 4.8,
    areaKatha: 1.5,
    roadWidth: 36,
    roadType: "Pakka",
    facing: "Southeast",

    totalPrice: 3600000,
    pricePerKatha: 2400000,

    verificationTier: 3,
    verificationChecks: {
      kycCompleted: true,
      biharBhumiMatch: true,
      physicalVerified: true,
      thirtyYearSearch: false,
    },

    sellerName: "Neha Singh",
    sellerPhoneRaw: "+919876543211",
    sellerPhoneMasked: "+91 98****3211",
    sellerCategory: "Individual",

    status: "Available",
    createdAt: "2025-09-05T12:15:00Z",
    updatedAt: "2025-09-20T13:00:00Z",
  },
  {
    id: "prop-008",
    code: "ZS-RHT-0108",
    title: "Residential Cluster Plot - Sasaram Upscale",
    description: "Part of upscale residential development. Gated community with common facilities, green spaces, and planned infrastructure.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9b08ab54eaea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    ],

    mauza: "Sasaram Nagar",
    anchal: "Sasaram",
    thanaNumber: "157",
    khata: "178",
    khesra: "467",
    jamabandi: "119/C",

    areaDecimal: 8.0,
    areaKatha: 2.5,
    roadWidth: 25,
    roadType: "Pakka",
    facing: "West",

    totalPrice: 2000000,
    pricePerKatha: 800000,

    verificationTier: 2,
    verificationChecks: {
      kycCompleted: true,
      biharBhumiMatch: true,
      physicalVerified: false,
      thirtyYearSearch: false,
    },

    sellerName: "Sasaram Residential Pvt Ltd",
    sellerPhoneRaw: "+919845123456",
    sellerPhoneMasked: "+91 98****3456",
    sellerCategory: "Developer",

    status: "Available",
    createdAt: "2025-08-08T10:00:00Z",
    updatedAt: "2025-09-14T11:20:00Z",
  },
];
