"use client";

import { useState, useRef, useCallback } from "react";

interface Card {
  label: string;
  title: string;
  desc: string;
  img: string;
  price: string;
  priceNote: string;
  detailContent?: string;
}

export default function FeatureCards({ cards }: { cards: Card[] }) {
  const [active, setActive] = useState<number | null>(0);
  const [modalCard, setModalCard] = useState<Card | null>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; mx: number; my: number }>({ rx: 0, ry: 0, mx: 50, my: 50 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const el = cardRefs.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * -14;
    const ry = (x - 0.5) * 14;
    setTilt({ rx, ry, mx: x * 100, my: y * 100 });
  }, []);

  const resetTilt = useCallback(() => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-desc { animation: fadeUp 0.45s ease 0.15s both; }
        .card-btn  { animation: fadeUp 0.45s ease 0.28s both; }
        .fc-wrap   { display: flex; gap: 10px; height: 560px; perspective: 1200px; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .modal-overlay {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .modal-box {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
        }
        @media (max-width: 768px) {
          .fc-wrap { flex-direction: column; height: auto; }
          .modal-box {
            grid-template-columns: 1fr !important;
            max-height: 90vh;
            overflow-y: auto;
          }
          .modal-img-container {
            min-height: 200px !important;
            height: 200px !important;
          }
        }
      `}</style>

      <div className="fc-wrap" onMouseLeave={() => { setActive(0); resetTilt(); }}>
        {cards.map((card, i) => {
          const isActive = active === i;
          const tiltStyle = isActive
            ? {
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)`,
                transition: "flex 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.12s ease, box-shadow 0.3s ease",
              }
            : {
                transform: "rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
                transition: "flex 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.4s ease, box-shadow 0.3s ease",
              };

          return (
            <div
              key={card.label}
              ref={(el) => { cardRefs.current[i] = el; }}
              onMouseEnter={() => setActive(i)}
              onMouseMove={(e) => isActive && handleMouseMove(e, i)}
              onMouseLeave={resetTilt}
              onClick={() => {
                if (isActive) {
                  setModalCard(card);
                } else {
                  setActive(i);
                }
              }}
              style={{
                flex: isActive ? "3.2 0 0" : "1 0 0",
                position: "relative",
                overflow: "hidden",
                borderRadius: "20px",
                cursor: "pointer",
                transformStyle: "preserve-3d",
                boxShadow: isActive
                  ? "0 32px 80px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.06)"
                  : "0 8px 32px rgba(0,0,0,0.18)",
                minWidth: 0,
                willChange: "transform",
                ...tiltStyle,
              }}
            >
              {/* bg image */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${card.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 55%",
                  transform: isActive ? "scale(1)" : "scale(1.06)",
                  transition: "transform 0.55s ease",
                  transformStyle: "preserve-3d",
                }}
              />

              {/* Gradient */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 45%, transparent 70%)",
              }} />

              {/* 3D shine layer — follows mouse */}
              {isActive && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.10) 0%, transparent 60%)`,
                  pointerEvents: "none",
                  zIndex: 5,
                  transition: "background 0.08s ease",
                }} />
              )}

              {/* 3D depth layer — floats above */}
              <div style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 6,
                transform: "translateZ(20px)",
                transformStyle: "preserve-3d",
              }}>
                {/* top-right arrow */}
                <div style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.13)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{ color: "#fff", fontSize: "14px", lineHeight: 1 }}>↗</span>
                </div>

                {/* top-left label */}
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                  <span style={{
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "8px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}>
                    {card.label}
                  </span>
                </div>
              </div>

              {/* bottom content */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "0 20px 24px",
                zIndex: 7,
                transform: "translateZ(30px)",
                transformStyle: "preserve-3d",
              }}>
                <h3 style={{
                  color: "#fff",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 900,
                  fontSize: isActive ? "1.6rem" : "1.35rem",
                  lineHeight: 1.15,
                  marginBottom: isActive ? "14px" : "0",
                  whiteSpace: "pre-line",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                  transition: "font-size 0.45s ease, margin 0.45s ease",
                }}>
                  {card.title}
                </h3>

                {!isActive && (
                  <div style={{
                    color: "rgba(255, 255, 255, 0.75)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    marginTop: "6px",
                    letterSpacing: "0.02em"
                  }}>
                    {card.price}
                  </div>
                )}

                {isActive && (
                  <p className="card-desc" style={{
                    color: "rgba(240,244,255,0.6)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.73rem",
                    lineHeight: 1.8,
                    marginBottom: "14px",
                  }}>
                    {card.desc}
                  </p>
                )}

                {isActive && (
                  <div className="card-desc" style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                    marginBottom: "18px",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    paddingTop: "12px",
                  }}>
                    <span style={{
                      color: "#fff",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      letterSpacing: "-0.02em",
                    }}>{card.price}</span>
                    <span style={{
                      color: "rgba(240,244,255,0.45)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}>{card.priceNote}</span>
                  </div>
                )}

                {isActive ? (
                  <button
                    className="card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalCard(card);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#0a0e1a",
                      fontFamily: "var(--font-sans)",
                      fontSize: "9px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      background: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    Learn More <span style={{ fontSize: "14px", lineHeight: 1 }}>›</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalCard(card);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Details <span style={{ fontSize: "12px" }}>›</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalCard && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(5, 7, 12, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "20px",
          }}
          onClick={() => setModalCard(null)}
        >
          <div
            className="modal-box"
            style={{
              background: "var(--color-navy)",
              color: "#fff",
              width: "100%",
              maxWidth: "800px",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side: Image */}
            <div className="modal-img-container" style={{ position: "relative", minHeight: "350px", background: "#000" }}>
              <img
                src={modalCard.img}
                alt={modalCard.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(10,14,26,0.9) 0%, transparent 60%)"
              }} />
              <div style={{ position: "absolute", bottom: "24px", left: "24px" }}>
                <span style={{
                  color: "var(--color-blue-light)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}>
                  {modalCard.label}
                </span>
                <h2 style={{
                  color: "#fff",
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginTop: "6px",
                  whiteSpace: "pre-line"
                }}>
                  {modalCard.title}
                </h2>
              </div>
            </div>

            {/* Right side: Content */}
            <div style={{ padding: "40px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {/* Close button */}
              <button
                onClick={() => setModalCard(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              >
                &times;
              </button>

              <div style={{ marginTop: "12px" }}>
                <p style={{
                  color: "rgba(240,244,255,0.7)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  marginBottom: "28px"
                }}>
                  {modalCard.detailContent || modalCard.desc}
                </p>

                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px"
                }}>
                  <div>
                    <p style={{
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "9px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "4px"
                    }}>
                      Pricing
                    </p>
                    <p style={{
                      color: "#fff",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "1.1rem"
                    }}>
                      {modalCard.price}
                    </p>
                  </div>
                  {modalCard.priceNote && (
                    <span style={{
                      color: "var(--color-blue-light)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      background: "rgba(0,102,255,0.15)",
                      padding: "4px 10px",
                      borderRadius: "6px"
                    }}>
                      {modalCard.priceNote}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setModalCard(null);
                  const contactEl = document.getElementById("contact");
                  if (contactEl) {
                    contactEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  width: "100%",
                  background: "var(--color-blue)",
                  color: "#fff",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  boxShadow: "0 4px 14px rgba(0,102,255,0.3)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-blue)")}
              >
                Book This Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
