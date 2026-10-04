/** Global studio details: domain, inboxes, booking link and social profiles. */
export const site = {
  name: 'Dsquare Studio',
  shortName: 'DSQUARE',
  tagline: 'Design + Development Studio',
  url: 'https://www.dsquare.studio',
  email: 'hello@dsquare.studio',
  /** 30-minute intro call, embedded on /contact#book */
  calendly: 'https://calendly.com/mohitbhaneari20/30min',
  defaultTitle: 'Dsquare Studio — Design + Development',
  defaultDescription:
    'Dsquare is an independent design and development studio creating brands, digital experiences, websites and products.',
  ogImage: '/og-image.png',
  year: 2026,
  /** Shown as small edge details on /work. TODO: confirm. */
  location: { label: 'India', coords: '30°N / 78°E', timeZone: 'Asia/Kolkata', tzLabel: 'IST' },
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/mbee_2095/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/105914326/' },
    { label: 'Behance', href: 'https://www.behance.net/dsquare2' },
  ],
} as const;

export const navigation = [
  { label: 'Work', to: '/work' },
  { label: 'Ongoing', to: '/ongoing' },
  { label: 'About D²', to: '/studio' },
  { label: 'Services', to: '/services' },
] as const;
