// Canais que o GB Social consegue conectar.
// Lista fiel à cobertura de redes da Metricool (metricool.com/pt/redes-sociais):
// Bluesky, Facebook, Google Business Profile, Instagram, LinkedIn, Pinterest,
// Threads, TikTok, Twitch, Twitter (X) e YouTube.

import type { ReactNode } from "react";
import { wa } from "@/lib/adminLinks";

type Channel = { name: string; note: string; icon: ReactNode; message: string };

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const letter = (t: string) => (
  <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="inherit">{t}</text>
);

const channelMessage = (channel: string) =>
  `Olá! Vi no site que o GB Social conecta ${channel}. Gostaria de entender como funciona a integração, o que preciso fazer para conectar minha conta e como a IA cuida do conteúdo nesse canal.`;

export const CHANNELS: Channel[] = [
  {
    name: "Instagram",
    note: "Feed, carrossel e Reels criados, legendados e agendados.",
    icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" {...s} /><circle cx="12" cy="12" r="4" {...s} /><circle cx="17" cy="7" r="1.1" fill="currentColor" /></>,
    message: channelMessage("Instagram"),
  },
  {
    name: "Facebook",
    note: "Publicações da página no mesmo fluxo de aprovação.",
    icon: <><circle cx="12" cy="12" r="8.5" {...s} />{letter("f")}</>,
    message: channelMessage("Facebook"),
  },
  {
    name: "TikTok",
    note: "Vídeos curtos com legenda e horário de pico sugeridos.",
    icon: <><path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" {...s} /><path d="M14 6.2c.8 1.6 2.2 2.5 4 2.6" {...s} /></>,
    message: channelMessage("TikTok"),
  },
  {
    name: "YouTube",
    note: "Título, descrição e programação de vídeos e Shorts.",
    icon: <><rect x="2.8" y="6" width="18.4" height="12" rx="3.5" {...s} /><path d="M10.4 9.6 15 12l-4.6 2.4V9.6Z" fill="currentColor" stroke="none" /></>,
    message: channelMessage("YouTube"),
  },
  {
    name: "LinkedIn",
    note: "Conteúdo institucional com tom mais corporativo.",
    icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" {...s} />{letter("in")}</>,
    message: channelMessage("LinkedIn"),
  },
  {
    name: "X (Twitter)",
    note: "Posts curtos e threads no ritmo da conversa.",
    icon: <><path d="M5 5l14 14M19 5 5 19" {...s} /></>,
    message: channelMessage("X (Twitter)"),
  },
  {
    name: "Threads",
    note: "Publicação simultânea com o que sai no Instagram.",
    icon: <><path d="M15.5 8.4C14.7 7.2 13.5 6.6 12 6.6c-3 0-5 2.3-5 5.4s2 5.4 5 5.4c2.6 0 4.2-1.5 4.2-3.2 0-1.7-1.4-2.8-3.6-2.8-1.6 0-2.7.7-2.7 1.8 0 .8.7 1.3 1.6 1.3 1.4 0 2.2-1.1 2.2-3" {...s} /></>,
    message: channelMessage("Threads"),
  },
  {
    name: "Pinterest",
    note: "Pins do cardápio e dos produtos organizados por pasta.",
    icon: <><circle cx="12" cy="12" r="8.5" {...s} />{letter("P")}</>,
    message: channelMessage("Pinterest"),
  },
  {
    name: "Bluesky",
    note: "Presença na rede que mais cresce, sem esforço extra.",
    icon: <><path d="M12 15c-1.8-2.6-4-4.2-5.6-4.8C4.6 9.5 4 10.4 4 11.7c0 1.6 1 2.6 2.6 2.8 1 .1 2.1 0 2.7-.2" {...s} /><path d="M12 15c1.8-2.6 4-4.2 5.6-4.8 1.8-.7 2.4.2 2.4 1.5 0 1.6-1 2.6-2.6 2.8-1 .1-2.1 0-2.7-.2" {...s} /></>,
    message: channelMessage("Bluesky"),
  },
  {
    name: "Twitch",
    note: "Avisos de live e cortes divulgados automaticamente.",
    icon: <><path d="M5 4h14v10l-4 4h-3l-3 3H7v-3H5V4Z" {...s} /><path d="M11 8v4M15 8v4" {...s} /></>,
    message: channelMessage("Twitch"),
  },
  {
    name: "Google Business Profile",
    note: "Novidades, fotos e posts que aparecem na busca e no Maps.",
    icon: <><path d="M12 21s6-5.3 6-9.5A6 6 0 0 0 6 11.5C6 15.7 12 21 12 21Z" {...s} /><circle cx="12" cy="11.3" r="2.3" {...s} /></>,
    message: channelMessage("Google Business Profile"),
  },
];

function trackChannelClick(channel: string) {
  import("@/lib/tracking").then(({ trackLead }) =>
    trackLead(`channel_${channel.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`),
  );
}

export function ChannelGrid() {
  return (
    <div className="channelGrid">
      {CHANNELS.map((c) => (
        <a
          key={c.name}
          className="channelCard"
          href={wa(c.message)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Quero conectar ${c.name} ao GB Social`}
          onClick={() => trackChannelClick(c.name)}
        >
          <span className="channelIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">{c.icon}</svg>
          </span>
          <h3>{c.name}</h3>
          <p>{c.note}</p>
        </a>
      ))}
    </div>
  );
}
