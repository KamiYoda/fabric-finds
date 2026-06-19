# Migration Guide: Feature-Based Architecture Refactoring

## Overview

This guide documents the migration from the old flat route structure to a feature-based architecture with proper TanStack Router organization.

## What Changed

### Before (Old Structure)
```
src/
├── components/
│   ├── Button.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── modals/
│       ├── TailorProfileModal.tsx
│       ├── TailorSearchModal.tsx
│       └── OrderSummaryModal.tsx
├── routes/
│   ├── _dashboard/
│   │   ├── dashboard.index.tsx
│   │   ├── dashboard.orders.$orderId.tsx
│   │   ├── dashboard.orders.index.tsx
│   │   ├── dashboard.wallet.tsx
│   │   └── dashboard.settings.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── signup.tsx
└── lib/
    └── orderStage.ts
```

### After (New Structure)
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── QuickActionsGrid.tsx
│   │   │   ├── MeasurementsCard.tsx
│   │   │   ├── NotificationsCard.tsx
│   │   │   └── RecentOrdersCard.tsx
│   │   └── index.ts
│   │
│   ├── orders/
│   │   ├── components/
│   │   │   ├── OrdersList.tsx
│   │   │   ├── OrderDetails.tsx
│   │   │   ├── OrderChat.tsx
│   │   │   ├── OrderAcknowledge.tsx
│   │   │   ├── OrderFabric.tsx
│   │   │   ├── OrderPayment.tsx
│   │   │   ├── OrderRating.tsx
│   │   │   └── OrderSummaryModal.tsx
│   │   ├── hooks/
│   │   │   └── useOrderStage.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── tailors/
│   │   ├── components/
│   │   │   ├── TailorsList.tsx
│   │   │   ├── TailorCard.tsx
│   │   │   ├── TailorProfileModal.tsx
│   │   │   ├── TailorSearchModal.tsx
│   │   │   └── TailorBidModal.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── wallet/
│   ├── settings/
│   └── explore/
│
├── routes/
│   ├── dashboard/
│   │   ├── index.tsx
│   │   ├── orders/
│   │   │   ├── index.tsx
│   │   │   └── $orderId/
│   │   │       ├── index.tsx
│   │   │       ├── acknowledge.tsx
│   │   │       ├── fabric.tsx
│   │   │       ├── pay.tsx
│   │   │       └── rate.tsx
│   │   ├── wallet.tsx
│   │   ├── settings.tsx
│   │   ├── tailors.tsx
│   │   ├── explore.tsx
│   │   └── create.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── signup.tsx
│
└── components/
    └── ui/          # shadcn/ui components only
```

## Key Benefits

### 1. **Feature Isolation**
- Each feature is self-contained in its own folder
- Easy to find all related code for a feature
- Reduced coupling between features

### 2. **Better Code Organization**
- Components, hooks, types, and utils grouped by feature
- Public API via index.ts enforces intentional coupling
- Easier to onboard new developers

### 3. **Improved Performance**
- Lazy loading at route level
- Code splitting per feature
- Memoized components reduce unnecessary re-renders

### 4. **Scalability**
- Add new features without touching existing code
- Remove features easily (just delete the folder)
- Clear boundaries make testing easier

### 5. **Cleaner Imports**
```tsx
// Before
import { Modal } from '../../components/modals/Modal'
import { getStage } from '../../lib/orderStage'

// After
import { OrderDetails, useOrderStage } from '@/features/orders'
```

## Migration Steps

### Step 1: Create Feature Folders (✅ DONE)
```bash
src/features/{auth,dashboard,orders,wallet,settings,tailors,explore}/{components,hooks,api,types,utils}
```

### Step 2: Move Components to Features (IN PROGRESS)
- [ ] Dashboard components → `features/dashboard/components/`
- [ ] Order modals → `features/orders/components/`
- [ ] Tailor modals → `features/tailors/components/`
- [ ] Auth forms → `features/auth/components/`

### Step 3: Extract Hooks from Routes
- [x] `orderStage.ts` → `features/orders/hooks/useOrderStage.ts`
- [ ] Extract auth logic → `features/auth/hooks/useAuth.ts`

### Step 4: Define Types
- [x] Order types → `features/orders/types.ts`
- [x] Tailor types → `features/tailors/types.ts`
- [x] Auth types → `features/auth/types.ts`

### Step 5: Create Public APIs
- [x] Each feature gets an `index.ts` exporting public API
- [x] Internal components stay private

### Step 6: Refactor Routes
- [x] New dashboard route with lazy loading
- [ ] Refactor orders routes
- [ ] Refactor auth routes

### Step 7: Update Imports
- [ ] Update all route files to use new feature imports
- [ ] Remove old component imports

### Step 8: Clean Up
- [ ] Delete old `_dashboard/` folder
- [ ] Remove unused lib files
- [ ] Update tsconfig paths if needed

## Performance Optimizations Applied

### Memoization
```tsx
// All components are memoized
export const QuickActionsGrid = memo(() => { ... })

