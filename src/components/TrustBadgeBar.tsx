import { memo } from "react";

const OLIVE = "#3e4c1d";
const NEON = "#aeb30a";

interface Badge {
  icon: string;
  label: string;
  sublabel: string;
}

const BADGES: Badge[] = [
  { icon: "🌾", label: "100% Natural", sublabel: "No additives" },
  { icon: "🔒", label: "Secure Checkout", sublabel: "SSL encrypted" },
  { icon: "🚚", label: "Free Shipping", sublabel: "Above ₹299" },
  { icon: "🏅", label: "FSSAI Certified", sublabel: "Quality assured" },
  { icon: "🔄", label: "Easy Returns", sublabel: "7-day policy" },
  { icon: "⚡", label: "48hr Fresh", sublabel: "Stone cold milled" },
];

const TrustBadgeBar = memo(() => {
  return (
    <div
      className="trust-badge-bar"
      style={{
        borderTop: `1.5px solid hsl(72 18% 85%)`,
        borderBottom: `1.5px solid hsl(72 18% 85%)`,
        background: `linear-gradient(135deg, rgba(174,179,10,0.07) 0%, rgba(62,76,29,0.05) 100%)`,
        padding: "14px 0",
        overflow: "hidden",
        position: "relative",
        borderRadius: "0.5rem",
        border: "1px solid hsl(72 18% 90%)",
      }}
    >
      <div className="trust-badge-track">
        {[...BADGES, ...BADGES].map((badge, i) => (
          <div
            key={i}
            className="trust-badge-item"
            style={{
              display: "inline-flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
              padding: "0 28px",
              position: "relative",
            }}
          >
            {/* Divider dot */}
            {i > 0 && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: NEON,
                  opacity: 0.6,
                  flexShrink: 0,
                }}
              />
            )}

            {/* Icon */}
            <span
              style={{
                fontSize: "22px",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {badge.icon}
            </span>

            {/* Text block */}
            <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: OLIVE,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                  lineHeight: 1.2,
                }}
              >
                {badge.label}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "10px",
                  fontWeight: 400,
                  color: "hsl(50 15% 45%)",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {badge.sublabel}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Left fade mask */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "48px",
          height: "100%",
          background: `linear-gradient(to right, rgba(250,248,240,0.95), transparent)`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      {/* Right fade mask */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "48px",
          height: "100%",
          background: `linear-gradient(to left, rgba(250,248,240,0.95), transparent)`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
});

TrustBadgeBar.displayName = "TrustBadgeBar";

export default TrustBadgeBar;
