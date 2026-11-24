import {
  FaLayerGroup,
  FaCreditCard,
  FaUsers,
  FaChartBar,
  FaSyncAlt,
  FaShieldAlt,
  FaLightbulb,
  FaDraftingCompass,
  FaLaptopCode,
  FaCheckCircle,
  FaRocket,
} from "react-icons/fa";
import { ServicePageTemplate } from "@/components/site/service-page-template";

export default function SaasForBusinessPage() {
  return (
    <ServicePageTemplate
      eyebrow="SaaS For Business"
      title="Launch and Scale SaaS Products With Confidence"
      description="We architect multi-tenant SaaS platforms with billing integration, observability, and uptime-focused operations built in from day one."
      heroImage={{ src: "/hero-3d/saas-business.svg", alt: "3D SaaS cloud infrastructure illustration" }}
      ctaPrimary={{ href: "/support#ticket", label: "Request A Free Quote" }}
      ctaSecondary={{ href: "/schedule-meeting", label: "Schedule Meeting" }}
      highlightsEyebrow="SaaS Solutions"
      highlightsTitle="Platforms Engineered to Scale With You"
      highlightsDescription="From first tenant to enterprise scale, every layer is architected for reliability, revenue, and growth."
      highlights={[
        {
          icon: FaLayerGroup,
          title: "Multi-Tenant Architecture",
          desc: "Tenant isolation and high-availability infrastructure built to scale.",
          href: "/it-software-development",
        },
        {
          icon: FaCreditCard,
          title: "Subscription & Billing",
          desc: "Integrated billing, plans, and payment workflows for recurring revenue.",
          href: "/support#ticket",
        },
        {
          icon: FaUsers,
          title: "Customer Lifecycle Management",
          desc: "Onboarding, retention, and account workflows tailored to SaaS growth.",
          href: "/support#ticket",
        },
        {
          icon: FaChartBar,
          title: "Analytics & Observability",
          desc: "Real-time usage analytics and monitoring foundations for product decisions.",
          href: "/support#ticket",
        },
        {
          icon: FaSyncAlt,
          title: "CI/CD & Uptime Operations",
          desc: "Continuous deployment pipelines with uptime-focused operations.",
          href: "/managed-it-services",
        },
        {
          icon: FaShieldAlt,
          title: "Security & Compliance",
          desc: "Data protection and compliance-ready controls across your platform.",
          href: "/data-security",
        },
      ]}
      processTitle="How We Build Your SaaS Platform"
      processDescription="A structured delivery process that takes your product from architecture to a scalable, live release."
      processSteps={[
        {
          icon: FaLightbulb,
          title: "Discover & Plan",
          desc: "Product scope, tenancy model, and growth goals defined upfront.",
        },
        {
          icon: FaDraftingCompass,
          title: "Design Architecture",
          desc: "Multi-tenant architecture and integrations mapped to your roadmap.",
        },
        {
          icon: FaLaptopCode,
          title: "Develop & Integrate",
          desc: "Billing, auth, and core product features built and integrated.",
        },
        {
          icon: FaCheckCircle,
          title: "Test & Secure",
          desc: "Load testing, security review, and compliance validation.",
        },
        {
          icon: FaRocket,
          title: "Deploy & Scale",
          desc: "Managed launch with CI/CD pipelines and uptime-focused operations.",
        },
      ]}
      architectureTitle="Built for Growth From Day One"
      architectureDescription="Every SaaS platform we ship is engineered for tenant isolation, continuous delivery, and compliance-ready operations."
      architectureTags={[
        "Multi-Tenant Architecture",
        "Billing Integration",
        "Observability",
        "CI/CD Pipelines",
        "Compliance-Ready Security",
      ]}
      ctaPanelTitle="Have a SaaS Idea?"
      ctaPanelDescription="Tell us about your product and get a tailored SaaS delivery plan."
      ctaPanel={{ href: "/support#ticket", label: "Request A Free Quote" }}
    />
  );
}
