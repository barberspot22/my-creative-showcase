import { siteUrl } from "@/lib/site";

export const ORG_ID = `${siteUrl()}/#organization`;
export const WEBSITE_ID = `${siteUrl()}/#website`;

export const ORG_NAME = "GB IA";
export const ORG_PHONE = "+55 27 98867-3309";

type Json = Record<string, unknown>;

/** Bloco JSON-LD pronto para o `scripts` do head() do TanStack Router. */
export function ldScript(data: Json | Json[]) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: ORG_NAME,
    alternateName: "GB Inteligência Artificial",
    url: siteUrl(),
    logo: siteUrl("/favicon-gb.png"),
    image: siteUrl("/og-gb-ia.jpg"),
    description:
      "GB IA cria sistemas sob medida, sites, e-commerces, CRMs, catálogos e cardápios digitais, automações e agentes de IA autônoma para empresas.",
    telephone: ORG_PHONE,
    priceRange: "$$",
    areaServed: [
      { "@type": "Country", name: "Brasil" },
      { "@type": "State", name: "Espírito Santo" },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressRegion: "ES",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: ORG_PHONE,
        availableLanguage: ["Portuguese"],
        areaServed: "BR",
      },
    ],
    knowsAbout: [
      "Inteligência artificial aplicada a negócios",
      "Agentes de IA autônoma",
      "Automação de processos",
      "Desenvolvimento de sistemas sob medida",
      "Sites institucionais e páginas de vendas",
      "E-commerce e catálogos digitais",
      "Cardápio digital para restaurantes",
      "CRM e automação comercial",
      "Social media com IA",
    ],
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteUrl(),
    name: ORG_NAME,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: siteUrl(opts.path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Brasil" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: siteUrl(opts.path),
      servicePhone: ORG_PHONE,
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Head padrão de uma página de serviço: Service + BreadcrumbList (+ FAQ opcional). */
export function servicePageLd(opts: {
  name: string;
  breadcrumbName: string;
  description: string;
  path: string;
  serviceType: string;
  faq?: { question: string; answer: string }[];
}) {
  const blocks: Json[] = [
    serviceSchema(opts),
    breadcrumbSchema([
      { name: "Início", path: "/" },
      { name: opts.breadcrumbName, path: opts.path },
    ]),
  ];
  if (opts.faq?.length) blocks.push(faqSchema(opts.faq));
  return blocks.map((b) => ldScript(b));
}
