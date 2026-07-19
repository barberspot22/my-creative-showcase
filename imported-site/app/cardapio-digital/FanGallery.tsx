"use client";

import { useState } from "react";

const items = [
  { label: "Menu Executivo", type: "Cardápio digital", className: "menuFanCard0", lines: ["Entrada", "Prato do dia", "Sobremesa"], price: "R$ 49" },
  { label: "Pizzaria", type: "Template WhatsApp", className: "menuFanCard1", lines: ["Tradicionais", "Especiais", "Bebidas"], price: "Peça agora" },
  { label: "Instagram", type: "Social media", className: "menuFanCard2", lines: ["Post do dia", "Story oferta", "Reels curto"], price: "Aprovar" },
  { label: "Reservas", type: "Atendimento", className: "menuFanCard3", lines: ["Mesa", "Horário", "Confirmação"], price: "18:30" },
  { label: "Delivery", type: "Template de pedido", className: "menuFanCard4", lines: ["Combo", "Adicionais", "Pagamento"], price: "Enviar" },
];

export function FanGallery() {
  const [active, setActive] = useState(2);
  return <div className="menuFanGallery" style={{ "--fan-active": active } as React.CSSProperties}>
    <div className="menuFanStage">{items.map((item, index) => <button
      type="button"
      key={item.label}
      className={`menuFanCard ${item.className} ${active === index ? "active" : ""}`}
      style={{ "--fan-index": index, "--fan-distance": index - active } as React.CSSProperties}
      onMouseEnter={() => setActive(index)}
      onFocus={() => setActive(index)}
      onClick={() => setActive(index)}
      aria-pressed={active === index}
      aria-label={`Destacar ${item.label}`}
    >
      <span className="menuFanMedia menuTemplateMedia">
        <i className="menuTemplatePlate"/>
        <b>{item.label}</b>
        <small>{item.type}</small>
        <span className="menuTemplateList">{item.lines.map(line => <em key={line}>{line}</em>)}</span>
        <strong>{item.price}</strong>
      </span>
    </button>)}</div>
    <p>Cardápios e templates · toque para explorar</p>
  </div>;
}
