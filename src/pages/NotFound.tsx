import { ButtonLink } from '../components/ui/ButtonLink';
import { Seo } from '../components/ui/Seo';
import { TextReveal } from '../components/ui/TextReveal';

const COLS = 12;
const ROWS = 5;
/** The one square that wandered off */
const STRAY = { col: 8, row: 2 };

export default function NotFound() {
  return (
    <>
      <Seo />
      <section className="container-site flex min-h-[100svh] flex-col justify-center pb-16 pt-32">
        <p className="text-meta border-t border-border pt-4 text-muted">Error 404</p>

        <div className="relative mt-12 grid grid-cols-12 gap-[var(--grid-gap)]" aria-hidden="true">
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const stray = col === STRAY.col && row === STRAY.row;
            return (
              <div key={i} className="relative aspect-square border border-border">
                {stray && <span className="animate-drift absolute left-[38%] top-[44%] block h-full w-full bg-accent" />}
              </div>
            );
          })}
        </div>

        <TextReveal as="h1" immediate lines={['Looks like this page', 'went off-grid.']} className="text-h1 mt-16" />
        <div className="mt-10">
          <ButtonLink to="/" size="lg">
            Back home
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
