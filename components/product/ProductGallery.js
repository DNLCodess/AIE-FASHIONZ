"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  if (!images.length) {
    return <div className="aspect-[3/4] bg-surface-raised" />;
  }

  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-raised">
        <Image
          src={active.url}
          alt={active.alt || "Product image"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top transition-opacity duration-300"
        />

        {/* Mobile prev/next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-surface/80 backdrop-blur-sm text-foreground hover:bg-surface transition-colors md:hidden"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-surface/80 backdrop-blur-sm text-foreground hover:bg-surface transition-colors md:hidden"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Mobile dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeIndex ? "bg-foreground" : "bg-foreground/30"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip — desktop only */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-3">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 aspect-[3/4] overflow-hidden shrink-0 transition-opacity ${
                i === activeIndex ? "opacity-100 ring-1 ring-foreground" : "opacity-50 hover:opacity-80"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `Product image ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
