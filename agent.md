# Thread-Time-Tapestry Agent Context

## Project Overview

Thread-Time-Tapestry is a **custom tailoring marketplace** connecting customers with verified tailors for bespoke clothing orders. Built with modern React + TypeScript, focused on responsive, performant UI and scalable feature architecture.

**Core Value Proposition**: Order custom outfits from verified tailors and track every stitch in real-time.

This is a frontend-only repository.

---

# Core Tech Stack

## Frontend
* React 19
* TypeScript (strict mode)
* Vite

## Package Manager
* Bun

## UI System
* shadcn/ui
* Radix UI primitives

## Styling
* Tailwind CSS v4

## Routing
* TanStack Router (file-based routing)

## Data Fetching
* TanStack Query

## Animation
* Framer Motion

## Forms
* React Hook Form + Zod validation

---

# Project Architecture

## Feature-Based Structure (MANDATORY)

Every feature MUST have its own folder under `src/features/`.

```
src/features/
├── auth/           # Login, signup, authentication
├── dashboard/      # Dashboard overview, quick actions
├── orders/         # Order management, tracking, chat
├── tailors/        # Tailor discovery, profiles, bidding
├── wallet/         # Payments, transactions, balance
├── settings/       # User settings, measurements
└── explore/        # Browse tailors, fabrics, styles
```

Each feature folder structure:
```
feature-name/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific hooks
├── api/            # API calls (future)
├── types/          # TypeScript types
├── utils/          # Utility functions
└── index.ts        # Public API exports
```

**Benefits**:
* Easier maintenance
* Scalable codebase
* Isolated feature logic
* Cleaner imports
* Simple refactors
* Easy feature removal

---

# Performance Principles (NON-NEGOTIABLE)

Every implementation MUST prioritize:

## Code Splitting & Lazy Loading
```tsx
// ALWAYS lazy load route-level features
const DashboardOverview = lazy(() => 
  import('@/features/dashboard').then(m => ({ default: m.DashboardOverview }))
)

<Suspense fallback={<Skeleton />}>
  <DashboardOverview />
</Suspense>
```

## React Performance Patterns
```tsx
// Memoize components that render frequently
export const QuickActionsGrid = memo(() => { ... })

// Memoize expensive computations
const sortedOrders = useMemo(() => 
  orders.sort((a, b) => a.date - b.date), 
  [orders]
)

// Memoize callbacks passed to children
const handleClick = useCallback((id: string) => {
  selectOrder(id)
}, [selectOrder])
```

## Avoid Performance Killers
❌ Unnecessary wrappers
❌ Deep DOM nesting
❌ Heavy computations in render
❌ Unstable object/function references
❌ Inline anonymous functions in JSX

## Always Ask
* "How does this affect performance?"
* "Can this rerender less?"
* "Can this be split/lazy-loaded?"
* "Can this DOM structure be simpler?"
* "Will this scale on mobile devices?"

---

# Responsiveness Standards (NON-NEGOTIABLE)

All features/components MUST:
* Work seamlessly on mobile, tablet, desktop
* Support fluid layouts
* Avoid overflow issues
* Avoid layout jumps
* Optimize touch interactions
* Maintain accessibility

## Mobile-First Tailwind Pattern
```tsx
<div className="
  grid grid-cols-1          // Mobile: 1 column
  sm:grid-cols-2            // Tablet: 2 columns
  lg:grid-cols-4            // Desktop: 4 columns
  gap-4                     // Consistent spacing
">
```

**Responsive behavior is NOT optional.**

---

# Routing Standards

## TanStack Router Structure

Use proper folder-based routes:

