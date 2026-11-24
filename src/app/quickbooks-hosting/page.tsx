import { InnerPage } from "@/components/site/inner-page";
import { PageShell } from "@/components/site/page-shell";

export default function QuickBooksHostingPage() {
  return (
    <PageShell>
      <InnerPage
        title="QuickBooks Hosting"
        subtitle="Access QuickBooks Desktop from any location with enterprise-grade performance, security, and uptime."
        cta={{ href: "/pricing", label: "Check Pricing & Plan" }}
        points={[
          "Enable secure multi-user collaboration for your accounting team and clients.",
          "Reduce local IT complexity with managed backups, patching, and monitoring.",
          "Maintain compliance and data integrity with hardened cloud infrastructure.",
          "Scale from small teams to enterprise operations without service disruption.",
        ]}
      />
    </PageShell>
  );
}
