# CTS Optimizer Frontend

A fully responsive, professional frontend application for managing organizations, customers, orders, and cost optimization.

## Tech Stack

- **React 18** - Latest version with functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Material UI (MUI)** - Professional component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client (configured for mock API)
- **React Hook Form** - Form management and validation
- **date-fns** - Date formatting utilities

## Features

- **9 Entity Management Pages**:
  - Organizations
  - Users
  - Customers
  - Routes
  - Warehouse Costs
  - Transport Costs
  - Orders
  - Cost Results
  - Drop Size Results

- **Full CRUD Operations**: Create, Read, Update, Delete for all entities
- **Relationship Handling**: Foreign keys displayed as dropdowns with proper filtering
- **Responsive Design**: Mobile-first approach with card views on mobile, tables on desktop
- **Professional UI**: Clean, modern design with MUI components and Tailwind styling
- **Mock Data Service**: Complete mock API with interconnected sample data

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Layout, Navigation, DataTable, etc.)
│   └── forms/            # Form components for each entity
├── pages/                 # Page components organized by entity
├── services/              # API service and mock data
├── types/                 # TypeScript type definitions
├── theme/                 # MUI theme configuration
└── utils/                 # Utility functions (formatters, etc.)
```

## Entity Relationships

The application respects all relationships from the ER diagram:

- **Organizations** → Users, Customers, Routes, Warehouse Costs, Orders
- **Customers** → Orders
- **Routes** → Transport Costs, Orders
- **Orders** → Cost Results, Drop Size Results
- **Warehouse Costs** ↔ Orders (many-to-many)

## Features by Page

Each entity page includes:
- List view with search, pagination, and sorting
- Create/Edit dialogs with form validation
- Details page with full entity information
- Delete confirmation
- Responsive design (mobile cards, desktop tables)

## Mock Data

The application includes comprehensive mock data with proper foreign key relationships. All data is stored in memory and persists during the session.

## Styling

- **MUI Theme**: Professional blue/gray color scheme
- **Tailwind CSS**: Utility classes for spacing, layout, and responsiveness
- **Responsive Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## License

MIT

