"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState, type RefObject } from "react";
import type { ProfileContent } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PeelImage = ProfileContent["onionPeel"]["images"][number];

const SCALE_MIN = 0.45;
const SCALE_MAX = 2.4;
const SCALE_STEP = 1.12;

/** Percent positions for initial placement (z-order is controlled separately). */
const DEFAULT_LAYOUT: { left: number; top: number }[] = [
  { left: 2, top: 6 },
  { left: 26, top: 4 },
  { left: 50, top: 8 },
  { left: 74, top: 5 },
  { left: 10, top: 30 },
  { left: 36, top: 34 },
  { left: 60, top: 28 },
  { left: 78, top: 32 },
  { left: 4, top: 54 },
  { left: 32, top: 58 },
  { left: 56, top: 52 },
  { left: 72, top: 56 },
  { left: 14, top: 18 },
  { left: 42, top: 22 },
  { left: 66, top: 16 },
];

function layoutForIndex(i: number) {
  return DEFAULT_LAYOUT[i % DEFAULT_LAYOUT.length];
}

const stickerImgClass =
  "object-contain p-2 [filter:drop-shadow(0_0_1px_rgb(255_255_255))_drop-shadow(0_0_0_3px_rgb(255_255_255))_drop-shadow(0_0_0_6px_rgb(255_255_255))_drop-shadow(0_14px_28px_rgb(28_25_23/0.22))]";

function DraggablePeelCard({
  item,
  index,
  constraintsRef,
  scale,
  zIndex,
  isSelected,
  onSelect,
}: {
  item: PeelImage;
  index: number;
  constraintsRef: RefObject<HTMLElement | null>;
  scale: number;
  zIndex: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { left, top } = layoutForIndex(index);
  const sticker = Boolean(item.sticker);

  return (
    <motion.div
      className={
        sticker
          ? `absolute w-[min(46vw,15rem)] touch-none select-none md:w-[min(38vw,17rem)] ${
              isSelected ? "cursor-grab ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--wash)]" : "cursor-grab"
            } active:cursor-grabbing`
          : `absolute w-[min(42vw,13.5rem)] touch-none select-none md:w-[min(34vw,15rem)] ${
              isSelected ? "cursor-grab ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--wash)]" : "cursor-grab"
            } active:cursor-grabbing`
      }
      style={{
        left: `${left}%`,
        top: `${top}%`,
        zIndex,
        scale,
      }}
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.06}
      dragMomentum={false}
      whileDrag={{ zIndex: 200, cursor: "grabbing" }}
      onTap={onSelect}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {sticker ? (
        <div className="relative aspect-square w-full overflow-visible">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className={stickerImgClass}
            sizes="(min-width: 768px) 272px, 46vw"
            draggable={false}
          />
        </div>
      ) : (
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--wash-strong)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--rule)]">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 240px, 42vw"
            draggable={false}
          />
        </div>
      )}
    </motion.div>
  );
}

