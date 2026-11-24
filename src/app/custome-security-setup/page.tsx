import {
  FaVideo,
  FaKey,
  FaBell,
  FaDesktop,
  FaShieldAlt,
  FaClipboardCheck,
  FaClipboardList,
  FaDraftingCompass,
  FaTools,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";
import { ServicePageTemplate } from "@/components/site/service-page-template";

export default function CustomeSecuritySetupPage() {
  return (
    <ServicePageTemplate
      eyebrow="Custome Security Setup"
      title="Tailored Security Architectures That Protect What Matters"
      description="We design custom surveillance, access control, and monitoring systems that protect people, assets, and operations around the clock."
      heroImage={{ src: "/hero-3d/security-setup.svg", alt: "3D security shield illustration" }}
      ctaPrimary={{ href: "/support#ticket", label: "Request A Free Quote" }}
      ctaSecondary={{ href: "/home-automation", label: "Explore Home Automation" }}
      highlightsEyebrow="Security Solutions"
      highlightsTitle="Security Designed Around Your Facility"
      highlightsDescription="From surveillance to access control, every system is custom-configured for your layout, risk profile, and compliance needs."
      highlights={[
        {
          icon: FaVideo,
          title: "Surveillance Systems",
          desc: "CCTV and video monitoring systems tuned to your facility's layout.",
          href: "/support#ticket",
        },
        {
          icon: FaKey,
          title: "Access Control",
          desc: "Keyless entry and permission-based access across every entry point.",
          href: "/smart-device",
        },
        {
          icon: FaBell,
          title: "Intrusion & Alarm Systems",
          desc: "Real-time alerting for unauthorized access and unusual activity.",
          href: "/support#ticket",
        },
        {
          icon: FaDesktop,
          title: "Real-Time Monitoring",
          desc: "Live monitoring with defined escalation workflows for incidents.",
          href: "/support#ticket",
        },
        {
          icon: FaShieldAlt,
          title: "Network & Device Hardening",
          desc: "Security best practices applied across your connected devices and network.",
          href: "/data-security",
        },
        {
          icon: FaClipboardCheck,
          title: "Audit-Ready Policies",
          desc: "Documented, compliance-ready security policies and procedures.",
          href: "/support#ticket",
        },
      ]}
      processTitle="How We Deliver Your Security Setup"
      processDescription="A structured rollout that keeps every camera, sensor, and policy working as one system."
      processSteps={[
        {
          icon: FaClipboardList,
          title: "Assess & Plan",
          desc: "Risk assessment and security planning mapped to your facility.",
        },
        {
          icon: FaDraftingCompass,
          title: "Design Security Layout",
          desc: "Coverage design for surveillance, access points, and alerting.",
        },
        {
          icon: FaTools,
          title: "Install & Configure",
          desc: "Professional installation of cameras, locks, and alarm systems.",
        },
        {
          icon: FaCheckCircle,
          title: "Test & Calibrate",
          desc: "Validation of coverage, sensitivity, and alert escalation paths.",
        },
        {
          icon: FaHeadset,
          title: "Monitor & Support",
          desc: "Ongoing monitoring, maintenance, and responsive support.",
        },
      ]}
      architectureTitle="Hardened, Audit-Ready Security Infrastructure"
      architectureDescription="Every deployment combines physical security with hardened networks and documented, compliance-ready controls."
      architectureTags={[
        "Surveillance & Access Control",
        "Real-Time Alerting",
        "Network Hardening",
        "Escalation Workflows",
        "Audit-Ready Policies",
      ]}
      ctaPanelTitle="Ready to Secure Your Facility?"
      ctaPanelDescription="Tell us about your site and get a tailored security setup plan."
      ctaPanel={{ href: "/support#ticket", label: "Request A Free Quote" }}
    />
  );
}
