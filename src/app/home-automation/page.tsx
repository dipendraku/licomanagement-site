import {
  FaLightbulb,
  FaThermometerHalf,
  FaTv,
  FaShieldAlt,
  FaMobileAlt,
  FaBolt,
  FaClipboardList,
  FaPaintBrush,
  FaTools,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";
import { ServicePageTemplate } from "@/components/site/service-page-template";

export default function HomeAutomationPage() {
  return (
    <ServicePageTemplate
      eyebrow="Home Automation"
      title="Turn Your Home Into an Intelligent, Connected Environment"
      description="We unify lighting, climate, entertainment, and security into one seamless automation experience built around your routines."
      heroImage={{ src: "/hero-3d/home-automation.svg", alt: "3D home automation illustration" }}
      ctaPrimary={{ href: "/support#ticket", label: "Request A Free Quote" }}
      ctaSecondary={{ href: "/smart-device", label: "Explore Smart Devices" }}
      highlightsEyebrow="Home Automation Solutions"
      highlightsTitle="One Ecosystem for Every Room"
      highlightsDescription="From daily routines to energy savings, every automation is designed around how your household actually lives."
      highlights={[
        {
          icon: FaLightbulb,
          title: "Lighting Automation",
          desc: "Scene and schedule-based lighting across every room.",
          href: "/smart-light-solution",
        },
        {
          icon: FaThermometerHalf,
          title: "Climate Control",
          desc: "Automated heating and cooling for year-round comfort and efficiency.",
          href: "/support#ticket",
        },
        {
          icon: FaTv,
          title: "Entertainment Systems",
          desc: "Unified control for audio, video, and streaming across every room.",
          href: "/support#ticket",
        },
        {
          icon: FaShieldAlt,
          title: "Security Integration",
          desc: "Connected surveillance, alarms, and access control in one system.",
          href: "/custome-security-setup",
        },
        {
          icon: FaMobileAlt,
          title: "Voice & App Control",
          desc: "Manage your entire home from your phone or voice assistant.",
          href: "/smart-device",
        },
        {
          icon: FaBolt,
          title: "Energy Management",
          desc: "Smarter energy usage through automation-driven efficiency.",
          href: "/support#ticket",
        },
      ]}
      processTitle="How We Automate Your Home"
      processDescription="A structured rollout that turns individual devices into one dependable, connected home."
      processSteps={[
        {
          icon: FaClipboardList,
          title: "Assess & Plan",
          desc: "Walkthrough of your home and automation goals room by room.",
        },
        {
          icon: FaPaintBrush,
          title: "Design Automation",
          desc: "Routines and scenes designed around daily convenience.",
        },
        {
          icon: FaTools,
          title: "Install & Configure",
          desc: "Professional installation of devices, hubs, and controls.",
        },
        {
          icon: FaCheckCircle,
          title: "Test & Calibrate",
          desc: "Validation of routines, triggers, and remote access.",
        },
        {
          icon: FaHeadset,
          title: "Support & Expand",
          desc: "Ongoing support with room to add devices as needs grow.",
        },
      ]}
      architectureTitle="Scalable, Secure Home Infrastructure"
      architectureDescription="Every setup is built on a secure network foundation with room to expand as your household's needs grow."
      architectureTags={[
        "Unified Device Control",
        "Routine Automation",
        "Mobile & Voice Access",
        "Scalable Setup",
        "24x7 Support",
      ]}
      ctaPanelTitle="Ready for a Smarter Home?"
      ctaPanelDescription="Tell us about your home and get a tailored automation plan."
      ctaPanel={{ href: "/support#ticket", label: "Request A Free Quote" }}
    />
  );
}
