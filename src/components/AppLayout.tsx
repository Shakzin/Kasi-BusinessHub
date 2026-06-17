import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,

  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  PanelLeft,


  Store,
} from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { Button } from "./ui/button";

const mainMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Building2, label: "My Businesses", path: "/businesses" },
  { icon: Calendar, label: "My Events", path: "/events" },
  { icon: CreditCard, label: "Subscription", path: "/subscription" },
];

const adminMenuItem = { icon: Shield, label: "Admin", path: "/admin" };

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAF8]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Store className="h-12 w-12 text-[#4F46E5]" />
          <p className="text-[#78716C] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <Store className="h-16 w-16 text-[#4F46E5]" />
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#1C1917]">Sign in to continue</h1>
            <p className="text-sm text-[#78716C] text-center">
              Access your dashboard to manage businesses and events.
            </p>
          </div>
          <Button
            onClick={() => { window.location.href = "/login"; }}
            size="lg"
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA]"
          >
            Sign In
          </Button>
          <Button
            variant="ghost"
            onClick={() => { window.location.href = "/"; }}
            className="text-[#4F46E5]"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}
    >
      <AppLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </AppLayoutContent>
    </SidebarProvider>
  );
}

function AppLayoutContent({
  children,
  setSidebarWidth,
}: {
  children: ReactNode;
  setSidebarWidth: (width: number) => void;
}) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r border-[#E7E5E4]">
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-3 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-[#F5F5F3] rounded-lg transition-colors"
              >
                <PanelLeft className="h-4 w-4 text-[#78716C]" />
              </button>
              {!isCollapsed && (
                <Link to="/dashboard" className="flex items-center gap-2 min-w-0">
                  <Store className="h-5 w-5 text-[#4F46E5]" />
                  <span className="font-semibold text-[#1C1917] tracking-tight truncate text-sm">
                    Kasi BusinessHub
                  </span>
                </Link>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 px-2 py-2">
            <SidebarMenu className="gap-1">
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.path)}
                      tooltip={item.label}
                      className={`h-10 transition-all ${
                        isActive
                          ? "bg-[#EEF2FF] text-[#4F46E5] font-medium"
                          : "text-[#57534E] hover:bg-[#F5F5F3]"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-[#E7E5E4]">
                <p className="px-3 mb-2 text-[10px] uppercase tracking-wider text-[#A8A29E] font-medium hidden group-data-[state=collapsed]:hidden">
                  Admin
                </p>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={location.pathname === adminMenuItem.path}
                      onClick={() => navigate(adminMenuItem.path)}
                      tooltip={adminMenuItem.label}
                      className={`h-10 transition-all ${
                        location.pathname === adminMenuItem.path
                          ? "bg-[#EEF2FF] text-[#4F46E5] font-medium"
                          : "text-[#57534E] hover:bg-[#F5F5F3]"
                      }`}
                    >
                      <adminMenuItem.icon className="h-4 w-4" />
                      <span>{adminMenuItem.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            )}
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-[#E7E5E4]">
            <SidebarMenu className="gap-1 mb-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/settings")}
                  tooltip="Settings"
                  className="h-10 text-[#57534E] hover:bg-[#F5F5F3]"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#F5F5F3] transition-colors w-full text-left">
                  <Avatar className="h-8 w-8 border shrink-0">
                    <AvatarFallback className="text-xs font-medium bg-[#EEF2FF] text-[#4F46E5]">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-[#1C1917]">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-[#A8A29E] truncate">
                        {user?.email || "Member"}
                      </p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-[#DC2626] focus:text-[#DC2626]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {!isCollapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#4F46E5]/20 transition-colors"
            onMouseDown={() => setIsResizing(true)}
            style={{ zIndex: 50 }}
          />
        )}
      </div>

      <SidebarInset className="bg-[#FAFAF8]">
        <main className="flex-1 p-6 min-h-screen">{children}</main>
      </SidebarInset>
    </>
  );
}
