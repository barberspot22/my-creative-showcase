import { useEffect, useRef, useState } from "react";

type Msg = { from: "user" | "agent"; text: string; delay?: number };

/** Conversa do hero: pedido de calendário de 15 dias -> checagem -> arte -> aprovação -> agendamento. */
const script: Msg[] = [
  { from: "user", text: "Oi, tudo bem? Preciso de post pros próximos 15 dias." },
  { from: "agent", text: "Bom te ver por aqui! Consigo sim.", delay: 900 },
  { from: "agent", text: "Antes de montar: segue a mesma linha do mês passado (prato do dia + combo de fim de semana) ou quer mudar alguma coisa?", delay: 1500 },
  { from: "user", text: "Mesma linha. Só quero puxar mais o almoço executivo." },
  { from: "agent", text: "Anotado. Fecho assim: 15 dias, 11 feeds e 4 stories, com 5 peças de almoço executivo espalhadas nos dias úteis.", delay: 1700 },
  { from: "agent", text: "Calendário pronto. Dias 1 a 15, horários de pico de cada canal. Quer ver uma arte antes de eu soltar o resto?", delay: 1600 },
  { from: "user", text: "Quero. Manda a do executivo." },
  { from: "agent", text: "Aqui: executivo de terça, prato + suco por R$ 34,90. Legenda e hashtags já dentro do post.", delay: 1600 },
  { from: "user", text: "Ficou boa. Pode aprovar os 15 dias." },
  { from: "agent", text: "Aprovado. Os 15 dias entraram na fila e publico direto nos canais conectados. Te aviso se algum post render abaixo do normal.", delay: 1800 },
];

const RESET_PAUSE = 3600;

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
        // Pausa, apaga suavemente e recomeça (evita o "pulo" do reset seco).
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
        wait(isAgent ? 700 : 500, run);
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