// Callbacks are memoized
const handleClick = useCallback(() => { ... }, [deps])

// Expensive computations are memoized
const sortedData = useMemo(() => { ... }, [deps])
```

### Lazy Loading
```tsx
// Routes are lazy loaded
const DashboardOverview = lazy(() => 
  import('@/features/dashboard').then(m => ({ default: m.DashboardOverview }))
)

// With Suspense boundary
<Suspense fallback={<Skeleton />}>
  <DashboardOverview />
</Suspense>
```

### Responsive Design
```tsx
// Mobile-first Tailwind classes
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
```

## Testing the Migration

### 1. Run the dev server
```bash
bun run dev
```

### 2. Check routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Dashboard overview (NEW)
- `/dashboard/orders` - Orders list
- `/dashboard/orders/:orderId` - Order details
- `/dashboard/wallet` - Wallet
- `/dashboard/settings` - Settings
- `/dashboard/tailors` - Tailors list
- `/dashboard/explore` - Explore

### 3. Verify lazy loading
Open Chrome DevTools > Network tab and check that feature chunks load on demand

### 4. Test responsiveness
Use Chrome DevTools device emulation to test mobile/tablet/desktop views

## Breaking Changes

### Import Paths
```tsx
// Old
import { Modal } from '../../components/modals/Modal'

// New
import { OrderSummaryModal } from '@/features/orders'
```

### Route Paths
```tsx
// Old route structure (flat)
/_dashboard/dashboard.orders.$orderId.tsx

// New route structure (nested folders)
/dashboard/orders/$orderId/index.tsx
```

### Component Names
Some components were renamed for clarity:
- `Overview` → `DashboardOverview`
- Generic `Card` → Specific cards like `MeasurementsCard`

## Next Steps

1. **Complete Orders Feature**
   - Extract OrderDetails component
   - Extract OrderChat component
   - Extract order sub-routes (acknowledge, fabric, pay, rate)

2. **Complete Tailors Feature**
   - Move tailor modals
   - Create TailorsList component
   - Create TailorCard component

3. **Complete Auth Feature**
   - Extract LoginForm
   - Extract SignupForm
   - Create useAuth hook

4. **Create Wallet Feature**
   - Extract wallet dashboard
   - Create transaction components

5. **Create Settings Feature**
   - Extract settings page
   - Create settings sub-components

6. **Create Explore Feature**
   - Extract explore page

## File Checklist

### Dashboard Feature ✅
- [x] `DashboardOverview.tsx`
- [x] `QuickActionsGrid.tsx`
- [x] `MeasurementsCard.tsx`
- [x] `NotificationsCard.tsx`
- [x] `RecentOrdersCard.tsx`
- [x] `index.ts`

### Orders Feature 🔄
- [x] `types.ts`
- [x] `useOrderStage.ts` hook
- [x] `index.ts`
- [ ] `OrdersList.tsx`
- [ ] `OrderDetails.tsx`
- [ ] `OrderChat.tsx`
- [ ] `OrderAcknowledge.tsx`
- [ ] `OrderFabric.tsx`
- [ ] `OrderPayment.tsx`
- [ ] `OrderRating.tsx`
- [ ] Move `OrderSummaryModal.tsx`

### Tailors Feature 🔄
- [x] `types.ts`
- [x] `index.ts`
- [ ] `TailorsList.tsx`
- [ ] `TailorCard.tsx`
- [ ] Move `TailorProfileModal.tsx`
- [ ] Move `TailorSearchModal.tsx`
- [ ] Move `TailorBidModal.tsx`

### Auth Feature 🔄
- [x] `types.ts`
- [x] `index.ts`
- [ ] `LoginForm.tsx`
- [ ] `SignupForm.tsx`
- [ ] `AuthLayout.tsx`
- [ ] `useAuth.ts` hook

### Wallet Feature ⏳
- [x] `index.ts`
- [ ] `WalletDashboard.tsx`
- [ ] `types.ts`

### Settings Feature ⏳
- [x] `index.ts`
- [ ] `SettingsPage.tsx`

### Explore Feature ⏳
- [x] `index.ts`
- [ ] `ExplorePage.tsx`

## Notes

- All new components use `memo()` for performance
- All callbacks use `useCallback()` to prevent unnecessary re-renders
- Expensive computations use `useMemo()`
- Routes use lazy loading with Suspense boundaries
- Mobile-first responsive design with Tailwind breakpoints
- TypeScript strict mode enforced throughout

---

**Status**: 🔄 Migration in progress
**Last Updated**: {{ current_date }}
