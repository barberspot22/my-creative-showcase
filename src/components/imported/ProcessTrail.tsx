import { useEffect, useRef, useState } from "react";
import { usePageLink } from "@/lib/adminLinks";

type Step = {
  n: string;
  title: string;
  desc: string;
};

const steps: Step[] = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "Entendemos o gargalo real do seu negócio e mapeamos oportunidades.",
  },
  {
    n: "02",
    title: "Proposta",
    desc: "Escopo sob medida, stack certo, prazos e investimento claros.",
  },
  {
    n: "03",
    title: "MVP",
    desc: "Versão navegável em dias para validar direção antes de escalar.",
  },
  {
    n: "04",
    title: "Entrega",
    desc: "Sistema no ar e evolução contínua guiada por dados.",
  },
];

export function ProcessTrail() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState<boolean[]>(() => steps.map(() => false));
  const cta = usePageLink("trilha-cta" as any);

  useEffect(() => {
    const nodes = sectionRef.current?.querySelectorAll("[data-step]") ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = Number((e.target as HTMLElement).dataset.step);
          if (e.isIntersecting) {
            setVisible((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.3 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="leistungen" className="processTrail" aria-label="Nosso processo">
      <div className="trailHead">
        <span className="trailEyebrow">NOSSO PROCESSO</span>
        <h2>Inteligência&nbsp;<br />artificial aplicada.</h2>
        <p>Quatro passos. Sem enrolação.</p>
      </div>

      <ol className="trailSteps">
        {steps.map((s, i) => (
          <li
            key={s.n}
            data-step={i}
            className={`trailStep ${visible[i] ? "in" : ""}`}
          >
            <span className="trailStepN">{s.n}</span>
            <div className="trailStepBody">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="trailFoot">
        <a href={cta?.ctaUrl || "#kontakt"} className="trailCta">
          <span>{cta?.ctaLabel || "Começar minha trilha"}</span>
        </a>
      </div>
    </section>
  );
}
