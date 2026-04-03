// src/components/json-ld.tsx
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

interface JsonLdProps {
  data: Record<string, unknown>;
}

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ChurchJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/church_logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "경수대로425 지하1층(나인아트홀)",
      addressLocality: "수원시",
      addressRegion: "경기도",
      postalCode: "16490",
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.2642526267482,
      longitude: 127.025125618372,
    },
    telephone: "010-5252-8580",
    email: "timothy35@hanmail.net",
    sameAs: [
      "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C",
    ],
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };

  return <JsonLd data={data} />;
}
