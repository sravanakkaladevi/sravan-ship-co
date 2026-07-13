"use client";

import dynamic from "next/dynamic";

const ScrollCanvas = dynamic(() => import("./ScrollCanvas"), { ssr: false });

interface CanvasWrapperProps {
  onRequestQuote?: () => void;
}

export default function CanvasWrapper({ onRequestQuote }: CanvasWrapperProps) {
  return <ScrollCanvas onRequestQuote={onRequestQuote} />;
}
