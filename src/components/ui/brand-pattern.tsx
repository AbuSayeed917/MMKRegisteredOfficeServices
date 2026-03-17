"use client";

/**
 * MMK Brand Pattern — A subtle geometric pattern using brand colors.
 * Use as a background element for banners, hero sections, and cards.
 */
export function BrandPattern({
  className = "",
  opacity = 0.06,
  variant = "geometric",
}: {
  className?: string;
  opacity?: number;
  variant?: "geometric" | "dots" | "waves";
}) {
  if (variant === "dots") {
    return (
      <svg
        className={className}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="brand-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#057baa" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brand-dots)" />
      </svg>
    );
  }

  if (variant === "waves") {
    return (
      <svg
        className={className}
        viewBox="0 0 1440 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,80 C360,160 720,0 1080,80 C1260,120 1380,100 1440,80 L1440,200 L0,200 Z"
          fill="#057baa"
          opacity={opacity * 0.8}
        />
        <path
          d="M0,120 C240,60 480,160 720,100 C960,40 1200,140 1440,100 L1440,200 L0,200 Z"
          fill="#0ea5e9"
          opacity={opacity * 0.5}
        />
      </svg>
    );
  }

  // Default: geometric grid pattern
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="brand-geo"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Diamond shapes */}
          <path
            d="M30 5 L40 30 L30 55 L20 30 Z"
            fill="none"
            stroke="#057baa"
            strokeWidth="0.5"
            opacity={opacity}
          />
          {/* Corner dots */}
          <circle cx="0" cy="0" r="1" fill="#0ea5e9" opacity={opacity * 1.5} />
          <circle cx="60" cy="0" r="1" fill="#0ea5e9" opacity={opacity * 1.5} />
          <circle cx="0" cy="60" r="1" fill="#0ea5e9" opacity={opacity * 1.5} />
          <circle cx="60" cy="60" r="1" fill="#0ea5e9" opacity={opacity * 1.5} />
          {/* Cross lines */}
          <line x1="0" y1="30" x2="15" y2="30" stroke="#057baa" strokeWidth="0.3" opacity={opacity * 0.7} />
          <line x1="45" y1="30" x2="60" y2="30" stroke="#057baa" strokeWidth="0.3" opacity={opacity * 0.7} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#brand-geo)" />
    </svg>
  );
}

/**
 * MMK Brand Swoosh — Inspired by the swoosh in the MMK logo.
 * A decorative accent element for headers and banners.
 */
export function BrandSwoosh({
  className = "",
  color = "#0ea5e9",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 25 C40 25 60 5 100 5 C140 5 160 20 200 15"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M0 25 C40 25 60 5 100 5 C140 5 160 20 200 15"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
        strokeDasharray="4 6"
      />
    </svg>
  );
}
