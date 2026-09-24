"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { HiMail } from "react-icons/hi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { Logo } from "@/components/Header";
import { Reveal } from "@/components/Reveal";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const isArabic = locale === "ar";

  const linkKeys = [
    { key: "home", href: `/${locale}` },
    { key: "about", href: `/${locale}/about` },
    { key: "initiatives", href: `/${locale}/initiatives` },
    { key: "contact", href: `/${locale}/contact` },
  ];

  const platformLinks = [
    {
      key: "howItWorks",
      href: `/${locale}#how-it-works`,
    },
    {
      key: "impact",
      href: `/${locale}#impact`,
    },
    {
      key: "programs",
      href: `/${locale}#programs`,
    },
    {
      key: "faq",
      href: `/${locale}#faq`,
    },
  ];

  const linkClass =
    "text-[13px] text-[var(--color-ink)]/65 transition-colors hover:text-[var(--color-accent)]";

  return (
    <footer
      dir={isArabic ? "rtl" : "ltr"}
      className="
        border-t border-[var(--color-line)]
        bg-[var(--fs-paper)]
        text-[var(--color-ink)]
      "
    >
      {/* Main Footer */}
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">

          {/* Brand */}
          <Reveal>
            <div className="text-center lg:col-span-2 lg:text-start">
              <Link
                href={`/${locale}`}
                className="group inline-flex items-center"
                aria-label={isArabic ? "خطوات المستقبل" : "Future Steps"}
              >
                <Logo />
              </Link>

              <p className="mx-auto mt-5 max-w-[38ch] text-sm leading-7 text-[var(--color-ink)]/65 lg:mx-0">
                {t("description")}
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 lg:justify-start">
                <span className="h-px w-8 bg-[var(--color-accent)]" />

                <span className="initiative-code text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/45">
                  {t("tagline")}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Navigation */}
          <Reveal delay={120}>
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <h3 className="fs-label text-[var(--color-navy)]">
                {t("links_title")}
              </h3>

              <ul className="flex flex-col items-center gap-3 lg:items-start">
                {linkKeys.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className={linkClass}>
                      {t(`links.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Platform */}
          <Reveal delay={240}>
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <h3 className="fs-label text-[var(--color-navy)]">
                {t("platform_title")}
              </h3>

              <ul className="flex flex-col items-center gap-3 lg:items-start">
                {platformLinks.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className={linkClass}>
                      {t(`platform.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={360}>
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <h3 className="fs-label text-[var(--color-navy)]">
                {t("contact_title")}
              </h3>

              <div className="flex flex-col items-center gap-4 lg:items-start">
                <Link
                  href="mailto:info@futuresteps.org"
                  className="
                    group flex items-start gap-2.5
                    text-[13px]
                    text-[var(--color-ink)]/65
                    transition-colors
                    hover:text-[var(--color-accent)]
                  "
                >
                  <HiMail
                    className="
                      mt-0.5 h-4 w-4 shrink-0
                      text-[var(--color-accent)]
                    "
                  />

                  <span dir="ltr">info@futuresteps.org</span>
                </Link>

                {/* Social */}
                <div className="flex items-center gap-2.5">
                  <Link
                    href="#"
                    aria-label="Facebook"
                    className="
                      flex h-8 w-8 items-center justify-center
                      border border-[var(--color-line)]
                      text-[var(--color-ink)]/55
                      transition-all
                      hover:border-[var(--color-accent)]
                      hover:text-[var(--color-accent)]
                    "
                  >
                    <FaFacebookF className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="#"
                    aria-label="Instagram"
                    className="
                      flex h-8 w-8 items-center justify-center
                      border border-[var(--color-line)]
                      text-[var(--color-ink)]/55
                      transition-all
                      hover:border-[var(--color-accent)]
                      hover:text-[var(--color-accent)]
                    "
                  >
                    <FaInstagram className="h-4 w-4" />
                  </Link>

                  <Link
                    href="#"
                    aria-label="LinkedIn"
                    className="
                      flex h-8 w-8 items-center justify-center
                      border border-[var(--color-line)]
                      text-[var(--color-ink)]/55
                      transition-all
                      hover:border-[var(--color-accent)]
                      hover:text-[var(--color-accent)]
                    "
                  >
                    <FaLinkedinIn className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom */}
        <Reveal delay={480}>
          <div
            className="
              mt-14 flex flex-col items-center gap-4
              border-t border-[var(--color-line)]
              pt-6
              sm:flex-row sm:items-center sm:justify-between
            "
          >
            <p className="initiative-code text-center text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink)]/45 sm:text-start">
              {t("copyright", {
                year: new Intl.NumberFormat("en-US", {
                  useGrouping: false,
                }).format(new Date().getFullYear()),
              })}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[var(--color-ink)]/45">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-growth)]" />

              <span>{t("tagline")}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}