import type { ReactNode } from 'react';
import type { GalleryBlock, MediaAsset, Tone } from '../../data/types';
import { cn } from '../../lib/cn';
import { visibleOnLight } from '../../lib/color';
import { ProjectVisual } from '../ui/ProjectVisual';
import { Reveal } from '../ui/Reveal';

interface ProjectGalleryProps {
  blocks: GalleryBlock[];
  tone: Tone;
  label: string;
  slug: string;
  className?: string;
}

/** Collage placements (percent of a 16:10 frame on desktop, 4:5 on mobile). */
const collageSpots = [
  { left: 0, top: 4, width: 52, rotate: -2, z: 1 },
  { left: 44, top: 0, width: 34, rotate: 3, z: 2 },
  { left: 30, top: 46, width: 40, rotate: -1, z: 3 },
  { left: 72, top: 40, width: 26, rotate: 4, z: 0 },
];

/** A board behind the visuals, when the project asks for one (`tone.stage`). */
function Stage({ colour, children }: { colour?: string; children: ReactNode }) {
  if (!colour) return <>{children}</>;
  return (
    <div className="p-3" style={{ backgroundColor: colour }}>
      {children}
    </div>
  );
}

/**
 * Editorial gallery. Each block chooses its own composition, so a case
 * study reads as a sequence of spreads rather than image–text–image.
 */
