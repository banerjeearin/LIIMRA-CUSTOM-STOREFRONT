import { memo } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TypewriterTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  centered?: boolean;
}

const TypewriterTitle = memo(({
  children,
  className = "",
  style = {},
  centered = false,
}: TypewriterTitleProps) => {
  const ref = useScrollReveal({ threshold: 0.2 });

  return (
    <h2
      ref={ref}
      className={`typewriter-title font-display font-black tracking-tight leading-[1.08] mb-3.5 ${
        centered ? "text-center" : ""
      } ${className}`}
      style={{
        fontSize: "clamp(1.9rem, 3vw, 3.1rem)",
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {children}
    </h2>
  );
});

TypewriterTitle.displayName = "TypewriterTitle";

export default TypewriterTitle;
