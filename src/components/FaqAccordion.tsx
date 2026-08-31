import { useState } from "react";

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faqList">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question} className={`faqItem${isOpen ? " isOpen" : ""}`}>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              <span>{item.question}</span>
              <i aria-hidden="true">{isOpen ? "−" : "+"}</i>
            </button>
            <div className="faqAnswer" hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
