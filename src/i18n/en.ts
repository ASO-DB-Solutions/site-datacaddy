/**
 * English copy.
 *
 * This module and its siblings must stay **pure data** — no React, no DOM
 * imports — because `vite.config.ts` loads them at config time to build each
 * locale shell's <head>. See ADR-0002.
 *
 * This is the seed of the full extraction: for now it holds the contact form
 * and the privacy notice, which had to be bilingual from the start. The rest
 * of the page's strings move here next, and the shape does not change.
 */
export const en = {
  contact: {
    eyebrow: "Request an assessment",
    heading: "Bring an environment. We'll return the card.",
    blurb:
      "A complimentary assessment on up to five instances: workload, configuration, security and the right size for each one. No installation required.",

    name: "Name",
    email: "Work email",
    company: "Company",
    message: "What would you like read?",
    messagePlaceholder: "Which engines, roughly how many instances, anything specific.",
    optional: "optional",

    submit: "Request the assessment",
    sending: "Sending…",
    successTitle: "Received.",
    successBody: "We'll reply from info@datacaddy.co within one business day.",
    errorTitle: "That didn't send.",
    errorBody: "Try again, or email us directly at info@datacaddy.co.",

    required: "Please fill this in.",
    invalidEmail: "That doesn't look like an email address.",

    consent: "By sending this, you agree we may use your details to reply to you.",
    consentLink: "How we handle it",
    orEmail: "Or email",
  },

  privacy: {
    title: "How we handle your details",
    updated: "Updated 11 September 2026",
    body: [
      {
        h: "Who is responsible",
        p: "ASO DB Solutions is the controller of the personal data you submit through this form. You can reach us at info@datacaddy.co.",
      },
      {
        h: "What we collect, and why",
        p: "Only what you type: your name, work email, company, and your message. We use it for one purpose — to reply to you about the assessment you asked for. We do not use it for marketing lists, and we do not sell or share it.",
      },
      {
        h: "Where it goes",
        p: "The form is processed by Netlify, which hosts this site, and the notification reaches our Microsoft 365 mailbox. Both are operators acting on our instructions.",
      },
      {
        h: "How long we keep it",
        p: "For as long as the conversation is live, and up to 12 months after it ends. After that it is deleted.",
      },
      {
        h: "Your rights",
        p: "Under the LGPD you can ask what we hold about you, correct it, or have it deleted. Write to info@datacaddy.co and we will answer within the legal deadline.",
      },
    ],
    close: "Close",
  },
};
