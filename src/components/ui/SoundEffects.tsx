import { useEffect } from 'react';
import { playClick, playKey } from '../../lib/sound';

/** Keys that produce a typing sound (characters plus a few editing keys). */
const TYPING_KEYS = new Set(['Backspace', 'Delete', 'Enter', ' ']);

/**
 * Site-wide UI sounds: a soft tick on every mouse click, and a keyboard clack
 * while typing in form fields. Renders nothing.
 */
export function SoundEffects() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button === 0) playClick();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const field = (e.target as Element | null)?.closest?.('input, textarea, [contenteditable="true"]');
      if (!field) return;
      if (e.key.length === 1 || TYPING_KEYS.has(e.key)) playKey(e.key);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
  return null;
}
