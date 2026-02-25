"use client";

import { useEffect, useRef } from "react";

// Animated floating document SVG for hero/features
export function FloatingDocumentSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes docFloat { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(1deg); } }
          @keyframes lineShimmer { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
          .doc-body { animation: docFloat 4s ease-in-out infinite; }
          .doc-line { animation: lineShimmer 3s ease-in-out infinite; }
          .doc-line:nth-child(2) { animation-delay: 0.3s; }
          .doc-line:nth-child(3) { animation-delay: 0.6s; }
          .doc-line:nth-child(4) { animation-delay: 0.9s; }
        `}
      </style>
      <g className="doc-body">
        <rect x="10" y="10" width="100" height="140" rx="8" fill="#0c2d42" opacity="0.1" />
        <rect x="10" y="10" width="100" height="140" rx="8" fill="url(#docGrad)" />
        <rect x="10" y="10" width="100" height="35" rx="8" fill="#0ea5e9" opacity="0.15" />
        <circle cx="35" cy="27" r="8" fill="#0ea5e9" opacity="0.3" />
        <rect className="doc-line" x="50" y="22" width="45" height="4" rx="2" fill="#0ea5e9" opacity="0.4" />
        <rect className="doc-line" x="50" y="30" width="30" height="3" rx="1.5" fill="#0ea5e9" opacity="0.25" />
        <rect className="doc-line" x="25" y="58" width="70" height="4" rx="2" fill="#0c2d42" opacity="0.12" />
        <rect className="doc-line" x="25" y="70" width="55" height="4" rx="2" fill="#0c2d42" opacity="0.08" />
        <rect className="doc-line" x="25" y="82" width="65" height="4" rx="2" fill="#0c2d42" opacity="0.1" />
        <rect className="doc-line" x="25" y="94" width="45" height="4" rx="2" fill="#0c2d42" opacity="0.07" />
        <rect x="25" y="115" width="30" height="20" rx="4" fill="#0ea5e9" opacity="0.2" />
        <path d="M30 125 L40 125 L35 120 Z" fill="#0ea5e9" opacity="0.4" />
      </g>
      <defs>
        <linearGradient id="docGrad" x1="10" y1="10" x2="110" y2="150">
          <stop stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#f0f7fb" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Animated shield/security SVG
export function AnimatedShieldSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes shieldPulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
          @keyframes checkDraw { 0% { stroke-dashoffset: 30; } 100% { stroke-dashoffset: 0; } }
          .shield-body { animation: shieldPulse 3s ease-in-out infinite; transform-origin: center; }
          .shield-check { stroke-dasharray: 30; animation: checkDraw 2s ease-out forwards; }
        `}
      </style>
      <g className="shield-body">
        <path
          d="M50 8L12 28V56C12 82 28 106 50 114C72 106 88 82 88 56V28L50 8Z"
          fill="url(#shieldGrad)"
          stroke="#0ea5e9"
          strokeWidth="2"
          opacity="0.9"
        />
        <path
          d="M50 16L20 32V56C20 78 34 100 50 108C66 100 80 78 80 56V32L50 16Z"
          fill="#0ea5e9"
          opacity="0.1"
        />
      </g>
      <path
        className="shield-check"
        d="M35 58L45 68L65 48"
        stroke="#0ea5e9"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="shieldGrad" x1="12" y1="8" x2="88" y2="114">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4f0f8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Animated building/office SVG
