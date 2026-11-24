import { notFound } from "next/navigation";
import { InnerPage } from "@/components/site/inner-page";
import { PageShell } from "@/components/site/page-shell";

const copyBySlug: Record<
  string,
  {
    title: string;
    subtitle: string;
    points: string[];
  }
> = {
  "sage-hosting": {
    title: "Sage Hosting",
    subtitle: "Host Sage applications on a stable cloud foundation built for accounting workflows.",
    points: [
      "Improve team productivity with always-on remote access.",
      "Increase security posture with centralized data controls.",
      "Reduce infrastructure overhead with managed operations.",
      "Get expert support for Sage-centric deployment needs.",
    ],
  },
  "tax-software-hosting": {
    title: "Tax Software Hosting",
    subtitle: "Boost tax season throughput with cloud infrastructure optimized for demanding workloads.",
    points: [
      "Process more returns with high-performance virtual environments.",
      "Support secure collaboration between preparers and reviewers.",
      "Protect sensitive client data with layered safeguards.",
      "Scale resources during season peaks without downtime.",
    ],
  },
  "virtual-desktop-hosting": {
    title: "Virtual Desktop Hosting",
    subtitle: "Deliver a secure desktop workspace to every team member on any device.",
    points: [
      "Centralize data and application access in one controlled environment.",
      "Support hybrid teams while preserving policy enforcement.",
      "Improve continuity through backup and disaster readiness.",
      "Lower endpoint risk with server-side data management.",
    ],
  },
  resources: {
    title: "Resources",
    subtitle: "Explore practical guidance, best practices, and cloud insights for accounting firms.",
    points: [
      "Operational guides for secure cloud accounting workflows.",
      "Decision frameworks for choosing the right hosting model.",
      "Security and compliance checklists for finance teams.",
      "Updates on new tools, trends, and support resources.",
    ],
  },
  "data-security": {
    title: "Data Security",
    subtitle: "Security-first architecture protects your accounting systems, users, and data assets.",
    points: [
      "MFA, encryption, and strict access policies by design.",
      "Continuous monitoring and proactive threat mitigation.",
      "Automated backups and tested disaster recovery plans.",
      "Documented controls aligned with industry best practices.",
    ],
  },
  trial: {
    title: "Start Your Free Trial",
    subtitle: "Evaluate Licomanagement cloud performance and support with a guided onboarding experience.",
    points: [
      "No-obligation setup with support from cloud specialists.",
      "Validation of your software compatibility and workflows.",
      "Performance and security baseline assessment.",
      "Clear next-step recommendations after trial completion.",
    ],
  },
  "managed-it-services": {
    title: "Managed IT Services",
    subtitle: "Extend your internal team with expert management of cloud, security, and endpoint operations.",
    points: [
      "Proactive system administration and incident response.",
      "Patch, backup, and security policy lifecycle management.",
      "Vendor coordination and environment optimization.",
      "Performance reporting aligned with business goals.",
    ],
  },
  "our-vision-and-mission": {
    title: "Our Vision and Mission",
    subtitle: "Our vision is to simplify secure cloud operations for accounting businesses worldwide.",
    points: [
      "Deliver predictable and secure cloud experiences.",
      "Build long-term trust through service excellence.",
      "Enable growth with scalable infrastructure.",
      "Stay customer-centric in every product decision.",
    ],
  },
  blog: {
    title: "Blog",
    subtitle: "Stay updated with cloud hosting trends and accounting technology insights.",
    points: [
      "Cloud strategy and adoption best practices.",
      "Security explainers for accounting operations.",
      "Productivity guidance for distributed teams.",
      "Licomanagement platform and feature updates.",
    ],
  },
  article: {
    title: "Article Library",
    subtitle: "Reference documentation and step-by-step guides for your team.",
    points: [
      "How-to articles for platform setup and usage.",
      "Troubleshooting and operational runbooks.",
      "Security configuration recommendations.",
      "Deployment checklists for smoother onboarding.",
    ],
  },
  "data-centers": {
    title: "Data Centers",
    subtitle: "Enterprise-grade facilities ensure high availability, resilience, and compliance readiness.",
    points: [
      "Redundant power and network architecture.",
      "Continuous infrastructure monitoring and alerting.",
      "Geographic diversity for continuity planning.",
      "Operational standards designed for business-critical uptime.",
    ],
  },
  partners: {
    title: "Partners",
    subtitle: "Our partner ecosystem strengthens reliability, integration, and service outcomes.",
    points: [
      "Collaborative technology partnerships for stability.",
      "Integration-ready tools for accounting workflows.",
      "Shared quality standards and support excellence.",
      "Co-innovation to meet evolving client needs.",
    ],
  },
  "schedule-meeting": {
    title: "Schedule a Meeting",
    subtitle: "Book a strategy call with our team to design the right cloud roadmap for your firm.",
    points: [
      "Review your current infrastructure and workflows.",
      "Discuss security, compliance, and performance priorities.",
      "Get tailored architecture recommendations.",
      "Plan phased implementation with clear milestones.",
    ],
  },
  "fin-tech-software": {
    title: "Fin-Tech Software",
    subtitle: "We build secure fintech software platforms for digital banking, payment processing, lending, and financial operations automation.",
    points: [
      "Payment gateway and digital wallet integration with secure transaction controls.",
      "Loan and credit workflow automation with risk and compliance-ready processing.",
      "Financial analytics dashboards with real-time business intelligence insights.",
      "Scalable fintech architecture with strong data security and API interoperability.",
    ],
  },
  "education-solution": {
    title: "Education Solution",
    subtitle: "End-to-end education technology solutions for schools, universities, and training centers with modern digital learning workflows.",
    points: [
      "Learning management system implementation with course, class, and exam modules.",
      "Student information portals with attendance, grading, and fee workflow support.",
      "Parent, teacher, and admin collaboration tools for transparent communication.",
      "Scalable cloud-based architecture for high availability and secure educational data.",
    ],
  },
  "government-service-app": {
    title: "Government Service App",
    subtitle: "Robust government service applications designed to streamline citizen-facing services and public administration operations.",
    points: [
      "Citizen portal development for online applications, requests, and status tracking.",
      "Digital document management with workflow routing and approval automation.",
      "Role-based security, audit trails, and compliance-aligned access controls.",
      "Integration-ready architecture for inter-department data exchange and reporting.",
    ],
  },
  "automation-software": {
    title: "Automation Software",
    subtitle: "Intelligent automation software to digitize business processes, reduce manual workload, and improve operational efficiency.",
    points: [
      "Process automation for repetitive workflows across operations, HR, and finance.",
      "Business rule engines and trigger-based orchestration for consistent execution.",
      "Monitoring and reporting dashboards for measurable productivity improvements.",
      "Enterprise integration support to connect automation with existing business systems.",
    ],
  },
};

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = copyBySlug[slug];

  if (!content) {
    notFound();
  }

  return (
    <PageShell>
      <InnerPage
        title={content.title}
        subtitle={content.subtitle}
        points={content.points}
        cta={{ href: "/support#ticket", label: "Get Consultation" }}
      />
    </PageShell>
  );
}
