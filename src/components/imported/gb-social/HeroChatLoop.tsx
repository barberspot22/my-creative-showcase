import { useEffect, useRef, useState } from "react";

type Msg = { from: "user" | "agent"; text: string; delay?: number };

/** Roteiro do chat do hero: pedido de post -> arte -> agendamento -> resultado. */
const script: Msg[] = [
  { from: "user", text: "Preciso de posts pra semana do restaurante." },
  {
    from: "agent",
    text: "Fechado. 5 peças: prato do dia, combo de sábado, bastidor da cozinha, carrossel do cardápio com preço e story de enquete.",
    delay: 1500,
  },
  { from: "user", text: "Manda a do combo primeiro." },
  { from: "agent", text: "Arte do combo de sábado pronta: 2 parmegianas + Coca 2L por R$ 110. Aprova?", delay: 1600 },
  { from: "user", text: "Aprovado. Agenda tudo." },
  {
    from: "agent",
    text: "Agendado: seg 11h, qua 18h, sex 19h, sáb 12h e domingo 11h. Publico direto nos canais conectados.",
    delay: 1500,
  },
  {
    from: "agent",
    text: "De bônus, a @cantinadobairro este mês: seguidores +412 · alcance 38,2k · engajamento 6,4%.",
    delay: 1700,
  },
];

/** Chat animado do hero do GB Social, em loop, com indicador de digitação. */
export function HeroChatLoop() {
  const [count, setCount] = useState(script.length);
  const [typing, setTyping] = useState(false);
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
        wait(3200, () => {
          step = 0;
          setCount(0);
          wait(500, run);
        });
        return;
      }
      const msg = script[step];
      const isAgent = msg.from === "agent";
      setTyping(isAgent);
      wait(isAgent ? (msg.delay ?? 1400) : 800, () => {
        if (!alive) return;
        setTyping(false);
        step += 1;
        setCount(step);
        wait(450, run);
      });
    };

    setCount(0);
    wait(600, run);
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count, typing]);

  return (
    <div className="socialHeroMock" aria-hidden="true">
      <div className="socialHeroPhone">
        <div className="socialHeroPhoneNotch" />
        <header className="socialHeroPhoneHead">
          <span className="socialHeroPhoneAvatar">GB</span>
          <div>
            <b>GB Social</b>
            <small>criando agora</small>
          </div>
          <i className="socialHeroPhoneDot" />
        </header>
        <div className="socialHeroPhoneBody" ref={bodyRef}>
          {script.slice(0, count).map((m, i) => (
            <p
              key={i}
              className={`socialHeroMsg ${m.from === "user" ? "socialHeroPhoneUser" : "socialHeroPhoneAgent"}`}
            >
              {m.text}
            </p>
          ))}
          {typing && (
            <p className="socialHeroPhoneAgent socialHeroPhoneTyping socialHeroMsg">
              <i />
              <i />
              <i />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