export function ProjectGallery({ blocks, tone, label, slug, className }: ProjectGalleryProps) {
  if (blocks.length === 0) return null;

  const visual = (media: MediaAsset, aspect: string, sizes: string, caption = true) => (
    <figure>
      <div>
        <ProjectVisual media={media} tone={tone} label={label} slug={slug} className={cn(aspect, 'rounded-sm')} sizes={sizes} />
      </div>
      {caption && <figcaption className="text-meta mt-3 text-muted">{media.caption ?? media.alt}</figcaption>}
    </figure>
  );

  return (
    <section aria-label="Project gallery" className={cn('container-site space-y-20 md:space-y-36', className)}>
      {blocks.map((block, i) => {
        switch (block.layout) {
          case 'full':
          case 'video':
            return <div key={i}>{visual(block.media, 'aspect-[4/5] md:aspect-[16/9]', '100vw')}</div>;

          case 'board': {
            const aspect = {
              '16/10': 'aspect-[16/10]',
              '16/9': 'aspect-[16/9]',
              '4/3': 'aspect-[4/3]',
            }[block.ratio ?? '16/10'];
            // Videos (e.g. the intro) bring their own colour, so they skip the board
            if (!tone.stage || block.media.type === 'video') return <div key={i}>{visual(block.media, aspect, '100vw')}</div>;
            return (
              <figure key={i}>
                <Stage colour={tone.stage}>
                  <div>
                    <ProjectVisual media={block.media} tone={tone} label={label} slug={slug} className={cn(aspect, 'rounded-sm')} sizes="100vw" />
                  </div>
                </Stage>
                <figcaption className="text-meta mt-3 text-muted">{block.media.caption ?? block.media.alt}</figcaption>
              </figure>
            );
          }

          case 'pair':
            return (
              <div key={i} className="grid-site gap-y-16">
                <div className="col-span-12 md:col-span-6">{visual(block.media[0], 'aspect-[4/5]', '(min-width: 768px) 50vw, 100vw')}</div>
                <div className="col-span-12 md:col-span-6 md:mt-24">{visual(block.media[1], 'aspect-[4/5]', '(min-width: 768px) 50vw, 100vw')}</div>
              </div>
            );

          case 'large-small': {
            const small = block.media[1].kind === 'mobile' ? 'aspect-[9/16]' : 'aspect-[4/5]';
            return (
              <div key={i} className="relative pb-24 md:pb-32">
                <div className={cn('md:w-[78%]', block.reverse && 'md:ml-auto')}>{visual(block.media[0], 'aspect-[4/3]', '80vw')}</div>
                <div
                  className={cn(
                    'absolute bottom-0 w-[42%] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] md:w-[24%]',
                    block.reverse ? 'left-4 -rotate-2 md:left-[6%]' : 'right-4 rotate-2 md:right-[6%]',
                  )}
                >
                  {visual(block.media[1], small, '25vw', false)}
                </div>
              </div>
            );
          }

          case 'collage':
            return (
              <figure key={i}>
                <div className="relative aspect-[4/5] md:aspect-[16/10]">
                  {block.media.slice(0, collageSpots.length).map((m, j) => {
                    const spot = collageSpots[j]!;
                    return (
                      <div
                        key={j}
                        className="absolute shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)]"
                        style={{
                          left: `${spot.left}%`,
                          top: `${spot.top}%`,
                          width: `${spot.width}%`,
                          rotate: `${spot.rotate}deg`,
                          zIndex: spot.z,
                        }}
                      >
                        <div>
                          <ProjectVisual media={m} tone={tone} label={label} className="aspect-[4/3] rounded-sm" sizes="50vw" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <figcaption className="text-meta mt-6 text-muted">{block.media.map((m) => m.alt).join(' · ')}</figcaption>
              </figure>
            );

          case 'browser':
            return (
              <figure key={i}>
                <Stage colour={tone.stage}>
                  <div>
                    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[0_40px_80px_-40px_rgb(0_0_0/0.35)]">
                      {/* Minimal browser chrome */}
                      <div className="flex h-9 items-center gap-3 border-b border-border px-4" aria-hidden="true">
                        <span className="flex gap-1.5">
                          {[0, 1, 2].map((d) => (
                            <span key={d} className="size-2.5 rounded-full bg-foreground/15" />
                          ))}
                        </span>
                        {block.url && <span className="mx-auto truncate rounded-full bg-background px-4 py-1 font-mono text-[11px] text-muted">{block.url}</span>}
                        <span className="w-[42px]" />
                      </div>
                      <div style={{ aspectRatio: '16 / 10' }}>
                        <ProjectVisual media={block.media} tone={tone} label={label} slug={slug} className="h-full w-full" sizes="100vw" />
                      </div>
                    </div>
                  </div>
                </Stage>
                <figcaption className="text-meta mt-3 text-muted">{block.media.caption ?? block.media.alt}</figcaption>
              </figure>
            );

          case 'phones':
            return (
              <figure key={i}>
                <Stage colour={tone.stage}>
                  <div className="grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-10 md:flex md:items-start md:justify-center md:gap-8">
                    {block.media.map((m, j) => (
                      // Staggered heights give the row some rhythm on wider screens
                      <div key={j} className={cn('md:w-[min(22%,16rem)]', j % 2 === 1 && 'md:mt-16')}>
                        <div>
                          <div className="rounded-[2.2rem] bg-black p-[6px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
                            <div className="overflow-hidden rounded-[1.85rem]" style={{ aspectRatio: '390 / 844' }}>
                              <ProjectVisual media={m} tone={tone} label={label} className="h-full w-full" sizes="(min-width: 768px) 22vw, 50vw" />
                            </div>
                          </div>
                        </div>
                        <p className={cn('text-meta mt-3 text-center', tone.stage ? 'text-[#fafafa]/70' : 'text-muted')}>{m.caption ?? m.alt}</p>
                      </div>
                    ))}
                  </div>
                </Stage>
                {block.caption && <figcaption className="text-meta mt-8 text-center text-muted">{block.caption}</figcaption>}
              </figure>
            );

          case 'strip':
            return (
              <figure key={i}>
                <div
                  className={cn(
                    'grid gap-[var(--grid-gap)]',
                    block.media.length >= 5 ? 'grid-cols-2 md:grid-cols-5' : block.media.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3',
                  )}
                >
                  {block.media.map((m, j) => (
                    <div key={j}>
                      <div>
                        <div className="overflow-hidden rounded-[2px]" style={{ aspectRatio: block.ratio }}>
                          <ProjectVisual media={m} tone={tone} label={label} className="h-full w-full" sizes="(min-width: 768px) 25vw, 50vw" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <figcaption className="text-meta mt-4 text-muted">{block.caption ?? block.media.map((m) => m.alt).join(' · ')}</figcaption>
              </figure>
            );

          case 'statement':
            return (
              <Reveal key={i} className="grid-site">
                <p className="col-span-12 text-[clamp(2.5rem,7vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.05em] md:col-span-10 md:col-start-2">
                  <span className="mr-3 inline-block" style={{ color: visibleOnLight(tone) }} aria-hidden="true">
                    ■
                  </span>
                  {block.text}
                </p>
              </Reveal>
            );

          case 'text-image':
            return (
              <div key={i} className="grid-site items-end gap-y-8">
                <Reveal className={cn('col-span-12 md:col-span-4', block.reverse ? 'md:order-2 md:col-start-9' : '')}>
                  <h3 className="text-h3">{block.title}</h3>
                  <p className="mt-4 max-w-sm text-muted">{block.body}</p>
                </Reveal>
                <div className={cn('col-span-12 md:col-span-7', block.reverse ? 'md:order-1 md:col-start-1' : 'md:col-start-6')}>
                  {visual(block.media, 'aspect-[4/3]', '(min-width: 768px) 58vw, 100vw')}
                </div>
              </div>
            );
        }
      })}
    </section>
  );
}
