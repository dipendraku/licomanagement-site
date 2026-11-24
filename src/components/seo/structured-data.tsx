import { structuredDataGraph } from "@/lib/seo";

export function StructuredData() {
  const json = JSON.stringify(structuredDataGraph).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
