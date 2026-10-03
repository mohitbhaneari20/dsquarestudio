import { Reveal } from '../ui/Reveal';
import { SquareBullet } from '../ui/SquareBullet';

const points = [
  'Designed and built by the same hands',
  'No handoff between Figma and code',
  'Small on purpose — you talk to the maker',
  'Unfinished work shared in public',
];

export function StudioIntro() {
  return (
    <section className="container-site section-space">
      <div className="grid-site gap-y-10">
        <p className="text-meta col-span-12 flex items-center gap-2 text-muted md:col-span-3 md:tag-top-h3">
          <SquareBullet /> Studio
        </p>
        <div className="col-span-12 md:col-span-9 lg:col-span-8">
          <Reveal>
            <p className="text-h3">
              Dsquare is an independent studio where design and development happen in the same place. We shape brands,
              websites and digital products — then build them, so nothing gets lost between the idea and the browser.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-14 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-baseline gap-3 text-lg tracking-tight">
                  <SquareBullet className="translate-y-[-2px]" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
