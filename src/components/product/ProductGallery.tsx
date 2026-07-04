"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn } from "lucide-react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex gap-3 sm:flex-col">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1}`}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-[1.5px] transition-all duration-200 hover:opacity-90 sm:h-20 sm:w-20 ${
              active === i ? "border-orisirisi" : "border-ink/[0.12]"
            }`}
          >
            <Image src={src} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>

      <div
        className="group relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-card bg-ink/[0.04]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 0.84, 0.44, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={alt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              style={
                zooming
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: "scale(1.9)" }
                  : undefined
              }
              className="object-cover contrast-[1.03] grayscale-[8%] transition-transform duration-200 ease-out"
            />
          </motion.div>
        </AnimatePresence>

        <span
          className={`pointer-events-none absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm transition-opacity duration-200 ${
            zooming ? "opacity-0" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          }`}
        >
          <ZoomIn size={15} />
        </span>
      </div>
    </div>
  );
}
