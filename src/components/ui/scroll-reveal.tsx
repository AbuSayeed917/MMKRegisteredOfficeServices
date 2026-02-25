"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 800,
  distance = 40,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    // Set initial styles based on direction
    const transforms: Record<string, string> = {
      up: `translateY(${distance}px)`,
      down: `translateY(-${distance}px)`,
      left: `translateX(${distance}px)`,
      right: `translateX(-${distance}px)`,
      fade: "none",
    };

    el.style.opacity = "0";
    el.style.transform = transforms[direction];
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          el.style.opacity = "0";
          el.style.transform = transforms[direction];
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay, direction, distance, duration, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Stagger children animation wrapper
interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  duration?: number;
  distance?: number;
}

export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 100,
  direction = "up",
  duration = 700,
  distance = 30,
}: StaggerRevealProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          delay={index * staggerDelay}
          direction={direction}
          duration={duration}
          distance={distance}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
