import {
  FaChartLine,
  FaGraduationCap,
  FaUsers,
  FaCubes,
  FaCogs,
  FaLaptopCode,
  FaLightbulb,
  FaPaintBrush,
  FaCheckCircle,
  FaServer,
} from "react-icons/fa";
import { ServicePageTemplate } from "@/components/site/service-page-template";

export default function ItSoftwareDevelopmentPage() {
  return (
    <ServicePageTemplate
      eyebrow="IT & Software Development"
      title="Custom Software Built for Fintech, Education, CRM, and ERP"
      description="We design, build, and modernize business-ready software platforms — from Fintech and Educational Software to CRM, ERP, and other custom systems — on secure, cloud-native architecture."
      heroImage={{ src: "/hero-3d/software-solution.svg", alt: "3D software solution dashboard" }}
      ctaPrimary={{ href: "/support#ticket", label: "Request A Free Quote" }}
      ctaSecondary={{ href: "/trial", label: "Get Free Trial Now" }}
      highlightsEyebrow="Custom Software Development"
      highlightsTitle="Software Built Around Your Industry"
      highlightsDescription="From Fintech and Educational platforms to CRM, ERP, and other specialized systems, every build is architected for security, scale, and long-term ownership."
      highlights={[
        {
          icon: FaChartLine,
          title: "Fintech Software",
          desc: "Secure digital banking, payment processing, lending, and financial operations automation.",
          href: "/fin-tech-software",
        },
        {
          icon: FaGraduationCap,
          title: "Educational Software",
          desc: "Learning management systems, student portals, and digital classroom platforms.",
          href: "/education-solution",
        },
        {
          icon: FaUsers,
          title: "CRM Software",
          desc: "Lead tracking, sales pipelines, and customer relationship workflows tailored to your business.",
          href: "/support#ticket",
        },
        {
          icon: FaCubes,
          title: "ERP Software",
          desc: "Unified finance, inventory, HR, and operations management across your organization.",
          href: "/support#ticket",
        },
        {
          icon: FaCogs,
          title: "Business Automation",
          desc: "Workflow orchestration and process automation that removes manual, repetitive work.",
          href: "/automation-software",
        },
        {
          icon: FaLaptopCode,
          title: "Other Custom Software",
          desc: "Industry-specific platforms for healthcare, logistics, retail, and specialized operations.",
          href: "/support#ticket",
        },
      ]}
      processTitle="How We Build Your Software"
      processDescription="A structured delivery process that keeps every engagement transparent, secure, and business-ready from day one."
      processSteps={[
        {
          icon: FaLightbulb,
          title: "Discover & Plan",
          desc: "Requirements, scope, and architecture aligned to your business goals.",
        },
        {
          icon: FaPaintBrush,
          title: "Design UI/UX",
          desc: "Intuitive interfaces engineered for real workflows and real users.",
        },
        {
          icon: FaLaptopCode,
          title: "Develop & Integrate",
          desc: "Cloud-native builds with secure APIs and scalable backend services.",
        },
        {
          icon: FaCheckCircle,
          title: "Test & Secure",
          desc: "Rigorous QA and hardened security checks before every release.",
        },
        {
          icon: FaServer,
          title: "Deploy & Support",
          desc: "Managed rollout with long-term enhancement and release governance.",
        },
      ]}
      architectureTitle="Secure, Scalable Architecture"
      architectureDescription="Every custom platform we ship is built on cloud-native infrastructure with API-first integrations and long-term release governance."
      architectureTags={[
        "Cloud-Native Architecture",
        "API Integrations",
        "Scalable Backend Services",
        "UI/UX Engineering",
        "Release Governance",
      ]}
      ctaPanelTitle="Have A Software Idea?"
      ctaPanelDescription="Tell us about your Fintech, Education, CRM, ERP, or other custom software project and get a tailored delivery plan."
      ctaPanel={{ href: "/support#ticket", label: "Request A Free Quote" }}
    />
  );
}
