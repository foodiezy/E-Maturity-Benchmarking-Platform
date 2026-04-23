# E-Maturity Benchmarking Suite

A comprehensive, full-stack Next.js web application designed to facilitate organisational e-maturity benchmarking through the Adaptive Integrated Maturity Model (AIMM). Features robust visual analytics, strict Role-Based Access Control (RBAC), and a consultancy-grade risk register.

## Features

- **Dynamic Assessment Engine** — A fully interactive, multi-step quiz engine for standard users to evaluate their organisation's maturity across People, Innovation, and Capability dimensions.
- **Role-Based Security (RBAC)** — Built-in NextAuth routing strictly isolates consultant-only analytics suites from standard users via middleware and layout-level guards.
- **Consultant Dashboard** — Create, edit, and version complex Maturity Models natively in the browser with a full CRUD matrix editor.
- **Mathematical Visualisations** — Integrated Recharts dynamically processes assessment responses into Radar and Bar gap-analysis graphs, segmented by job level and department.
- **Personal Isolated Vaults** — Every standard user has a secure personal dashboard isolated purely to their own dataset.
- **Organisation-Aware Architecture** — Users join or create organisations during registration, enabling aggregated cross-organisational analytics.
- **Risk & Mitigation Register** — Centralised CRUD tracking of operational and maturity risks across all client organisations.
- **PDF Report Export** — One-click downloadable assessment reports for consultant distribution.
- **Monochromatic Design System** — Premium brutalist black-and-white UI with unDraw illustrations, consistent across every page.

## Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| **Frontend**    | React 18, Next.js 14 (App Router), Tailwind CSS |
| **Backend**     | Next.js Server API Routes, Node.js             |
| **Database**    | SQLite managed via Prisma ORM                  |
| **Auth**        | NextAuth.js (bcryptjs encrypted credentials)   |
| **Charts**      | Recharts                                       |
| **Illustrations** | undraw-react                                 |

---

## How to Run Locally

### Prerequisites

- **[Node.js](https://nodejs.org/)** (v18 or later recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/foodiezy/E-Maturity-Benchmarking-Platform.git
   cd E-Maturity-Benchmarking-Platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create the environment file**:
   Create a `.env` file in the project root with:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Initialise the database**:
   ```bash
   npx prisma db push
   ```

5. **Seed the database** (optional — creates the AIMM model, sample risks, and an admin account):
   ```bash
   npx prisma db seed
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** at `http://localhost:3000`

### Testing Accounts

- Navigate to `/auth/signup` to register a new standard `USER` account.
- If you ran the seed script, an admin account is available: `admin@aimm.local` / `admin123`.

## Project Structure

```
src/
├── app/
│   ├── api/            # REST API routes (auth, assessment, models, risks, etc.)
│   ├── assessment/     # Public assessment pages (directory, wizard, personal results)
│   ├── auth/           # Sign-in and sign-up pages
│   ├── consultant/     # Protected consultant area (dashboard, analytics, results, risks, model editor)
│   └── contact/        # Contact form page
├── components/         # Reusable React components (charts, editors, wizards)
├── lib/                # Shared utilities (Prisma client, NextAuth config)
└── types/              # TypeScript type declarations
prisma/
├── schema.prisma       # Database schema definition
└── seed.ts             # Database seed script
prisma.config.ts        # Prisma configuration
```

## Licence

All rights reserved.
