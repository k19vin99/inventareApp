import { useState } from "react";

export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div key={i} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            aria-controls={`acc-panel-${i}`}
            id={`acc-header-${i}`}
            type="button"
          >
            <span>{it.title}</span>
            <svg
              className={`chev ${openIndex === i ? "open" : ""}`}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div
            id={`acc-panel-${i}`}
            role="region"
            aria-labelledby={`acc-header-${i}`}
            className={`accordion-panel ${openIndex === i ? "open" : ""}`}
          >
            <p>{it.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}