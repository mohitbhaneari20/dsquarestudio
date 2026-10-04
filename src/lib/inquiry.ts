import { site } from '../config/site';

export const projectTypes = ['Branding', 'Website', 'UI / UX', 'Development', 'Motion', 'Other'] as const;
/** Budget ranges, ₹75k up to ₹3L+. */
const budgetsINR = ['₹75k–₹1L', '₹1L–₹2L', '₹2L–₹3L', '₹3L+', 'Not sure yet'] as const;
/** The same ranges in US dollars (about ₹86 = $1, rounded) for visitors outside India. */
const budgetsUSD = ['$900–$1.2k', '$1.2k–$2.3k', '$2.3k–$3.5k', '$3.5k+', 'Not sure yet'] as const;

/**
 * Whether the visitor is most likely in India, from the browser's own time zone
 * (falling back to its language). Nothing is looked up or sent anywhere.
 */
export function isInIndia(): boolean {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (zone) return zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta';
  } catch {
    // fall through to the language check
  }
  return typeof navigator !== 'undefined' && /-IN$/i.test(navigator.language);
}

export const budgets: readonly string[] = isInIndia() ? budgetsINR : budgetsUSD;

export interface Inquiry {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

export function validateInquiry(values: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!values.name.trim()) errors.name = 'What should we call you?';
  if (!values.email.trim()) errors.email = 'We need an email to reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'That email doesn’t look quite right.';
  if (!values.projectType) errors.projectType = 'Pick the closest one — “Other” is fine.';
  if (values.message.trim().length < 20) errors.message = 'A couple of sentences helps (20 characters minimum).';
  return errors;
}

export type SubmitResult = { ok: true; via: 'endpoint' | 'email' } | { ok: false; error: string };

/**
 * Integration point for the contact form.
 * Set VITE_FORM_ENDPOINT (see .env.example) to POST JSON to a form service
 * or your own API. Without it, the visitor's email app opens with the
 * inquiry pre-written — nothing is silently lost.
 */
export async function submitInquiry(values: Inquiry): Promise<SubmitResult> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      return { ok: true, via: 'endpoint' };
    } catch {
      return { ok: false, error: `Something went wrong sending that. You can email ${site.email} directly.` };
    }
  }

  const subject = `New project — ${values.projectType}${values.company ? ` / ${values.company}` : ''}`;
  const body = [
    values.message,
    '',
    '—',
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    values.company && `Company: ${values.company}`,
    `Project type: ${values.projectType}`,
    values.budget && `Budget: ${values.budget}`,
  ]
    .filter(Boolean)
    .join('\n');

  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { ok: true, via: 'email' };
}
