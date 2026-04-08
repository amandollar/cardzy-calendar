'use client';

import Image from 'next/image';

import {
  DEFAULT_HERO_IMAGE,
  GALLERY_YEAR,
  MONTH_IMAGES,
  MONTH_OPTIONS,
  MONTH_QUOTES,
} from './calendar.constants';

type MonthGalleryProps = {
  onOpenMonth: (monthIndex: number) => void;
};

export function MonthGallery({ onOpenMonth }: MonthGalleryProps) {
  return (
    <div className="animate-fade-in-up rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(16,16,20,0.98)_0%,rgba(9,9,11,0.98)_100%)] px-4 pb-[1.1rem] pt-4 shadow-[0_1.4rem_3rem_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)] [background-image:radial-gradient(circle_at_top,rgba(255,139,31,0.12),transparent_28%),linear-gradient(180deg,rgba(16,16,20,0.98)_0%,rgba(9,9,11,0.98)_100%)]">
      <div className="mx-auto max-w-[32rem] px-2 pb-4 pt-2 text-center">
        <p className="inline-flex min-h-[1.7rem] items-center rounded-full border border-[rgba(255,139,31,0.14)] bg-[rgba(255,139,31,0.08)] px-[0.65rem] py-[0.2rem] text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#ffb066]">
          {GALLERY_YEAR} collection
        </p>
        <h1 className="mt-[0.55rem] font-[var(--font-sans)] text-[clamp(1.32rem,2.2vw,1.85rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ink-strong)]">
          Choose a month to open its planner
        </h1>
        <p className="mt-1 text-[0.78rem] leading-[1.4] text-[var(--ink-soft)]">
          A sharper calendar landing for the full year. Pick any month and jump straight into its detailed wall planner.
        </p>
      </div>

      <div className="mx-auto grid max-w-[76rem] grid-cols-2 gap-[0.6rem] p-[0.1rem] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-[0.8rem]">
        {MONTH_OPTIONS.map((month, index) => (
          <button
            key={month}
            type="button"
            className="group animate-fade-in-up relative overflow-hidden rounded-[1.1rem] border border-white/6 bg-[rgba(18,18,22,0.92)] text-left transition duration-180 hover:-translate-y-1 hover:border-[rgba(255,139,31,0.24)] hover:shadow-[0_1rem_1.8rem_rgba(0,0,0,0.26)] hover:saturate-[1.04]"
            onClick={() => onOpenMonth(index)}
          >
            <div className="relative aspect-[4/5.25]">
              <Image
                src={MONTH_IMAGES[index] ?? DEFAULT_HERO_IMAGE}
                alt={`${month} calendar artwork`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,8,0.02)_0%,rgba(6,6,8,0.08)_52%,rgba(6,6,8,0.78)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-[0.18rem] px-3.5 pb-3.5 pt-3">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[rgba(255,244,232,0.68)]">
                  {GALLERY_YEAR}
                </span>
                <strong className="font-[var(--font-sans)] text-[0.98rem] font-bold leading-[1.05] text-[#fffaf4]">
                  {month}
                </strong>
                <p className="mt-[0.08rem] max-w-[11rem] text-[0.67rem] leading-[1.35] text-[rgba(255,244,232,0.78)]">
                  {MONTH_QUOTES[index]}
                </p>
                <em className="text-[0.68rem] font-semibold not-italic tracking-[0.04em] text-[#ff9c43]">
                  Open planner
                </em>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
