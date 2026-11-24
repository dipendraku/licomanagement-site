import { productCategories } from "./site-data";

export function getProductImage(product: { category: string; image_url?: string | null }): string {
  if (product.image_url && product.image_url.trim().length > 0) {
    return product.image_url;
  }

  const categoryMap: Record<string, string> = {
    "it-software-development": "/hero-3d/software-solution.svg",
    "smart-device": "/hero-3d/smart-device.svg",
    "smart-light-solution": "/hero-3d/smart-light.svg",
    "light-solution": "/hero-3d/light-solution.svg",
    "home-automation": "/hero-3d/home-automation.svg",
    "custome-security-setup": "/hero-3d/security-setup.svg",
    "saas-for-business": "/hero-3d/saas-business.svg",
  };

  return categoryMap[product.category] || "/hero-3d/software-solution.svg";
}

export function getCategoryLabel(slug: string): string {
  const match = productCategories.find((c) => c.slug === slug);
  return match ? match.label : slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
