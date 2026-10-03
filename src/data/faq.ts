export interface Faq {
  question: string;
  answer: string;
}

/** Homepage questions. Edit freely — keep answers short and honest. */
export const faqs: Faq[] = [
  {
    question: 'Are you a design studio or a development studio?',
    answer:
      'Both — that’s where the name comes from. D² is design and development in one place, so the thing you approve in a mockup is the thing that ships.',
  },
  {
    question: 'Our idea is still rough. Is that too early?',
    answer:
      'Rough is a good time to start. A few conversations and quick sketches usually make it clear what’s worth building first — and what isn’t.',
  },
  {
    question: 'Do you only build what you design?',
    answer:
      'Usually, but not always. We can design for your developers to build, or build from a solid design you already have.',
  },
  {
    question: 'Do you work with no-code tools?',
    answer:
      'Yes. Webflow, Framer and similar tools are great when you want to edit the site yourself. When a project needs custom code, we write it.',
  },
  {
    question: 'What does a project cost?',
    answer:
      'It depends on scope. The contact form has rough budget ranges; after a first conversation we’ll give you a clear number, not a vague estimate.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'You get the files, the code and a walkthrough of how to update things. And we stay around for changes, fixes and whatever comes next.',
  },
];
