import type { Metadata } from "next";

const fallbackUrl = "https://licomanagement.com";

export const siteConfig = {
  name: "Licomanagement",
  legalName: "Licomanagement Pvt. Ltd.",
  alternateNames: ["Lico Management", "Licomanagement Pvt Ltd"],
  url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackUrl).replace(/\/+$/, ""),
  title: "Licomanagement | School & Accounting Software in Nepal",
  description:
    "Licomanagement builds school management, accounting & POS, Nidhi, ERP and booking software for Nepali schools, shops and cooperatives, plus hosting and smart automation.",
  keywords: [
    "Licomanagement",
    "Lico Management",
    "school management software Nepal",
    "school management system Nepal",
    "accounting software Nepal",
    "POS software Nepal",
    "billing software Nepal",
    "Nidhi company software",
    "ERP software Nepal",
    "software company Butwal",
    "cloud hosting Nepal",
    "home automation Nepal",
    "security system Nepal",
  ],
  email: "sales@licomanagement.com",
  supportEmail: "support@licomanagement.com",
  phone: "+977 9847435894",
  address: {
    locality: "Butwal",
    region: "Lumbini",
    country: "NP",
  },
  logo: "/icons/icon-512.png",
  ogImage: {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Licomanagement — school, accounting and business software built in Nepal",
  },
  locale: "en_NP",
} as const;

export const indexableRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
} satisfies Metadata["robots"];

export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
} satisfies Metadata["robots"];

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export const structuredDataGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.legalName,
      alternateName: siteConfig.alternateNames,
      url: `${siteConfig.url}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteConfig.url}/#logo`,
        url: absoluteUrl(siteConfig.logo),
        contentUrl: absoluteUrl(siteConfig.logo),
        width: 512,
        height: 512,
        caption: "Licomanagement logo",
      },
      image: { "@id": `${siteConfig.url}/#logo` },
      description: siteConfig.description,
      email: siteConfig.email,
      telephone: siteConfig.phone.replace(/\s+/g, ""),
      foundingDate: "2019",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.address.locality,
        addressRegion: siteConfig.address.region,
        addressCountry: siteConfig.address.country,
      },
      areaServed: { "@type": "Country", name: "Nepal" },
      knowsAbout: [
        "School management system",
        "Accounting and POS software",
        "ERP software",
        "Nidhi and cooperative software",
        "Cloud hosting",
        "Home automation and security systems",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: siteConfig.email,
          telephone: siteConfig.phone.replace(/\s+/g, ""),
          areaServed: "NP",
          availableLanguage: ["en", "ne"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: `${siteConfig.url}/`,
      name: siteConfig.name,
      alternateName: siteConfig.alternateNames,
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "en",
    },
  ],
};
