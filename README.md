# BiharLand (ZameenSetu) - Frontend Prototype

**Verified Land Properties Platform for Rohtas District, Bihar**

A complete client-side Next.js prototype for discovering, listing, and verifying land properties in Rohtas District with zero backend infrastructure required.

## 🎯 Features

### Discovery Portal
- Real-time property filtering by Anchal (district division), road width, price range, and verification tier
- 3-column responsive grid with property cards
- High-contrast verification badges and dual pricing (Total + Per Katha)
- Instant search across all properties

### Land Passport Dossier
- Complete official Bihar land revenue record display
- All 6 revenue identifiers (Khata, Khesra, Jamabandi, Mauza, Anchal, Thana)
- 4-tier verification audit trail (KYC → Bihar Bhumi Match → Physical Verification → 30-Year Search)
- Hero image gallery with thumbnails
- Sticky action sidebar with WhatsApp integration
- Masked seller contact information for privacy
- Document vault with simulated Jamabandi extracts

### Seller Onboarding
- 4-step progressive disclosure form
- Live Decimal ↔ Katha unit conversion (Rohtas standard)
- Form validation with error messaging
- Automatic property creation and localStorage persistence
- Instant visibility in discovery grid after submission

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI Components:** React 19 + shadcn/ui + Radix UI
- **Styling:** Tailwind CSS 4
- **State:** React Context API
- **Persistence:** Browser localStorage
- **Language:** TypeScript

### Project Structure
```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Discovery portal
│   ├── property/[id]/     # Land passport detail
│   └── list-land/         # Seller form
├── components/            # React components
│   ├── Header.tsx
│   ├── FilterSidebar.tsx
│   ├── PropertyCard.tsx
│   ├── LandPassportDossier.tsx
│   ├── VerificationStepper.tsx
│   ├── SellerForm.tsx
│   └── ui/               # shadcn components
├── context/              # State management
│   └── PropertyContext.tsx
├── data/                 # Seed data
│   └── seed-properties.ts  (8 realistic Rohtas properties)
├── types/                # TypeScript types
├── lib/                  # Utilities
│   └── storage.ts        # localStorage adapter
└── utils/                # Converters & helpers
    └── converters.ts     # Unit conversion, formatting
```

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Opens at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📋 Features in Detail

### Unit Conversion
- **Rohtas Standard:** 1 Katha ≈ 3.2 Decimals
- Automatic conversion displayed in forms
- Price per Katha derived from total price
- Bidirectional conversion utilities

### Phone Masking
- Raw phone numbers stored in state
- Displayed masked (e.g., +91 98****3210)
- Business manager WhatsApp number used for CTA links
- Seller privacy protected in UI

### Verification System
- **Tier 1:** Mobile & Seller KYC
- **Tier 2:** Bihar Bhumi Jamabandi Match
- **Tier 3:** Physical Road Measurement & Boundary
- **Tier 4:** 30-Year Title Search (Optional)

Color-coded badges and audit trail visualization show verification progress.

### Filtering
- **By Anchal:** Bikramganj, Sasaram, Dehri
- **By Road Width:** 16ft, 20ft, 25ft, 30ft, 40ft+
- **By Price Range:** Custom min/max
- **By Road Surface:** Pakka, Soling, Kachha
- **By Verification:** Tier 2+ only

## 📊 Seed Data

8 realistic properties included:
- **Bikramganj:** Prime Commercial (₹36L), Residential, Agricultural
- **Sasaram:** GT Road Bypass (₹81L), City Center, Residential
- **Dehri:** Residential Township (₹24L), Industrial Zone

All with complete revenue records and verification details.

## 🔄 Data Flow

```
User Input (Form)
    ↓
PropertyContext (State Update)
    ↓
localStorage (Persistent Storage)
    ↓
Instant UI Sync (Discovery Grid)
```

New properties are:
1. Validated on form submission
2. Created with auto-generated code (ZS-RHT-0XXX)
3. Saved to localStorage
4. Immediately visible in all views
5. Persisted across browser refreshes

## 🧪 Testing

All core flows verified:
- ✅ Property discovery and filtering
- ✅ Detailed land passport viewing
- ✅ 4-step seller form completion
- ✅ Unit conversion accuracy
- ✅ Data persistence
- ✅ Phone masking
- ✅ Verification badge rendering

## 🎨 Design System

### Colors
- **Primary:** Emerald-600 (Trust, verification)
- **Secondary:** Slate-900 (Institutional)
- **Accent:** Amber-600 (Pending items)

### Typography
- **Headings:** Geist Sans Bold
- **Body:** Geist Sans Regular
- **Monospace:** Geist Mono (Revenue IDs)

### Responsive
- Mobile-first design
- Filters stack vertically on mobile
- Cards grid: 1 → 2 → 3 columns
- Touch-friendly form inputs

## 📱 Pages

| Route | Purpose |
|-------|---------|
| `/` | Discovery portal with filtering |
| `/property/[id]` | Complete land passport dossier |
| `/list-land` | 4-step seller onboarding form |

## 🔮 Future Enhancements

### Backend Integration
- Firebase/Supabase for persistent database
- Real Bihar Bhumi API verification
- WhatsApp Cloud API for automated messages
- Payment gateway for commission collection

### Features
- Image upload and optimization
- Video property tours
- Schedule site visits
- Chat between buyers and sellers
- Saved favorites/bookmarks
- Buyer profile and verification

### Analytics
- Property view tracking
- Filter usage analytics
- Seller dashboard
- Market insights

## 📝 License

Built for educational and demonstration purposes.

## 👨‍💻 Author

Claude Haiku 4.5 (AI Development)
Amisha Gupta (Project Lead)

---

**Status:** Production-ready for stakeholder demonstrations and pilot testing.