```
routes/
├── dashboard/
│   ├── index.tsx                    # /dashboard
│   ├── orders/
│   │   ├── index.tsx                # /dashboard/orders
│   │   └── $orderId/
│   │       ├── index.tsx            # /dashboard/orders/:orderId
│   │       ├── acknowledge.tsx      # /dashboard/orders/:orderId/acknowledge
│   │       ├── fabric.tsx           # /dashboard/orders/:orderId/fabric
│   │       ├── pay.tsx              # /dashboard/orders/:orderId/pay
│   │       └── rate.tsx             # /dashboard/orders/:orderId/rate
│   ├── wallet.tsx                   # /dashboard/wallet
│   ├── settings.tsx                 # /dashboard/settings
│   ├── tailors.tsx                  # /dashboard/tailors
│   ├── explore.tsx                  # /dashboard/explore
│   └── create.tsx                   # /dashboard/create
├── index.tsx                        # /
├── login.tsx                        # /login
└── signup.tsx                       # /signup
```

❌ AVOID: `_dashboard/dashboard.wallet.tsx`
✅ PREFER: `dashboard/wallet.tsx`

---

# State Management Strategy

## Prefer (in order)
1. Local component state (`useState`)
2. TanStack Query for server state
3. Derived state over duplicated state
4. Memoization only when beneficial

## Avoid
❌ Unnecessary global state
❌ Excessive context usage
❌ Prop drilling across large trees

---

# Animation Guidelines

Use Framer Motion carefully.

## Prefer
✅ `opacity`
✅ `transform`
✅ `translate`
✅ `scale`

## Avoid
❌ Large animated DOM trees
❌ Animating layout-heavy properties
❌ Excessive AnimatePresence nesting

Always consider animation performance on low-end devices.

---

# Import Conventions

Use `@/` path alias:

```tsx
import { Button } from '@/components/ui/button'
import { DashboardOverview } from '@/features/dashboard'
import { useAuth } from '@/features/auth'
import { OrderDetails, useOrderStage } from '@/features/orders'
```

---

# Commands

```bash
# Development
bun run dev

# Build
bun run build

# Preview
bun run preview

# Type check
bun run type-check

# Lint
bun run lint

# Format
bun run format
```

---

# shadcn/ui Commands

```bash
# Add component
bunx shadcn@latest add button
bunx shadcn@latest add dialog
bunx shadcn@latest add sheet
```

---

# File Naming Conventions

* Components: `PascalCase.tsx`
* Hooks: `useSomething.ts`
* Utilities: `camelCase.ts`
* Types: `types.ts` or `ComponentName.types.ts`

---

# Domain Knowledge

## Order Lifecycle Stages
1. **acknowledge** - Tailor acknowledges order
2. **payment** - Customer pays
3. **fabric** - Fabric delivery to tailor
4. **started** - Work begins
5. **cutting** - Fabric cutting stage
6. **stitching** - Sewing stage
7. **fitting** - Customer fitting
8. **finishing** - Final touches
9. **done** - Order complete

## User Measurements
* Upper body: Neck, Shoulder, Chest, Bicep
* Core fit: Waist, Hip, Torso, Back
* Lower body: Inseam, Thigh, Knee, Ankle

## Features
* Order custom outfits with measurements
* Real-time order tracking with chat
* Verified tailor marketplace
* Escrow payment system (wallet)
* Fabric selection and delivery coordination
* Rating and review system

---

# What NOT To Do

❌ Use npm/yarn commands (use Bun)
❌ Use Create React App patterns (use Vite)
❌ Use React Router (use TanStack Router)
❌ Use Redux/MobX (use TanStack Query + local state)
❌ Scatter feature files across generic folders
❌ Create unresponsive layouts
❌ Ignore performance implications
❌ Reference Lovable.dev (removed from project)
❌ Make deployment assumptions (platform unknown)
❌ Use deep prop drilling
❌ Create giant shared folders
❌ Overuse global state
❌ Create unnecessary wrapper divs
❌ Use unstable inline functions
❌ Introduce hydration/layout shift issues

---

# What TO Do

✅ Use feature-folder architecture
✅ Use Bun commands
✅ Use TanStack Router properly
✅ Use TanStack Query for server state
✅ Think mobile-first
✅ Optimize rerenders with memo/useCallback/useMemo
✅ Lazy load routes and heavy features
✅ Keep DOM structures lean
✅ Prefer accessibility-first solutions
✅ Use type-safe patterns
✅ Build scalable implementations
✅ Prioritize maintainability and performance
✅ Keep components small and composable

