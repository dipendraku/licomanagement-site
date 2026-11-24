import {
  FaWifi,
  FaLock,
  FaPlug,
  FaMicrophone,
  FaNetworkWired,
  FaHeadset,
  FaClipboardList,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa";
import { ServicePageTemplate } from "@/components/site/service-page-template";

export default function SmartDevicePage() {
  return (
    <ServicePageTemplate
      eyebrow="Smart Device"
      title="Connect and Manage Every Smart Device From One Platform"
      description="We deploy, integrate, and support intelligent devices for homes, offices, and commercial facilities with centralized, secure control."
      heroImage={{ src: "/hero-3d/smart-device.svg", alt: "3D smart device hub illustration" }}
      ctaPrimary={{ href: "/support#ticket", label: "Request A Free Quote" }}
      ctaSecondary={{ href: "/schedule-meeting", label: "Schedule Meeting" }}
      highlightsEyebrow="Smart Device Solutions"
      highlightsTitle="Devices Built for Reliable, Connected Control"
      highlightsDescription="From sensors to access devices, every deployment is configured for interoperability, security, and day-one reliability."
      highlights={[
        {
          icon: FaWifi,
          title: "Smart Sensors & Monitoring",
          desc: "Environmental, motion, and occupancy sensors for real-time facility insight.",
          href: "/home-automation",
        },
        {
          icon: FaLock,
          title: "Smart Locks & Access Devices",
          desc: "Keyless entry and access devices with centralized permission control.",
          href: "/custome-security-setup",
        },
        {
          icon: FaPlug,
          title: "Smart Plugs & Energy Devices",
          desc: "Remote-controlled outlets and energy monitoring for efficient operations.",
          href: "/home-automation",
        },
        {
          icon: FaMicrophone,
          title: "Voice & Remote Control Hubs",
          desc: "Unified hubs for voice, app, and remote device management.",
          href: "/home-automation",
        },
        {
          icon: FaNetworkWired,
          title: "Device Interoperability",
          desc: "Cross-platform integration so devices from different vendors work as one system.",
          href: "/support#ticket",
        },
        {
          icon: FaHeadset,
          title: "Monitoring & Support",
          desc: "Ongoing monitoring, firmware updates, and support for uninterrupted operations.",
          href: "/support#ticket",
        },
      ]}
      processTitle="How We Deploy Your Smart Devices"
      processDescription="A structured rollout that keeps every device secure, connected, and easy to manage."
      processSteps={[
        {
          icon: FaClipboardList,
          title: "Assess & Plan",
          desc: "Site survey and device selection aligned to your environment and goals.",
        },
        {
          icon: FaNetworkWired,
          title: "Design Network",
          desc: "Secure network and connectivity architecture for stable device performance.",
        },
        {
          icon: FaTools,
          title: "Install & Configure",
          desc: "Professional installation and configuration across all connected devices.",
        },
        {
          icon: FaCheckCircle,
          title: "Test & Calibrate",
          desc: "Validation of performance, automations, and failover behavior.",
        },
        {
          icon: FaHeadset,
          title: "Support & Monitor",
          desc: "Ongoing monitoring, updates, and responsive technical support.",
        },
      ]}
      architectureTitle="Secure, Interoperable Infrastructure"
      architectureDescription="Every deployment is built on hardened networks with centralized management and vendor-agnostic integration."
      architectureTags={[
        "Centralized Device Control",
        "Secure Network Design",
        "Cross-Platform Integration",
        "Firmware Management",
        "24x7 Monitoring",
      ]}
      ctaPanelTitle="Ready to Connect Your Devices?"
      ctaPanelDescription="Tell us about your facility and get a tailored smart device deployment plan."
      ctaPanel={{ href: "/support#ticket", label: "Request A Free Quote" }}
    />
  );
}
