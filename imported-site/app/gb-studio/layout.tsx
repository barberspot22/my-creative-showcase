import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GB Studio — Fotografia de moda com IA | GB IA",
  description: "Imagens hiper-realistas de modelos e lookbooks completos para marcas de varejo e confecção têxtil.",
};

export default function GBStudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
