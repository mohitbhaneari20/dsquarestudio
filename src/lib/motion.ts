/** Shared easing curves so every reveal on the site moves the same way. */
export const EASE_OUT_SOFT = [0.16, 1, 0.3, 1] as const; // long, gentle settle
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const; // for big moves (intro, transitions)

/** Viewport rule for scroll reveals: trigger a little before the element is fully in view. */
export const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;
