"use client";

import dynamic from "next/dynamic";

const OceanScene = dynamic(() => import("./OceanScene"), { ssr: false });

interface OceanSceneWrapperProps {
  onRequestQuote?: () => void;
}

export default function OceanSceneWrapper({ onRequestQuote }: OceanSceneWrapperProps) {
  return <OceanScene onRequestQuote={onRequestQuote} />;
}
