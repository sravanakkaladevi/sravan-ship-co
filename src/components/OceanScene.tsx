"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── Animated ocean wave mesh ─────────────────────────────── */
function OceanWave() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(28, 28, 120, 120);
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 0.6 + t * 0.9) * 0.28 +
        Math.sin(y * 0.5 + t * 0.7) * 0.22 +
        Math.sin((x + y) * 0.35 + t * 1.1) * 0.14;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geo} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1.2, 0]}>
      <meshStandardMaterial
        color="#0e3a6e"
        wireframe={false}
        roughness={0.1}
        metalness={0.6}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

/* ── Wireframe grid overlay ───────────────────────────────── */
function WireGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(28, 28, 40, 40), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 0.6 + t * 0.9) * 0.28 +
        Math.sin(y * 0.5 + t * 0.7) * 0.22 +
        Math.sin((x + y) * 0.35 + t * 1.1) * 0.14;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geo} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1.18, 0]}>
      <meshBasicMaterial color="#1d6fd8" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

/* ── Floating star particles ──────────────────────────────── */
function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(1800);
    for (let i = 0; i < 1800; i += 3) {
      arr[i]     = (Math.random() - 0.5) * 30;
      arr[i + 1] = (Math.random() - 0.5) * 14 + 4;
      arr[i + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.012;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial size={0.04} color="#7dd3fc" sizeAttenuation transparent opacity={0.7} />
    </Points>
  );
}

/* ── Glowing ring ─────────────────────────────────────────── */
function GlowRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.18;
      ref.current.rotation.z = clock.getElapsedTime() * 0.09;
    }
  });
  return (
    <mesh ref={ref} position={[0, 1.5, -3]}>
      <torusGeometry args={[2.8, 0.018, 16, 120]} />
      <meshBasicMaterial color="#2563eb" transparent opacity={0.45} />
    </mesh>
  );
}

/* ── Scene ────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#60a5fa" />
      <pointLight position={[-4, 3, -2]} intensity={0.8} color="#1d4ed8" />
      <pointLight position={[4, 2, 2]} intensity={0.5} color="#7dd3fc" />
      <Stars />
      <OceanWave />
      <WireGrid />
      <GlowRing />
    </>
  );
}

/* ── Exported wrapper ─────────────────────────────────────── */
interface OceanSceneProps {
  onRequestQuote?: () => void;
}

export default function OceanScene({ onRequestQuote }: OceanSceneProps) {
  return (
    <section style={{ background: "#020918", position: "relative", overflow: "hidden" }}>

      {/* 3D Canvas */}
      <div style={{ height: "100vh", width: "100%" }}>
        <Canvas
          camera={{ position: [0, 3.5, 7], fov: 55 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: "linear-gradient(to bottom, #020918 0%, #051530 50%, #071e42 100%)" }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Overlay text */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}>
        <p style={{
          color: "rgba(125,211,252,0.7)",
          fontFamily: "var(--font-sans)",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}>
          SRAVAN SHIP CO · Luxury Cruises
        </p>

        <h2 style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 900,
          fontSize: "clamp(2.8rem, 7vw, 6rem)",
          color: "#fff",
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          textAlign: "center",
          textShadow: "0 0 60px rgba(37,99,235,0.6), 0 4px 40px rgba(0,0,0,0.8)",
          marginBottom: "24px",
        }}>
          Sail the<br />
          <span style={{ color: "#60a5fa" }}>Open Water</span>
        </h2>

        <div style={{ width: 56, height: 2, background: "#2563eb", marginBottom: "24px" }} />

        <p style={{
          color: "rgba(186,230,255,0.55)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.9rem",
          lineHeight: 1.85,
          textAlign: "center",
          maxWidth: "420px",
          marginBottom: "40px",
        }}>
          Experience premium boutique travel across the world's most breathtaking waters.<br />
          60+ destinations · 5-star ratings · 12+ years of luxury travel
        </p>

        <div style={{ display: "flex", gap: "12px", pointerEvents: "all" }}>
          <button
            onClick={() => {
              const target = document.getElementById("voyages");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{
              padding: "14px 36px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontFamily: "var(--font-sans)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 0 30px rgba(37,99,235,0.5)",
            }}
          >
            Explore Fleet
          </button>
          <button
            onClick={onRequestQuote}
            style={{
              padding: "14px 36px",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              fontFamily: "var(--font-sans)",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
            }}
          >
            Book Voyage
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(2,9,24,0.7)",
        backdropFilter: "blur(16px)",
      }}>
        {[
          { value: "12+", label: "Years at Sea" },
          { value: "60+", label: "Destinations" },
          { value: "42", label: "Routes Charted" },
          { value: "98%", label: "Guest Rating" },
        ].map(({ value, label }) => (
          <div key={label} style={{
            padding: "22px 32px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}>
            <p style={{
              color: "#60a5fa",
              fontFamily: "var(--font-sans)",
              fontWeight: 900,
              fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "4px",
            }}>{value}</p>
            <p style={{
              color: "rgba(186,230,255,0.4)",
              fontFamily: "var(--font-sans)",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
