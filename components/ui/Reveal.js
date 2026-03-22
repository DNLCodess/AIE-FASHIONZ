"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal wrapper.
 * Adds `.is-visible` class when the element enters the viewport.
 * CSS in globals.css handles the actual animation.
 *
 * @param {"up"|"fade"} reveal   - animation type (maps to data-reveal attribute)
 * @param {number}      delay    - stagger index 1–6 (maps to data-delay attribute)
 * @param {string}      as       - rendered HTML tag, default "div"
 * @param {number}      threshold - intersection threshold, default 0.12
 */
export default function Reveal({
  children,
  className = "",
  reveal = "up",
  delay,
  as: Tag = "div",
  threshold = 0.12,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el); // fire once only — luxury motion doesn't loop
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-reveal={reveal}
      data-delay={delay ? String(delay) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
