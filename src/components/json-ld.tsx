// src/components/json-ld.tsx
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import {
  CHURCH_ADDRESS_LOCALITY,
  CHURCH_ADDRESS_REGION,
  CHURCH_ADDRESS_STREET,
  CHURCH_COUNTRY,
  CHURCH_EMAIL,
  CHURCH_LATITUDE_NUMBER,
  CHURCH_LONGITUDE_NUMBER,
  CHURCH_PHONE,
  CHURCH_POSTAL_CODE,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/site-config";

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
      streetAddress: CHURCH_ADDRESS_STREET,
      addressLocality: CHURCH_ADDRESS_LOCALITY,
      addressRegion: CHURCH_ADDRESS_REGION,
      postalCode: CHURCH_POSTAL_CODE,
      addressCountry: CHURCH_COUNTRY,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CHURCH_LATITUDE_NUMBER,
      longitude: CHURCH_LONGITUDE_NUMBER,
    },
    telephone: CHURCH_PHONE,
    email: CHURCH_EMAIL,
    sameAs: [YOUTUBE_CHANNEL_URL],
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