export function AnimatedBuildingSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes windowGlow { 0%, 100% { fill-opacity: 0.15; } 50% { fill-opacity: 0.4; } }
          @keyframes buildingRise { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0px); opacity: 1; } }
          .building { animation: buildingRise 1s ease-out forwards; }
          .building-2 { animation-delay: 0.2s; opacity: 0; }
          .building-3 { animation-delay: 0.4s; opacity: 0; }
          .window { animation: windowGlow 4s ease-in-out infinite; }
          .window:nth-child(odd) { animation-delay: 1s; }
        `}
      </style>
      {/* Ground */}
      <rect x="10" y="168" width="180" height="4" rx="2" fill="#0c2d42" opacity="0.1" />

      {/* Building 1 - Main */}
      <g className="building">
        <rect x="50" y="40" width="60" height="128" rx="4" fill="url(#buildGrad1)" />
        <rect className="window" x="58" y="50" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="78" y="50" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="98" y="50" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="58" y="72" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="78" y="72" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="98" y="72" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="58" y="94" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="78" y="94" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="98" y="94" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="58" y="116" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="78" y="116" width="12" height="14" rx="2" fill="#0ea5e9" />
        <rect className="window" x="98" y="116" width="12" height="14" rx="2" fill="#0ea5e9" />
        {/* Door */}
        <rect x="70" y="145" width="20" height="23" rx="3" fill="#0c2d42" opacity="0.3" />
      </g>

      {/* Building 2 - Left */}
      <g className="building building-2">
        <rect x="18" y="70" width="40" height="98" rx="4" fill="url(#buildGrad2)" />
        <rect className="window" x="24" y="78" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="40" y="78" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="24" y="98" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="40" y="98" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="24" y="118" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="40" y="118" width="10" height="12" rx="2" fill="#0ea5e9" />
      </g>

      {/* Building 3 - Right */}
      <g className="building building-3">
        <rect x="118" y="85" width="50" height="83" rx="4" fill="url(#buildGrad3)" />
        <rect className="window" x="126" y="93" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="144" y="93" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="126" y="113" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="144" y="113" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="126" y="133" width="10" height="12" rx="2" fill="#0ea5e9" />
        <rect className="window" x="144" y="133" width="10" height="12" rx="2" fill="#0ea5e9" />
      </g>

      <defs>
        <linearGradient id="buildGrad1" x1="50" y1="40" x2="110" y2="168">
          <stop stopColor="#0c2d42" />
          <stop offset="1" stopColor="#134e6a" />
        </linearGradient>
        <linearGradient id="buildGrad2" x1="18" y1="70" x2="58" y2="168">
          <stop stopColor="#134e6a" />
          <stop offset="1" stopColor="#1a6d8e" />
        </linearGradient>
        <linearGradient id="buildGrad3" x1="118" y1="85" x2="168" y2="168">
          <stop stopColor="#134e6a" />
          <stop offset="1" stopColor="#1a6d8e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Animated mail/envelope SVG
export function AnimatedMailSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes envelopeFloat { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-5px) rotate(-1deg); } }
          @keyframes letterPeek { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          .envelope { animation: envelopeFloat 3.5s ease-in-out infinite; }
          .letter { animation: letterPeek 4s ease-in-out infinite; animation-delay: 0.5s; }
        `}
      </style>
      <g className="envelope">
        {/* Letter peeking out */}
        <g className="letter">
          <rect x="22" y="25" width="76" height="50" rx="4" fill="#ffffff" stroke="#c0d8e8" strokeWidth="1" />
          <rect x="32" y="35" width="40" height="3" rx="1.5" fill="#0ea5e9" opacity="0.4" />
          <rect x="32" y="42" width="56" height="2" rx="1" fill="#0c2d42" opacity="0.1" />
          <rect x="32" y="48" width="48" height="2" rx="1" fill="#0c2d42" opacity="0.08" />
          <rect x="32" y="54" width="52" height="2" rx="1" fill="#0c2d42" opacity="0.06" />
        </g>

        {/* Envelope body */}
        <rect x="10" y="38" width="100" height="55" rx="6" fill="url(#mailGrad)" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.95" />

        {/* Envelope flap */}
        <path d="M10 44L60 72L110 44" stroke="#0ea5e9" strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* Badge */}
        <circle cx="95" cy="42" r="10" fill="#0ea5e9" opacity="0.2" />
        <path d="M91 42L94 45L100 39" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
      <defs>
        <linearGradient id="mailGrad" x1="10" y1="38" x2="110" y2="93">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#f0f7fb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Animated payment/wallet SVG
