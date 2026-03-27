import React, { memo } from "react";
import TypewriterTitle from "@/components/ui/TypewriterTitle";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  typewriter?: boolean;
}

const SectionHeader = memo(({ eyebrow, title, subtitle, centered = false, light = false, typewriter = false }: SectionHeaderProps) => {
  return (
    <div className={centered ? "text-center" : ""}>
      {/* Eyebrow */}
      <div className={`flex items-center gap-2.5 mb-3.5 ${centered ? "justify-center" : ""}`}>
        <div className="w-8 h-px" style={{ background: "#aeb30a" }} />
        <span
          className="font-body text-[11px] font-bold tracking-[0.16em] uppercase"
          style={{ color: "#aeb30a" }}
        >
          {eyebrow}
        </span>
        {centered && <div className="w-8 h-px" style={{ background: "#aeb30a" }} />}
      </div>

      {/* Title */}
      {typewriter ? (
        <TypewriterTitle
          centered={centered}
          style={{ color: light ? "#ffffff" : "hsl(var(--liimra-ink))" }}
        >
          {title}
        </TypewriterTitle>
      ) : (
        <h2
          className={`font-display font-black tracking-tight leading-[1.08] mb-3.5 ${centered ? "text-center" : ""}`}
          style={{
            fontSize: "clamp(1.9rem, 3vw, 3.1rem)",
            letterSpacing: "-0.02em",
            color: light ? "#ffffff" : "hsl(var(--liimra-ink))",
          }}
        >
          {title}
        </h2>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`font-body text-sm leading-relaxed ${centered ? "mx-auto text-center" : ""}`}
          style={{
            maxWidth: "580px",
            color: light ? "rgba(255,255,255,0.5)" : "hsl(var(--liimra-ink-light))",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
