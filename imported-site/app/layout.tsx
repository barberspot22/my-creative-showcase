import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GB IA — Sistemas, automação e IA autônoma",
  description: "Sistemas sob medida, automação de processos e agentes de IA autônoma.",
  icons: { icon: "/lumus-assets/5ae41899a7f08880.png" },
  openGraph: {
    title: "GB IA — Sistemas, automação e IA autônoma",
    description: "Sistemas sob medida, automação de processos e agentes de IA autônoma.",
    images: [{ url: "/og.png", width: 1792, height: 1024, alt: "GB IA" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