export function AnimatedPaymentSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes cardSlide { 0%, 100% { transform: translate(0, 0) rotate(0); } 50% { transform: translate(3px, -3px) rotate(1deg); } }
          @keyframes coinBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          .credit-card { animation: cardSlide 4s ease-in-out infinite; }
          .coin { animation: coinBounce 2.5s ease-in-out infinite; }
          .coin:nth-child(2) { animation-delay: 0.3s; }
          .coin:nth-child(3) { animation-delay: 0.6s; }
        `}
      </style>
      <g className="credit-card">
        {/* Card shadow */}
        <rect x="13" y="23" width="100" height="62" rx="8" fill="#0c2d42" opacity="0.08" />
        {/* Card body */}
        <rect x="10" y="20" width="100" height="62" rx="8" fill="url(#cardGrad)" stroke="#0ea5e9" strokeWidth="1.5" />
        {/* Card stripe */}
        <rect x="10" y="35" width="100" height="10" fill="#0c2d42" opacity="0.15" />
        {/* Chip */}
        <rect x="22" y="48" width="14" height="10" rx="2" fill="#0ea5e9" opacity="0.3" stroke="#0ea5e9" strokeWidth="0.5" />
        {/* Numbers */}
        <rect x="22" y="64" width="30" height="3" rx="1.5" fill="#0c2d42" opacity="0.15" />
        <rect x="58" y="64" width="20" height="3" rx="1.5" fill="#0c2d42" opacity="0.1" />
      </g>

      {/* Coins */}
      <g className="coin">
        <circle cx="118" cy="40" r="12" fill="#0ea5e9" opacity="0.2" stroke="#0ea5e9" strokeWidth="1" />
        <text x="118" y="44" textAnchor="middle" fill="#0ea5e9" fontSize="10" fontWeight="bold" opacity="0.6">£</text>
      </g>
      <g className="coin">
        <circle cx="126" cy="60" r="9" fill="#0ea5e9" opacity="0.15" stroke="#0ea5e9" strokeWidth="1" />
        <text x="126" y="63" textAnchor="middle" fill="#0ea5e9" fontSize="8" fontWeight="bold" opacity="0.5">£</text>
      </g>

      <defs>
        <linearGradient id="cardGrad" x1="10" y1="20" x2="110" y2="82">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#f0f7fb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Animated process step circle with number
export function AnimatedStepCircle({
  number,
  className = "",
  delay = 0
}: {
  number: number;
  className?: string;
  delay?: number;
}) {
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            circle.style.strokeDashoffset = "0";
          }, delay);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(circle);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#0ea5e9" opacity="0.08" />
      <circle cx="40" cy="40" r="36" fill="url(#stepBg)" />
      <circle
        ref={circleRef}
        cx="40"
        cy="40"
        r="36"
        stroke="#0ea5e9"
        strokeWidth="2"
        fill="none"
        strokeDasharray="226"
        strokeDashoffset="226"
        strokeLinecap="round"
        style={{
          transition: `stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        }}
      />
      <text
        x="40"
        y="47"
        textAnchor="middle"
        fill="#0ea5e9"
        fontSize="22"
        fontWeight="700"
        fontFamily="var(--font-display)"
      >
        {number}
      </text>
      <defs>
        <radialGradient id="stepBg" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#0ea5e9" stopOpacity="0.05" />
          <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.02" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Floating particles background
export function FloatingParticles({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          @keyframes particleFloat1 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(20px, -30px); } 50% { transform: translate(-15px, -50px); } 75% { transform: translate(25px, -20px); } }
          @keyframes particleFloat2 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-30px, 15px); } 50% { transform: translate(20px, -25px); } 75% { transform: translate(-10px, 30px); } }
          @keyframes particleFloat3 { 0%, 100% { transform: translate(0, 0); opacity: 0.3; } 50% { transform: translate(15px, -20px); opacity: 0.6; } }
          .p1 { animation: particleFloat1 12s ease-in-out infinite; }
          .p2 { animation: particleFloat2 15s ease-in-out infinite; }
          .p3 { animation: particleFloat3 10s ease-in-out infinite; }
        `}
      </style>
      {/* Small dots */}
      <circle className="p1" cx="100" cy="100" r="2" fill="#0ea5e9" opacity="0.3" />
      <circle className="p2" cx="200" cy="200" r="1.5" fill="#38bdf8" opacity="0.25" />
      <circle className="p3" cx="350" cy="150" r="2.5" fill="#0ea5e9" opacity="0.2" />
      <circle className="p1" cx="500" cy="100" r="1.5" fill="#38bdf8" opacity="0.3" />
      <circle className="p2" cx="650" cy="250" r="2" fill="#0ea5e9" opacity="0.25" />
      <circle className="p3" cx="750" cy="100" r="1.5" fill="#38bdf8" opacity="0.2" />
      <circle className="p1" cx="400" cy="350" r="2" fill="#0ea5e9" opacity="0.15" />
      <circle className="p2" cx="550" cy="450" r="1.5" fill="#38bdf8" opacity="0.2" />
      <circle className="p3" cx="150" cy="400" r="2" fill="#0ea5e9" opacity="0.25" />
      <circle className="p1" cx="700" cy="400" r="2.5" fill="#38bdf8" opacity="0.15" />
      <circle className="p2" cx="300" cy="500" r="1.5" fill="#0ea5e9" opacity="0.2" />
      <circle className="p3" cx="600" cy="350" r="2" fill="#38bdf8" opacity="0.25" />

      {/* Connecting lines (subtle) */}
      <line className="p1" x1="100" y1="100" x2="200" y2="200" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.08" />
      <line className="p2" x1="350" y1="150" x2="500" y2="100" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.06" />
      <line className="p3" x1="650" y1="250" x2="750" y2="100" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.07" />
    </svg>
  );
}

// Animated counter component
export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
  className = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = `${prefix}${current}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = `${prefix}${target}${suffix}`;
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, prefix, duration]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
