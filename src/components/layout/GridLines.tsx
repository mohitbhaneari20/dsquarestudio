/**
 * The page's visible column lines. Fixed behind everything; sections with
 * their own background (dark bands, footer) simply cover them.
 */
export function GridLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="container-site grid h-full grid-cols-2 md:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className={[
              'border-l border-[var(--grid-line)]',
              i >= 2 ? 'hidden md:block' : '',
              i >= 4 ? 'md:hidden xl:block' : '',
              i === 1 ? 'border-r md:border-r-0' : '',
              i === 3 ? 'md:border-r xl:border-r-0' : '',
              i === 5 ? 'xl:border-r' : '',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
