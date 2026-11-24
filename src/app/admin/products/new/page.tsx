import { ProductForm } from "@/components/dashboard/product-form";
import { createProduct } from "@/lib/dashboard-actions";

export default function NewProductPage() {
  return <ProductForm action={createProduct} submitLabel="Create Product" />;
}
