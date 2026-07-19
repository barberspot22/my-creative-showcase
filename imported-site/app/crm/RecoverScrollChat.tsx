"use client";

import { useEffect, useRef } from "react";

type Props = { whatsapp: string };

const moments = [
  { number: "01", title: "Lead entrou", meta: "anuncio -> WhatsApp", lead: "Oi, vi o anuncio, quanto custa o kit X?", agent: "O kit X sai por R$ X. Quer que eu mande o catalogo completo?" },
  { number: "02", title: "32 min parado", meta: "timer individual", lead: "sem resposta", agent: "Ainda dando aquela olhada? Separei uma condicao especial se fechar hoje." },
  { number: "03", title: "3h depois", meta: "segunda janela", lead: "continua frio", agent: "So pra avisar, o kit X ta saindo rapido — ainda tenho reservado um pra voce." },
  { number: "04", title: "24h depois", meta: "ultima chamada", lead: "Bora fechar, manda o link", agent: "Perfeito. Vou passar pro time finalizar com voce agora." },
  { number: "05", title: "Handoff", meta: "humano assume", lead: "atendente assumiu", agent: "Fechado! Te mando o link do pagamento agora." },
];

export function RecoverScrollChat({ whatsapp }: Props) {
  const section = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = section.current?.querySelectorAll<HTMLElement>(".recoverNectionItem");
    if (!items) return;
    const reveal = () => items.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * .86 && rect.bottom > 0) item.classList.add("visible");
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -10%" });
    items.forEach(item => observer.observe(item));
    window.addEventListener("scroll", reveal, { passive: true });
    requestAnimationFrame(reveal);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  return <div ref={section} className="recoverNectionFlow" aria-label="Fluxo de recuperacao de leads dentro do CRM">
    <div className="recoverNectionIntro recoverNectionItem">
      <span>///</span>
      <strong>CRM FOLLOW-UP</strong>
      <p>Uma linha de tempo visual mostrando o lead esfriando, o agente reagindo e o humano entrando na hora certa.</p>
    </div>
    <div className="recoverNectionTrack">
      {[...moments, ...moments].map((moment, index) => <article className="recoverNectionItem recoverNectionCard" key={`${moment.title}-${index}`}>
        <header><span>[{moment.number}]</span><small>{moment.meta}</small></header>
        <h3>{moment.title}</h3>
        <div className="recoverNectionPhone">
          <p className="lead">{moment.lead}</p>
          <p className="agent">{moment.agent}</p>
        </div>
        <b>///</b>
      </article>)}
    </div>
    <div className="recoverNectionCta recoverNectionItem">
      <h3>Follow-up rodando dentro do CRM, nao como lembrete manual.</h3>
      <a href={whatsapp} target="_blank" rel="noreferrer">Chamar no WhatsApp <span>↗</span></a>
    </div>
  </div>;
}
