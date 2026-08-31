import { useEffect, useRef, useState } from "react";

type Msg = {
  from: "user" | "agent";
  text?: string;
  images?: string[];
  caption?: string;
  delay?: number;
};

/** Conversa do hero: pedidos reais de posts da semana, com as artes enviadas no chat. */
const script: Msg[] = [
  { from: "user", text: "Oi! Preciso dos posts da semana do restaurante, foco no almoço." },
  { from: "agent", text: "Oi! Boa. Segunda e quinta puxando o self-service, e sexta o jantar em família?", delay: 1300 },
  { from: "user", text: "Isso. Na quinta quero mostrar a variedade do buffet." },
  {
    from: "agent",
    text: "Fechou. Fiz esses dois primeiro:",
    images: ["/gb-social-designs/design-09.jpg", "/gb-social-designs/design-22.jpg"],
    caption: "Segunda · almoço caprichado  |  Quinta · variedade do buffet",
    delay: 2200,
  },
  { from: "user", text: "Ficaram ótimas. Legenda e hashtags também?" },
  { from: "agent", text: "Já vão prontas em cada uma. Falta a de terça, do pessoal do centro, e a de sexta.", delay: 1500 },
  { from: "user", text: "O jantar de sexta é 2 parmegianas + Coca 2L por R$ 110." },
  {
    from: "agent",
    text: "Prontas também:",
    images: ["/gb-social-designs/design-05.jpg", "/gb-social-designs/design-17.jpg"],
    caption: "Terça · almoço no centro  |  Sexta · jantar em família R$ 110",
    delay: 2300,
  },
  { from: "user", text: "Perfeito. Pode aprovar as quatro." },
  {
    from: "agent",
    text: "Aprovadas. Segunda e terça às 10h40, quinta às 11h10 e sexta às 17h30, na hora em que seu público decide onde comer.",
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
