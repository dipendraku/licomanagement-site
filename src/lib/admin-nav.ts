import type { ProfileRole } from "@/lib/types";

export type AdminNavItem = {
  group: "Overview" | "Store" | "People" | "Engagement" | "System";
  label: string;
  href: string;
  superAdminOnly?: boolean;
};

export const ADMIN_NAV_GROUPS = ["Overview", "Store", "People", "Engagement", "System"] as const;

const ADMIN_NAV: AdminNavItem[] = [
  { group: "Overview", label: "Dashboard", href: "/admin" },
  { group: "Store", label: "Product Management", href: "/admin/products" },
  { group: "Store", label: "Pricing & Offers", href: "/admin/pricing", superAdminOnly: true },
  { group: "Store", label: "Orders & Payments", href: "/admin/orders" },
  { group: "People", label: "Customer Management", href: "/admin/customers" },
  { group: "People", label: "Users & Roles", href: "/admin/users", superAdminOnly: true },
  { group: "Engagement", label: "Notifications & Marketing", href: "/admin/notifications", superAdminOnly: true },
  { group: "System", label: "Settings", href: "/admin/settings", superAdminOnly: true },
  { group: "System", label: "My Profile", href: "/account/profile" },
];

export function adminNavFor(role: ProfileRole): AdminNavItem[] {
  return ADMIN_NAV.filter((item) => !item.superAdminOnly || role === "super_admin");
}
