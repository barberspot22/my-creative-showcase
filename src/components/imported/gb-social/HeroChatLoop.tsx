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
  { from: "user", text: "Oi! Preciso dos posts da semana do restaurante, foco no almoço." },
  { from: "agent", text: "Oi! Boa. Segunda puxando o self-service e quinta o buffet variado?", delay: 1300 },
  { from: "user", text: "Isso. Na quinta quero mostrar a variedade do buffet." },
  {
    from: "agent",
    text: "Fechou. Fiz esses dois primeiro:",
    images: ["/gb-social-designs/design-09.jpg", "/gb-social-designs/design-22.jpg"],
    caption: "Segunda · almoço caprichado  |  Quinta · variedade do buffet",
    delay: 2200,
  },
  {
    from: "agent",
    copy: "Bateu aquela fome? O almoço de hoje tá caprichado, comida caseira feita na hora. Corre pra cá que ainda dá tempo! #almoco #comidacaseira #selfservice #restaurante #ondecomer #fome",
    delay: 1800,
  },
  {
    from: "agent",
    poll: {
      question: "O que faço com esses dois posts?",
      options: ["Aprovar agora", "Agendar para depois", "Ajustar algum detalhe"],
      picked: "Aprovar agora",
    },
    delay: 1600,
  },
  { from: "user", text: "Aprovado! Agora um de terça pro pessoal do centro e o jantar de sexta." },
  { from: "user", text: "O jantar de sexta é 2 parmegianas + Coca 2L por R$ 110." },
  {
    from: "agent",
    text: "Prontas também:",
    images: ["/gb-social-designs/design-05.jpg", "/gb-social-designs/design-17.jpg"],
    caption: "Terça · almoço no centro  |  Sexta · jantar em família R$ 110",
    delay: 2300,
  },
  {
    from: "agent",
    copy: "Sexta é dia de jantar em família: 2 parmegianas + Coca 2L por apenas R$ 110. Peça já o seu! #sexta #jantar #parmegiana #familia #promocao #delivery",
    delay: 1900,
  },
  {
    from: "agent",
    poll: {
      question: "E esses dois, aprova?",
      options: ["Aprovar agora", "Agendar para depois", "Ajustar algum detalhe"],
      picked: "Aprovar agora",
    },
    delay: 1600,
  },
  {
    from: "agent",
    text: "Os quatro aprovados e agendados. Segunda e terça às 10h40, quinta às 11h10 e sexta às 17h30, na hora em que seu público decide onde comer. Semana que vem já começo os próximos.",
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
