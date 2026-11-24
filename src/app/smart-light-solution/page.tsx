import {
  FaLightbulb,
  FaClock,
  FaMobileAlt,
  FaWalking,
  FaBolt,
  FaNetworkWired,
  FaClipboardList,
  FaPaintBrush,
  FaTools,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";
import { ServicePageTemplate } from "@/components/site/service-page-template";

export default function SmartLightSolutionPage() {
  return (
    <ServicePageTemplate
      eyebrow="Smart Light Solution"
      title="Automated Lighting Built for Comfort, Efficiency, and Control"
      description="We design programmable lighting systems with scene automation, remote control, and energy-smart optimization for every space."
      heroImage={{ src: "/hero-3d/smart-light.svg", alt: "3D smart light illustration" }}
      ctaPrimary={{ href: "/support#ticket", label: "Request A Free Quote" }}
      ctaSecondary={{ href: "/home-automation", label: "Explore Home Automation" }}
      highlightsEyebrow="Smart Lighting Solutions"
      highlightsTitle="Lighting Automation for Every Room and Routine"
      highlightsDescription="Every lighting deployment is scene-ready, sensor-aware, and built to integrate with your wider smart ecosystem."
      highlights={[
        {
          icon: FaLightbulb,
          title: "Scene-Based Lighting",
          desc: "Custom lighting scenes for mood, productivity, and occasions.",
          href: "/light-solution",
        },
        {
          icon: FaClock,
          title: "Schedule-Based Automation",
          desc: "Automated on/off and dimming schedules tuned to daily routines.",
          href: "/home-automation",
        },
        {
          icon: FaMobileAlt,
          title: "Remote & Voice Control",
          desc: "Control every light from your phone or voice assistant, anywhere.",
          href: "/support#ticket",
        },
        {
          icon: FaWalking,
          title: "Occupancy & Motion Sensing",
          desc: "Motion-aware lighting that responds automatically to presence.",
          href: "/smart-device",
        },
        {
          icon: FaBolt,
          title: "Energy Optimization",
          desc: "Reduce energy waste with occupancy-aware, efficient configurations.",
          href: "/support#ticket",
        },
        {
          icon: FaNetworkWired,
          title: "Smart Ecosystem Integration",
          desc: "Seamless integration with sensors, hubs, and home automation platforms.",
          href: "/home-automation",
        },
      ]}
      processTitle="How We Deliver Your Lighting System"
      processDescription="A guided rollout that keeps every scene, sensor, and control point working together."
      processSteps={[
        {
          icon: FaClipboardList,
          title: "Assess & Plan",
          desc: "Room-by-room review and lighting goals mapped to your space.",
        },
        {
          icon: FaPaintBrush,
          title: "Design Lighting Scenes",
          desc: "Scene and schedule design tailored to comfort and efficiency.",
        },
        {
          icon: FaTools,
          title: "Install & Configure",
          desc: "Professional installation of fixtures, sensors, and controls.",
        },
        {
          icon: FaCheckCircle,
          title: "Test & Calibrate",
          desc: "Fine-tuning of scenes, schedules, and sensor sensitivity.",
        },
        {
          icon: FaHeadset,
          title: "Support & Optimize",
          desc: "Ongoing support and optimization as your routines evolve.",
        },
      ]}
      architectureTitle="Reliable, Energy-Smart Lighting Infrastructure"
      architectureDescription="Every system is built on stable connectivity with energy-aware automation and open integration with your smart ecosystem."
      architectureTags={[
        "Scene Automation",
        "Voice & App Control",
        "Occupancy Sensing",
        "Energy Optimization",
        "Ecosystem Integration",
      ]}
      ctaPanelTitle="Ready to Automate Your Lighting?"
      ctaPanelDescription="Tell us about your space and get a tailored smart lighting plan."
      ctaPanel={{ href: "/support#ticket", label: "Request A Free Quote" }}
    />
  );
}
