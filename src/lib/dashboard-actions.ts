"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { staffRoles, type OrderStatus } from "@/lib/types";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({ full_name: String(formData.get("full_name") || "") })
    .eq("id", user.id);

  revalidatePath("/account/profile");
}

// Employees and super_admins: product management + read-only order access.
async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !staffRoles.includes(profile.role)) redirect("/account");

  return supabase;
}

// super_admin only: product deletion, order status updates, notification management.
async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  return supabase;
}

export async function createProduct(formData: FormData) {
  const supabase = await requireStaff();
  const imageUrl = String(formData.get("image_url") || "").trim();

  const payload: Record<string, unknown> = {
    category: String(formData.get("category") || ""),
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    sku: String(formData.get("sku") || ""),
    is_active: formData.get("is_active") === "on",
  };

  if (imageUrl) {
    payload.image_url = imageUrl;
  }

  const { error } = await supabase.from("products").insert(payload);
  if (error && error.message.includes("image_url")) {
    delete payload.image_url;
    await supabase.from("products").insert(payload);
  }

  revalidatePath("/admin/products");
  revalidatePath("/store");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await requireStaff();
  const imageUrl = String(formData.get("image_url") || "").trim();

  const payload: Record<string, unknown> = {
    category: String(formData.get("category") || ""),
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    sku: String(formData.get("sku") || ""),
    is_active: formData.get("is_active") === "on",
  };

  if (imageUrl) {
    payload.image_url = imageUrl;
  }

  const { error } = await supabase.from("products").update(payload).eq("id", productId);
  if (error && error.message.includes("image_url")) {
    delete payload.image_url;
    await supabase.from("products").update(payload).eq("id", productId);
  }

  revalidatePath("/admin/products");
  revalidatePath("/store");
  redirect("/admin/products");
}

export async function toggleProductStatus(formData: FormData) {
  const supabase = await requireStaff();
  const productId = String(formData.get("productId") || "");
  const currentStatus = formData.get("currentStatus") === "true";

  await supabase
    .from("products")
    .update({ is_active: !currentStatus })
    .eq("id", productId);

  revalidatePath("/admin/products");
  revalidatePath("/store");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await requireStaff();
  const productId = String(formData.get("productId") || "");

  // Try deleting product
  const { error } = await supabase.from("products").delete().eq("id", productId);

  // If deletion is restricted because of existing foreign key references (orders),
  // soft-delete (deactivate) so customer order history is preserved while hiding the item.
  if (error) {
    await supabase.from("products").update({ is_active: false }).eq("id", productId);
  }

  revalidatePath("/admin/products");
  revalidatePath("/store");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await requireSuperAdmin();
  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "") as OrderStatus;

  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/orders");
}

export async function markNotificationRead(formData: FormData) {
  const supabase = await createClient();
  const notificationId = String(formData.get("notificationId") || "");
  const path = String(formData.get("path") || "/account/notifications");

  await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId);
  revalidatePath(path);
}

export async function broadcastNotification(formData: FormData) {
  const supabase = await requireSuperAdmin();

  await supabase.from("notifications").insert({
    role_target: "customer",
    title: String(formData.get("title") || ""),
    body: String(formData.get("body") || ""),
  });

  revalidatePath("/admin/notifications");
}