function CollageControls({
  hasSelection,
  onSmaller,
  onBigger,
  onFront,
  onBack,
}: {
  hasSelection: boolean;
  onSmaller: () => void;
  onBigger: () => void;
  onFront: () => void;
  onBack: () => void;
}) {
  return (
    <div
      className="pointer-events-auto absolute bottom-3 left-3 z-[300] flex max-w-[12.5rem] flex-col gap-2 rounded-xl border border-[var(--rule)] bg-[var(--paper)]/95 p-3 shadow-[var(--shadow-soft)] backdrop-blur-sm"
      role="toolbar"
      aria-label="Collage layer controls"
    >
      <p className="text-[0.65rem] font-medium leading-snug text-[var(--muted)]">
        {hasSelection ? "Selected layer" : "Tap a photo to select it"}
      </p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          disabled={!hasSelection}
          onClick={onSmaller}
          className="min-h-9 min-w-[2.75rem] flex-1 rounded-lg border border-[var(--rule)] bg-[var(--wash)] px-2 py-1.5 text-xs font-medium text-[var(--ink)] transition enabled:hover:bg-[var(--wash-strong)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Smaller
        </button>
        <button
          type="button"
          disabled={!hasSelection}
          onClick={onBigger}
          className="min-h-9 min-w-[2.75rem] flex-1 rounded-lg border border-[var(--rule)] bg-[var(--wash)] px-2 py-1.5 text-xs font-medium text-[var(--ink)] transition enabled:hover:bg-[var(--wash-strong)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Bigger
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          disabled={!hasSelection}
          onClick={onFront}
          className="min-h-9 min-w-[2.75rem] flex-1 rounded-lg border border-[var(--rule)] bg-[var(--wash)] px-2 py-1.5 text-xs font-medium text-[var(--ink)] transition enabled:hover:bg-[var(--wash-strong)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Front
        </button>
        <button
          type="button"
          disabled={!hasSelection}
          onClick={onBack}
          className="min-h-9 min-w-[2.75rem] flex-1 rounded-lg border border-[var(--rule)] bg-[var(--wash)] px-2 py-1.5 text-xs font-medium text-[var(--ink)] transition enabled:hover:bg-[var(--wash-strong)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function OnionPeelSection({ data }: { data: ProfileContent["onionPeel"] }) {
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const srcKeys = useMemo(() => data.images.map((i) => i.src), [data.images]);

  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);
  const [scales, setScales] = useState<Record<string, number>>(() =>
    Object.fromEntries(srcKeys.map((src) => [src, 1])),
  );
  const [stackOrder, setStackOrder] = useState<string[]>(() => [...srcKeys]);

  const zForSrc = useCallback(
    (src: string) => {
      const rank = stackOrder.indexOf(src);
      return 20 + Math.max(0, rank) * 2;
    },
    [stackOrder],
  );

  const handleSmaller = useCallback(() => {
    if (!selectedSrc) return;
    setScales((prev) => ({
      ...prev,
      [selectedSrc]: Math.max(SCALE_MIN, (prev[selectedSrc] ?? 1) / SCALE_STEP),
    }));
  }, [selectedSrc]);

  const handleBigger = useCallback(() => {
    if (!selectedSrc) return;
    setScales((prev) => ({
      ...prev,
      [selectedSrc]: Math.min(SCALE_MAX, (prev[selectedSrc] ?? 1) * SCALE_STEP),
    }));
  }, [selectedSrc]);

  const handleFront = useCallback(() => {
    if (!selectedSrc) return;
    setStackOrder((prev) => {
      const next = prev.filter((s) => s !== selectedSrc);
      next.push(selectedSrc);
      return next;
    });
  }, [selectedSrc]);

  const handleBack = useCallback(() => {
    if (!selectedSrc) return;
    setStackOrder((prev) => {
      const next = prev.filter((s) => s !== selectedSrc);
      next.unshift(selectedSrc);
      return next;
    });
  }, [selectedSrc]);

  return (
    <section className="relative overflow-x-hidden bg-[var(--paper)] pt-10 pb-16 md:pt-12 md:pb-20">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <SectionHeader partLabel={data.partLabel} title={data.title} />
        <p className="-mt-4 mb-3 max-w-prose text-base leading-[1.75] text-[var(--body)] md:-mt-6">
          {data.lead}
        </p>
        <p className="mb-8 text-sm text-[var(--muted)]">{data.hint}</p>
      </div>

      <div className="mx-auto w-full max-w-[min(90rem,calc(100vw-1.5rem))] px-3 sm:px-5 md:px-8 lg:px-10">
        <div
          ref={constraintsRef}
          className="relative mx-auto aspect-[5/4] w-full max-h-[min(82vh,42rem)] overflow-hidden rounded-2xl bg-[var(--wash)] ring-1 ring-[var(--rule)] sm:max-h-[min(80vh,46rem)] md:aspect-[16/9] md:max-h-[min(78vh,50rem)] lg:aspect-[2/1] lg:max-h-[min(74vh,56rem)]"
        >
          {reduceMotion ? (
            <div className="grid h-full grid-cols-2 gap-3 p-4 md:grid-cols-2 md:gap-4 md:p-6">
              {data.images.map((item) =>
                item.sticker ? (
                  <div key={item.src} className="relative aspect-square w-full max-w-[11rem] overflow-visible">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className={stickerImgClass}
                      sizes="(min-width: 768px) 176px, 40vw"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div
                    key={item.src}
                    className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--wash-strong)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--rule)]"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 280px, 45vw"
                    />
                  </div>
                ),
              )}
            </div>
          ) : (
            <>
              {data.images.map((item, index) => (
                <DraggablePeelCard
                  key={item.src}
                  item={item}
                  index={index}
                  constraintsRef={constraintsRef}
                  scale={scales[item.src] ?? 1}
                  zIndex={zForSrc(item.src)}
                  isSelected={selectedSrc === item.src}
                  onSelect={() => setSelectedSrc(item.src)}
                />
              ))}
              <CollageControls
                hasSelection={selectedSrc !== null}
                onSmaller={handleSmaller}
                onBigger={handleBigger}
                onFront={handleFront}
                onBack={handleBack}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
