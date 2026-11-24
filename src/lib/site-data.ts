export type NavItem = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

export type ProductCategory = {
  label: string;
  slug: string;
};

export const productCategories: ProductCategory[] = [
  { label: "IT & Software Development", slug: "it-software-development" },
  { label: "Smart Device", slug: "smart-device" },
  { label: "Smart Light Solution", slug: "smart-light-solution" },
  { label: "Light Solution", slug: "light-solution" },
  { label: "Home Automation", slug: "home-automation" },
  { label: "Custome Security Setup", slug: "custome-security-setup" },
  { label: "Saas For Business", slug: "saas-for-business" },
];

export const mainNav: NavItem[] = [
  {
    label: "Service We do",
    children: [
      { label: "IT & Software Development", href: "/it-software-development" },
      { label: "Smart Device", href: "/smart-device" },
      { label: "Smart Light Solution", href: "/smart-light-solution" },
      { label: "Light Solution", href: "/light-solution" },
      { label: "Home Automation", href: "/home-automation" },
      { label: "Custome Security Setup", href: "/custome-security-setup" },
      { label: "Saas For Business", href: "/saas-for-business" },
    ],
  },
  {
    label: "Our Store",
    href: "/store",
    children: [
      { label: "All Products (Store)", href: "/store" },
      ...productCategories.map((category) => ({ label: category.label, href: `/store?category=${category.slug}` })),
    ],
  },
  {
    label: "Support",
    children: [
      { label: "Email Support", href: "/support#email" },
      { label: "Call", href: "/support#call" },
      { label: "Support Ticket", href: "/support#ticket" },
      { label: "Contact Us", href: "/support#contact" },
    ],
  },
  { label: "About Us", href: "/about-us" },
];

export const footerColumns = [
  {
    title: "Service We do",
    links: [
      { label: "IT & Software Development", href: "/it-software-development" },
      { label: "Smart Device", href: "/smart-device" },
      { label: "Smart Light Solution", href: "/smart-light-solution" },
      { label: "Home Automation", href: "/home-automation" },
      { label: "Saas For Business", href: "/saas-for-business" },
    ],
  },
  {
    title: "About & Company",
    links: [
      { label: "Vision and Mission", href: "/our-vision-and-mission" },
      { label: "About Us", href: "/about-us" },
      { label: "Partners", href: "/partners" },
      { label: "Data Security", href: "/data-security" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Email Support", href: "/support#email" },
      { label: "Call", href: "/support#call" },
      { label: "Support Ticket", href: "/support#ticket" },
      { label: "Contact Us", href: "/support#contact" },
    ],
  },
  {
    title: "Quick Access",
    links: [
      { label: "Our Store", href: "/store" },
      { label: "Support", href: "/support" },
      { label: "Data Centers", href: "/data-centers" },
      { label: "Schedule Meeting", href: "/schedule-meeting" },
    ],
  },
];

export const trustStats = [
  { value: "15000+", label: "Customers Supported" },
  { value: "15+", label: "Years of Experience" },
  { value: "500+", label: "Applications Hosted" },
  { value: "99.99%", label: "Platform Uptime" },
];

export const solutionCards = [
  {
    title: "Fin-Tech Software",
    desc: "Custom fintech software development for digital payments, lending workflows, transaction security, and real-time financial analytics.",
    href: "/fin-tech-software",
  },
  {
    title: "Education Solution",
    desc: "Scalable education software solutions for schools and institutes, including LMS integration, student portals, attendance, and assessment automation.",
    href: "/education-solution",
  },
  {
    title: "Government Service App",
    desc: "Secure government service app development for citizen services, document workflows, public portals, and compliance-ready digital operations.",
    href: "/government-service-app",
  },
  {
    title: "Automation Software",
    desc: "Business automation software for process optimization, workflow orchestration, operational visibility, and productivity-driven digital transformation.",
    href: "/automation-software",
  },
];

export const features = [
  {
    title: "Data Security",
    desc: "End-to-end protection with role-based access, monitoring, backup, and disaster recovery.",
  },
  {
    title: "5 Minute Response",
    desc: "Fast support with real specialists for accounting software and cloud environments.",
  },
  {
    title: "Customizable Platform",
    desc: "Support for major accounting, tax, and business applications across all devices.",
  },
  {
    title: "24x7 Assistance",
    desc: "Round-the-clock technical help to keep your operation productive and uninterrupted.",
  },
];

export type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  frameImage: { src: string; alt: string };
};

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Connected Living",
    title: "Smart Home Automation Designed for Security and Comfort",
    description:
      "Control devices, lighting, and security from one intelligent ecosystem built for modern homes and offices.",
    ctaPrimary: { label: "Explore Home Automation", href: "/home-automation" },
    ctaSecondary: { label: "Request A Free Quote", href: "/support#ticket" },
    frameImage: { src: "/hero-3d/home-automation.svg", alt: "3D home automation illustration" },
  },
  {
    eyebrow: "Software Solution",
    title: "Build Scalable Software Platforms for Real Business Growth",
    description:
      "From architecture to deployment, we deliver secure and maintainable software solutions tailored to your operations.",
    ctaPrimary: { label: "View Software Services", href: "/it-software-development" },
    ctaSecondary: { label: "Request A Free Quote", href: "/support#ticket" },
    frameImage: { src: "/hero-3d/software-solution.svg", alt: "3D software solution dashboard" },
  },
  {
    eyebrow: "SaaS For Business",
    title: "Launch and Scale SaaS Products with Confidence",
    description:
      "Accelerate product delivery with secure multi-tenant architecture, billing integration, and performance-first operations.",
    ctaPrimary: { label: "Explore SaaS Solutions", href: "/saas-for-business" },
    ctaSecondary: { label: "Schedule Meeting", href: "/schedule-meeting" },
    frameImage: { src: "/hero-3d/saas-business.svg", alt: "3D SaaS cloud infrastructure" },
  },
  {
    eyebrow: "Smart Lighting",
    title: "3D-Ready Smart Light Solutions for Modern Spaces",
    description:
      "Design dynamic lighting scenes with remote control, automation rules, and energy-smart optimization for every room.",
    ctaPrimary: { label: "Discover Smart Light", href: "/smart-light-solution" },
    ctaSecondary: { label: "Talk To Expert", href: "/support#contact" },
    frameImage: { src: "/hero-3d/smart-light.svg", alt: "3D smart light setup" },
  },
];
