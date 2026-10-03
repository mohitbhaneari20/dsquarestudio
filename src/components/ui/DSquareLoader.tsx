import { BrandMark } from '../brand/Brand';

/** Route-loading placeholder: the monogram fades in only if loading takes a moment. */
export function DSquareLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
      <span className="animate-[pulse-dot_1.2s_ease-in-out_infinite] opacity-0 [animation-delay:200ms]">
        <BrandMark title={null} copyright={false} className="size-10" />
      </span>
    </div>
  );
}
