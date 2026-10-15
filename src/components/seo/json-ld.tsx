interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name = "Finergetics Consulting Limited",
  url = "https://www.finergetics.com",
  logo = "https://www.finergetics.com/logo-blue.png",
  email = "info@finergetics.com",
  phone = "+234 803 754 1083",
  address = "Lagos, Nigeria",
  sameAs = [],
}: OrganizationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "customer service",
        email,
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: address,
      addressCountry: "NG",
    },
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD structured schema
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface PersonJsonLdProps {
  name: string;
  role: string;
  credentials?: string | null;
  bio?: string | null;
  url?: string;
  sameAs?: string[];
}

export function PersonJsonLd({
  name,
  role,
  credentials,
  bio,
  url,
  sameAs = [],
}: PersonJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: credentials ? `${role} (${credentials})` : role,
    description: bio || undefined,
    url,
    worksFor: {
      "@type": "Organization",
      name: "Finergetics Consulting Limited",
      url: "https://www.finergetics.com",
    },
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD structured schema
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished?: Date | string | null;
  dateModified?: Date | string | null;
  authorName?: string | null;
  imageUrl?: string | null;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "Finergetics Advisory",
  imageUrl,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: datePublished
      ? new Date(datePublished).toISOString()
      : undefined,
    dateModified: dateModified
      ? new Date(dateModified).toISOString()
      : datePublished
        ? new Date(datePublished).toISOString()
        : undefined,
    author: {
      "@type": "Person",
      name: authorName || "Finergetics Advisory",
    },
    publisher: {
      "@type": "Organization",
      name: "Finergetics Consulting Limited",
      url: "https://www.finergetics.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.finergetics.com/logo-blue.png",
      },
    },
    image: imageUrl || undefined,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD structured schema
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD structured schema
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
