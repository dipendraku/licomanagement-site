import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/marketing/catalog";
import { LEGAL_LINKS } from "@/lib/marketing/legal";
import { siteConfig } from "@/lib/seo";
import { productCategories } from "@/lib/site-data";

const contentSlugs = [
  "sage-hosting",
  "tax-software-hosting",
  "virtual-desktop-hosting",
  "resources",
  "data-security",
  "trial",
  "managed-it-services",
  "our-vision-and-mission",
  "blog",
  "article",
  "data-centers",
  "partners",
  "schedule-meeting",
  "fin-tech-software",
  "education-solution",
  "government-service-app",
  "automation-software",
];

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const entries: Entry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "monthly" },
  { path: "/store", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about-us", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/support", priority: 0.7, changeFrequency: "monthly" },
  { path: "/quickbooks-hosting", priority: 0.8, changeFrequency: "monthly" },
  { path: "/it-software-development", priority: 0.8, changeFrequency: "monthly" },
  { path: "/smart-device", priority: 0.8, changeFrequency: "monthly" },
  { path: "/smart-light-solution", priority: 0.8, changeFrequency: "monthly" },
  { path: "/light-solution", priority: 0.8, changeFrequency: "monthly" },
  { path: "/home-automation", priority: 0.8, changeFrequency: "monthly" },
  { path: "/custome-security-setup", priority: 0.8, changeFrequency: "monthly" },
  { path: "/saas-for-business", priority: 0.8, changeFrequency: "monthly" },
  ...productCategories.map((category) => ({
    path: `/products/${category.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  ...PRODUCTS.map((product) => ({
    path: `/catalog/${product.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  })),
  ...contentSlugs.map((slug) => ({
    path: `/${slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  })),
  ...LEGAL_LINKS.map((doc) => ({
    path: `/legal/${doc.slug}`,
    priority: 0.3,
    changeFrequency: "yearly" as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return entries.map((entry) => ({
    url: `${siteConfig.url}${entry.path === "/" ? "/" : entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
