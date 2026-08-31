import { useEffect, useRef, useState } from "react";

type Msg = {
  from: "user" | "agent";
  text?: string;
  images?: string[];
  caption?: string;
  /** Mensagem de legenda com hashtags, renderizada com destaque. */
  copy?: string;
  /** Enquete de aprovação com opções clicáveis. */
  poll?: { question: string; options: string[]; picked?: string };
  delay?: number;
};

/** Conversa do hero: pedidos reais de posts da semana, com as artes enviadas no chat. */
const script: Msg[] = [
  { from: "user", text: "Oi! Consegue fazer o post de segunda pra mim? Quero puxar o almoço self-service." },
  { from: "agent", text: "Claro! Deixa comigo, já te mando a arte.", delay: 1300 },
  {
    from: "agent",
    images: ["/gb-social-designs/design-09.jpg"],
    caption: "Segunda · almoço self-service",
    delay: 2100,
  },
  {
    from: "agent",
    copy: "Segundou com fome? O almoço de hoje tá caprichado: comida caseira feita na hora, self-service completo. Corre pra cá que ainda dá tempo! #almoco #comidacaseira #selfservice #restaurante #ondecomer #segundou",
    delay: 1800,
  },
  {
    from: "agent",
    poll: {
      question: "O que faço com o post de segunda?",
      options: ["Aprovar agora", "Agendar para depois", "Ajustar algum detalhe"],
      picked: "Aprovar agora",
    },
    delay: 1600,
  },
  { from: "user", text: "Aprovado! Agora já te passo os próximos dois: um de terça pro pessoal do centro, mostrando a variedade do buffet, e o jantar de sexta, que é 2 parmegianas + Coca 2L por R$ 110." },
  { from: "agent", text: "Boa, anotei os dois. Preparando as artes, já te mando...", delay: 1400 },
  {
    from: "agent",
    images: ["/gb-social-designs/design-22.jpg", "/gb-social-designs/design-17.jpg"],
    caption: "Terça e sexta · posts prontos",
    delay: 2400,
  },
  {
    from: "agent",
    copy: "Trabalha no centro? A terça é dia de buffet variado por aqui: saladas frescas, grelhados e aquele tempero de casa. Almoço rápido e completo no seu intervalo. #buffet #almoco #centro #terca #restaurante #comidaboa",
    delay: 1800,
  },
  {
    from: "agent",
    copy: "Sexta é dia de jantar em família: 2 parmegianas + Coca 2L por apenas R$ 110. Peça já o seu e esqueça a louça! #sexta #jantar #parmegiana #familia #promocao #delivery",
    delay: 1800,
  },
  {
    from: "agent",
    poll: {
      question: "Aprovo os dois e já agendo todos os posts da semana?",
      options: ["Agendar todos agora", "Agendar para depois", "Ajustar algum detalhe"],
      picked: "Agendar todos agora",
    },
    delay: 1600,
  },
  {
    from: "agent",
    text: "Pronto! Todos os posts foram agendados: segunda às 10h40, terça às 11h10 e sexta às 17h30 — horários com o maior engajamento do seu perfil. Semana que vem eu já começo os próximos.",
    delay: 1800,
  },
];

/** Chat animado do hero do GB Social. Roda uma vez por carregamento e depois libera o scroll. */
export function HeroChatLoop() {
  const [count, setCount] = useState(script.length);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(true);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let step = 0;
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const run = () => {
      if (!alive) return;
      if (step >= script.length) {
        setDone(true);
        return;
      }
      const msg = script[step];
      const isAgent = msg.from === "agent";
      setTyping(isAgent);
      wait(isAgent ? (msg.delay ?? 1400) : 900, () => {
        if (!alive) return;
        setTyping(false);
        step += 1;
        setCount(step);
        wait(isAgent ? 800 : 500, run);
      });
    };

    setDone(false);
    setCount(0);
    wait(700, run);
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || done) return;
    const id = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [count, typing, done]);


  return (
    <div className="socialHeroMock">
      <div className="socialHeroPhone">
        <div className="socialHeroPhoneNotch" />
        <header className="socialHeroPhoneHead">
          <span className="socialHeroPhoneAvatar">GB</span>
          <div>
            <b>GB Social</b>
            <small>{typing ? "digitando..." : "online"}</small>
          </div>
          <i className="socialHeroPhoneDot" />
        </header>
        <div
          className="socialHeroPhoneBody"
          ref={bodyRef}

        >
          {script.slice(0, count).map((m, i) => (
            <div
              key={i}
              className={`socialHeroMsg socialHeroRow ${m.from === "user" ? "socialHeroRowUser" : "socialHeroRowAgent"}`}
            >
              {m.text && (
                <p className={m.from === "user" ? "socialHeroPhoneUser" : "socialHeroPhoneAgent"}>
                  {m.text}
                </p>
              )}
              {m.copy && (
                <div className="socialHeroCopy">
                  <small className="socialHeroCopyLabel">Legenda pronta</small>
                  <p className="socialHeroPhoneAgent">{m.copy}</p>
                </div>
              )}
              {m.poll && (
                <div className="socialHeroPoll">
                  <p className="socialHeroPollQuestion">{m.poll.question}</p>
                  <div className="socialHeroPollOptions">
                    {m.poll.options.map((opt) => (
                      <span
                        key={opt}
                        className={`socialHeroPollOption ${opt === m.poll?.picked ? "socialHeroPollOptionPicked" : ""}`}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {m.images && (
                <div className="socialHeroShots">
                  <div className="socialHeroShotsGrid">
                    {m.images.map((src) => (
                      <img key={src} src={src} alt="" loading="lazy" />
                    ))}
                  </div>
                  {m.caption && <small>{m.caption}</small>}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="socialHeroMsg socialHeroRow socialHeroRowAgent">
              <p className="socialHeroPhoneAgent socialHeroPhoneTyping">
                <i />
                <i />
                <i />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
