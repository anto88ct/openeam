/** Shared, non-page-specific UI strings. Page copy lives next to each page template instead. */
export const ui = {
  it: {
    skipLink: 'Salta al contenuto',
    navAriaLabel: 'Navigazione principale',
    burgerAriaLabel: 'Apri menu',
    langSwitchAriaLabel: 'Cambia lingua',
    footerTagline: "L'EAM su misura per i tuoi processi.",
    footerCopyright: 'Open EAM è un prodotto di Seedma SRL. Tutti i diritti sono riservati.',
    legalUpdatedLabel: 'Ultimo aggiornamento:',
    ogLocale: 'it_IT',
    trustHeading: 'Il software di manutenzione e asset management scelto da',
    cookieBannerText:
      'Questo sito utilizza unicamente cookie tecnici, necessari al corretto funzionamento della piattaforma. Non sono presenti cookie di profilazione o di tracciamento di terze parti.',
    cookieBannerAccept: 'Ho capito',
    cookieBannerLink: 'Cookie Policy',
  },
  en: {
    skipLink: 'Skip to content',
    navAriaLabel: 'Main navigation',
    burgerAriaLabel: 'Open menu',
    langSwitchAriaLabel: 'Change language',
    footerTagline: 'The EAM tailored to your processes.',
    footerCopyright: 'Open EAM is a product of Seedma SRL. All rights reserved.',
    legalUpdatedLabel: 'Last updated:',
    ogLocale: 'en_US',
    trustHeading: 'The maintenance and asset management software chosen by',
    cookieBannerText:
      'This site uses only technical cookies, strictly necessary for the platform to work correctly. No profiling or third-party tracking cookies are used.',
    cookieBannerAccept: 'Got it',
    cookieBannerLink: 'Cookie Policy',
  },
} as const;

export type UiKey = keyof typeof ui.it;
