export type ProfileRole = "customer" | "employee" | "super_admin";
export const staffRoles: ProfileRole[] = ["employee", "super_admin"];

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
};

export type Product = {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  is_active: boolean;
  image_url?: string | null;
  created_at: string;
};

export type OrderType = "request" | "buy";
export type OrderStatus = "pending" | "contacted" | "confirmed" | "cancelled" | "completed";

export type Order = {
  id: string;
  user_id: string;
  product_id: string;
  type: OrderType;
  status: OrderStatus;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
  products?: Pick<Product, "id" | "name" | "category" | "price" | "slug">;
};

export type NotificationTarget = "admin" | "customer";

export type Notification = {
  id: string;
  user_id: string | null;
  role_target: NotificationTarget | null;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};
