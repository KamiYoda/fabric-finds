import {
  createFileRoute,
  Outlet,
  Link,
  useRouter,
  useLocation,
} from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ShoppingBag,
  Search,
  Wallet,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Plus,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Logo } from "../../components/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — i-sew" }] }),
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "Overview", icon: Home, exact: true },
  { to: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { to: "/dashboard/explore", label: "Explore", icon: Search },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  // { to: "/dashboard/tailors", label: "Tailors", icon: Users },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const profileName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
      user.email ||
      "User"
    : "User";
  const profileEmail = user?.email ? user.email : "";
  const initials = user
    ? user.first_name?.[0]?.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      "U"
    : "U";

  const sidebarW = collapsed ? "w-20" : "w-64";
  const mainPad = collapsed ? "lg:pl-20" : "lg:pl-64";

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-cream">
        {/* Sidebar - desktop */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-card transition-[width] duration-200 lg:flex ${sidebarW}`}
        >
          <div
            className={`flex h-16 items-center border-b border-border ${collapsed ? "justify-center px-2" : "justify-between px-6"}`}
          >
            {!collapsed && (
              <Link to="/">
                <Logo />
              </Link>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronsRight size={16} />
              ) : (
                <ChevronsLeft size={16} />
              )}
            </button>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {nav.map((n) => (
              <NavItem key={n.to} {...n} collapsed={collapsed} />
            ))}
          </nav>
          {!collapsed && (
            <div className="m-4 rounded-2xl gradient-primary p-5 text-primary-foreground shadow-glow">
              <div className="text-sm font-semibold">Refer & earn</div>
              <p className="mt-1 text-xs text-primary-foreground/70">
                Get $20 credit for every friend.
              </p>
              <button className="mt-3 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-primary">
                Invite friends
              </button>
            </div>
          )}
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
                onClick={() => setOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-card lg:hidden"
              >
                <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                  <Logo />
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full p-2 hover:bg-muted"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-1 p-4" onClick={() => setOpen(false)}>
                  {nav.map((n) => (
                    <NavItem key={n.to} {...n} />
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className={`transition-[padding] duration-200 ${mainPad}`}>
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="rounded-full p-2 hover:bg-muted lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden flex-1 max-w-md sm:block">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                placeholder="Search tailors, orders, fabrics…"
                className="h-10 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="relative rounded-full bg-card p-2.5 hover:bg-muted shadow-soft">
                <Bell size={18} />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary">
                  2
                </span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full bg-card p-1 pr-3 shadow-soft hover:bg-muted"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                    {initials}
                  </div>
                  <span className="hidden text-sm font-medium sm:block">
                    {profileName}
                  </span>
                  <ChevronDown size={14} className="hidden sm:block" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant"
                    >
                      <div className="p-4 border-b border-border">
                        <div className="text-sm font-semibold">
                          {profileName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {profileEmail}
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                        >
                          <Settings size={14} /> Settings
                        </Link>
                        <button
                          onClick={async () => {
                            await logout();
                            setProfileOpen(false);
                            router.navigate({ to: "/" });
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted"
                        >
                          <LogOut size={14} /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-10">
            <Outlet />
          </main>

          <Link
            to="/dashboard/create"
            className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            <Plus size={22} />
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
}

function NavItem({ to, label, icon: Icon, exact, collapsed }: any) {
  const loc = useLocation();
  const router = useRouter();
  const { user } = useAuth();

  const active = exact ? loc.pathname === to : loc.pathname.startsWith(to);

  const protectedPaths = [
    "/dashboard/create",
    "/dashboard/orders",
    "/dashboard/explore",
    "/dashboard/wallet",
    "/dashboard/tailors",
    "/dashboard/settings",
  ];

  const handleClick = (e: React.MouseEvent) => {
    if (!user && protectedPaths.some((p) => to.startsWith(p))) {
      e.preventDefault();
      router.navigate({ to: "/login" });
    }
  };

  const link = (
    <Link
      to={to}
      onClick={handleClick}
      className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all ${
        collapsed ? "justify-center px-2 py-3" : "px-3.5 py-2.5"
      } ${
        active
          ? "gradient-primary text-primary-foreground shadow-glow"
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon size={18} />
      {!collapsed && label}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
