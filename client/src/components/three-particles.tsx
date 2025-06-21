import { useEffect, useRef } from "react";
import { createThreeScene } from "@/lib/three-utils";

export default function ThreeParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = createThreeScene(containerRef.current);

    return cleanup;
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="floating-particles fixed inset-0 pointer-events-none z-0"
    />
  );
}
