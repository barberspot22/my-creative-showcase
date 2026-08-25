import { useEffect, useRef, useState } from "react";

type Msg = {
  from: "user" | "agent";
  text?: string;
  images?: string[];
  caption?: string;
  delay?: number;
};

/** Conversa do hero: pedidos de post por dia da semana, com artes enviadas no chat. */
const script: Msg[] = [
  { from: "user", text: "Oi! Preciso do post de terça, o do almoço executivo." },
  { from: "agent", text: "Oi, bom te ver! Mesma pegada do mês passado, prato + suco?", delay: 1100 },
  { from: "user", text: "Isso. R$ 34,90 nesta semana." },
  {
    from: "agent",
    text: "Fechou. Fiz duas versões, olha aí:",
    images: ["/gb-social-designs/design-17.jpg", "/gb-social-designs/design-05.jpg"],
    caption: "Terça · Almoço executivo · legenda e hashtags já prontas",
    delay: 2200,
  },
  { from: "user", text: "A primeira. Ficou ótima." },
  { from: "agent", text: "Agendei para terça às 10h40, que é quando seu público decide o almoço.", delay: 1400 },
  { from: "user", text: "E o de sexta? Queria puxar o combo da noite." },
  {
    from: "agent",
    text: "Já subi o de sexta e deixei um story pra quinta esquentando:",
    images: ["/gb-social-designs/design-22.jpg", "/gb-social-designs/design-09.jpg"],
    caption: "Sexta · Combo da noite  |  Quinta · Story de bastidor",
    delay: 2300,
  },
  { from: "user", text: "Perfeito. Pode aprovar os dois." },
  {
    from: "agent",
    text: "Aprovados. Semana fechada: terça, quinta e sexta na fila. Sábado te mando o resultado de cada um.",
    delay: 1800,
  },
];

const RESET_PAUSE = 3800;

/** Chat animado do hero do GB Social, em loop, com indicador de digitação. */
export function HeroChatLoop() {
  const [count, setCount] = useState(script.length);
  const [typing, setTyping] = useState(false);
  const [fading, setFading] = useState(false);
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
        wait(RESET_PAUSE, () => {
          setFading(true);
          wait(600, () => {
            step = 0;
            setCount(0);
            if (bodyRef.current) bodyRef.current.scrollTop = 0;
            wait(260, () => {
              setFading(false);
              wait(500, run);
            });
          });
        });
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

    setCount(0);
    wait(700, run);
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || fading) return;
    const id = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [count, typing, fading]);

  return (
    <div className="socialHeroMock" aria-hidden="true">
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
          className={`socialHeroPhoneBody${fading ? " socialHeroPhoneBodyFading" : ""}`}
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
