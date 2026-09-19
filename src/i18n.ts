import { getRequestConfig } from "next-intl/server";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  const locale = locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : "ar";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});