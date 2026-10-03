import { createContext, useContext } from 'react';

/** True once the intro screen has finished (or was skipped this session). */
export const IntroContext = createContext(true);

/** Use to hold entrance animations until the intro has handed over to the page. */
export function useIntroDone(): boolean {
  return useContext(IntroContext);
}

