import {
  FaDraftingCompass,
  FaClipboardList,
  FaLightbulb,
  FaSlidersH,
  FaLeaf,
  FaTools,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";
import { ServicePageTemplate } from "@/components/site/service-page-template";

export default function LightSolutionPage() {
  return (
    <ServicePageTemplate
      eyebrow="Light Solution"
      title="Complete Lighting Consultation, Setup, and Optimization"
      description="From design to installation, we deliver lighting solutions engineered for function, aesthetics, and long-term performance."
      heroImage={{ src: "/hero-3d/light-solution.svg", alt: "3D lighting solution illustration" }}
      ctaPrimary={{ href: "/support#ticket", label: "Request A Free Quote" }}
      ctaSecondary={{ href: "/smart-light-solution", label: "Explore Smart Lighting" }}
      highlightsEyebrow="Lighting Services"
      highlightsTitle="Lighting Designed for Function and Aesthetics"
      highlightsDescription="Every engagement covers design, sourcing, installation, and long-term care so your lighting performs as well as it looks."
      highlights={[
        {
          icon: FaDraftingCompass,
          title: "Lighting Design Consultation",
          desc: "Expert guidance on layout, fixtures, and ambiance for every space.",
          href: "/support#ticket",
        },
        {
          icon: FaClipboardList,
          title: "Installation Planning",
          desc: "Detailed planning that minimizes disruption and rework.",
          href: "/support#ticket",
        },
        {
          icon: FaLightbulb,
          title: "Fixture & Device Selection",
          desc: "Curated fixture and device recommendations matched to your needs.",
          href: "/smart-light-solution",
        },
        {
          icon: FaSlidersH,
          title: "Adaptive Dimming Controls",
          desc: "Flexible controls tuned for productivity, comfort, and mood.",
          href: "/smart-light-solution",
        },
        {
          icon: FaLeaf,
          title: "Energy-Efficient Retrofits",
          desc: "Upgrade existing lighting for lower costs and better performance.",
          href: "/support#ticket",
        },
        {
          icon: FaTools,
          title: "Maintenance & Support",
          desc: "Ongoing maintenance and enhancement support after installation.",
          href: "/support#ticket",
        },
      ]}
      processTitle="How We Deliver Your Lighting Project"
      processDescription="A clear, structured path from first consultation to long-term maintenance."
      processSteps={[
        {
          icon: FaDraftingCompass,
          title: "Consult & Design",
          desc: "On-site consultation and lighting design aligned to your space.",
        },
        {
          icon: FaClipboardList,
          title: "Plan Installation",
          desc: "Fixture selection and installation planning with minimal disruption.",
        },
        {
          icon: FaTools,
          title: "Install & Configure",
          desc: "Professional installation and controls configuration.",
        },
        {
          icon: FaCheckCircle,
          title: "Test & Fine-Tune",
          desc: "Adjustment of brightness, dimming, and adaptive controls.",
        },
        {
          icon: FaHeadset,
          title: "Maintain & Support",
          desc: "Ongoing maintenance and enhancement as your needs change.",
        },
      ]}
      architectureTitle="Lighting Built to Last"
      architectureDescription="Every project balances design intent with efficient, serviceable infrastructure for years of reliable use."
      architectureTags={[
        "Design Consultation",
        "Fixture Selection",
        "Adaptive Controls",
        "Energy-Efficient Retrofits",
        "Maintenance Support",
      ]}
      ctaPanelTitle="Ready to Upgrade Your Lighting?"
      ctaPanelDescription="Tell us about your space and get a tailored lighting consultation."
      ctaPanel={{ href: "/support#ticket", label: "Request A Free Quote" }}
    />
  );
}