---

# Performance Checklist

Before pushing ANY feature:

- [ ] Is this route/component lazy-loaded appropriately?
- [ ] Are expensive computations memoized with useMemo?
- [ ] Are callbacks memoized with useCallback where needed?
- [ ] Is the component responsive (mobile/tablet/desktop)?
- [ ] Are animations using transform/opacity?
- [ ] Is TanStack Query used for server state?
- [ ] Are there unnecessary rerenders? (Check with React DevTools Profiler)
- [ ] Is the bundle size impact acceptable? (bun run build)
- [ ] Are images optimized and lazy-loaded?
- [ ] Is the DOM structure lean (no unnecessary wrappers)?

---

# Code Examples

## Feature Public API Pattern
```tsx
// src/features/orders/index.ts
export { OrdersList } from './components/OrdersList'
export { OrderDetails } from './components/OrderDetails'
export { useOrderStage } from './hooks/useOrderStage'
export type { Order, OrderStage } from './types'

// Internal components NOT exported - keeps coupling low
```

## Performance-Optimized Component
```tsx
import { memo, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Props {
  orders: Order[]
  onSelect: (id: string) => void
}

export const OrdersList = memo(({ orders, onSelect }: Props) => {
  // Memoize expensive sort
  const sortedOrders = useMemo(
    () => orders.sort((a, b) => b.date - a.date),
    [orders]
  )

  // Memoize callback
  const handleSelect = useCallback(
    (id: string) => onSelect(id),
    [onSelect]
  )

  return (
    <div className="space-y-4">
      {sortedOrders.map((order) => (
        <OrderCard key={order.id} order={order} onSelect={handleSelect} />
      ))}
    </div>
  )
})

OrdersList.displayName = 'OrdersList'
```

## Lazy-Loaded Route
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const DashboardOverview = lazy(() =>
  import('@/features/dashboard').then(m => ({ default: m.DashboardOverview }))
)

export const Route = createFileRoute('/dashboard/')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardOverview userName="User" />
    </Suspense>
  )
}
```

## Responsive Layout
```tsx
export const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - hidden on mobile */}
        <aside className="hidden lg:block w-64 border-r">
          <Sidebar />
        </aside>
        
        {/* Main content - full width on mobile, flex-1 on desktop */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

# Communication Preferences

## What Copilot Should NOT Do
❌ Suggest npm/yarn
❌ Suggest React Router
❌ Suggest Redux/MobX
❌ Scatter files across generic folders
❌ Create unresponsive layouts
❌ Ignore performance
❌ Reference Lovable.dev

## What Copilot Should DO
✅ Use feature-folder architecture for new features
✅ Use Bun commands
✅ Use TanStack Router + TanStack Query
✅ Think mobile-first with Tailwind breakpoints
✅ Consider performance impact of every change
✅ Keep DOM structures lean
✅ Use shadcn/ui components
✅ Follow TypeScript strict mode
✅ Memoize appropriately
✅ Lazy load routes

---

# Development Philosophy

The codebase should remain:
* **Scalable** - easy to add features
* **Maintainable** - easy to modify/fix
* **Performant** - fast on all devices
* **Predictable** - follows consistent patterns
* **Modular** - loosely coupled features
* **Responsive** - works on all screen sizes
* **Cleanly organized** - easy to navigate

Every implementation decision should consider **long-term maintainability** and **runtime performance**.

---

# Current Status

**Migration to feature-based architecture: IN PROGRESS**

See `MIGRATION_GUIDE.md` for detailed refactoring progress.

**Completed**:
- ✅ Dashboard feature (all components)
- ✅ Orders types and hooks
- ✅ Tailors types
- ✅ Auth types
- ✅ Feature folder structure

**In Progress**:
- 🔄 Orders components extraction
- 🔄 Tailors components migration
- 🔄 Auth forms extraction
- 🔄 Route refactoring

**Next**:
- ⏳ Wallet feature
- ⏳ Settings feature
- ⏳ Explore feature
