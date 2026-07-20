import { useEffect, useRef, useState } from "react";
import { Search, ScrollText, Rocket, Trophy, MapPin } from "lucide-react";
import { usePageLink } from "@/lib/adminLinks";

type Step = {
  n: string;
  title: string;
  desc: string;
  deliver: string;
  Icon: typeof Search;
};

const steps: Step[] = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "Escuta ativa do seu negócio: entendemos o gargalo real e mapeamos oportunidades.",
    deliver: "Você recebe: sessão de descoberta + relatório do diagnóstico.",
    Icon: Search,
  },
  {
    n: "02",
    title: "Proposta sob medida",
    desc: "Desenhamos o escopo, escolhemos as tecnologias certas e alinhamos prazos e investimento.",
    deliver: "Você recebe: proposta com escopo, stack e cronograma claros.",
    Icon: ScrollText,
  },
  {
    n: "03",
    title: "MVP · Prova de valor",
    desc: "Construímos rápido uma versão navegável para validar direção antes de escalar.",
    deliver: "Você recebe: protótipo funcional em dias, não meses.",
    Icon: Rocket,
  },
  {
    n: "04",
    title: "Entrega & evolução",
    desc: "Sistema no ar, ajustes finos e acompanhamento contínuo para o negócio crescer com ele.",
    deliver: "Você recebe: produto em produção + evolução guiada por dados.",
    Icon: Trophy,
  },
];

export function ProcessTrail() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);
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
      { threshold: 0.35 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.6;
      const traveled = Math.min(total, Math.max(0, vh - rect.top));
      setProgress(Math.max(0, Math.min(1, traveled / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const pathLen = pathRef.current?.getTotalLength() ?? 1600;

  return (
    <section ref={sectionRef} id="leistungen" className="processTrail" aria-label="Nosso processo">
      <div className="trailHead">
        <span className="trailEyebrow">NOSSO PROCESSO</span>
        <h2>
          A trilha da sua<br />
          transformação
        </h2>
        <p>Do problema ao sistema no ar — o caminho que a GB IA percorre com você.</p>
      </div>

      <div className="trailMap">
        <svg className="trailPath" viewBox="0 0 400 1400" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="trailGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5e6b3" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8a6a1a" />
            </linearGradient>
          </defs>
          <path
            d="M200 40 C 60 180, 340 320, 200 460 C 60 600, 340 740, 200 880 C 60 1020, 340 1160, 200 1360"
            stroke="rgba(255,255,255,.08)"
            strokeWidth="2"
            strokeDasharray="6 10"
            fill="none"
          />
          <path
            ref={pathRef}
            d="M200 40 C 60 180, 340 320, 200 460 C 60 600, 340 740, 200 880 C 60 1020, 340 1160, 200 1360"
            stroke="url(#trailGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: pathLen,
              strokeDashoffset: pathLen * (1 - progress),
              filter: "drop-shadow(0 0 6px rgba(212,175,55,.55))",
            }}
          />
        </svg>

        <ol className="trailSteps">
          {steps.map((s, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <li
                key={s.n}
                data-step={i}
                className={`trailStep ${side} ${visible[i] ? "in" : ""}`}
              >
                <div className="trailPin" aria-hidden="true">
                  <span className="trailPinDot" />
                  <span className="trailPinRing" />
                </div>
                <div className="trailCard">
                  <div className="trailCardHead">
                    <s.Icon size={22} strokeWidth={1.4} />
                    <span className="trailStepN">{s.n}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <small>{s.deliver}</small>
                </div>
              </li>
            );
          })}
          <li className="trailTreasure" data-step={steps.length}>
            <div className="trailTreasureMark" aria-hidden="true">
              <MapPin size={26} strokeWidth={1.6} />
              <span>X</span>
            </div>
            <h4>Aqui começa o seu tesouro.</h4>
            <a href={cta?.ctaUrl || "#kontakt"} className="trailCta">
              <span>{cta?.ctaLabel || "Começar minha trilha"}</span>
              <i aria-hidden="true" />
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
}
