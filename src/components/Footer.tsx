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
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href={`/${locale}`}
              className="group inline-flex items-center"
              aria-label={isArabic ? "خطوات المستقبل" : "Future Steps"}
            >
              <Logo />
            </Link>

            <p className="mt-5 max-w-[38ch] text-sm leading-7 text-[var(--color-ink)]/65">
              {t("description")}
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-px w-8 bg-[var(--color-accent)]" />

              <span className="initiative-code text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/45">
                {t("tagline")}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="fs-label text-[var(--color-navy)]">
              {t("links_title")}
            </h3>

            <ul className="flex flex-col gap-3">
              {linkKeys.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className={linkClass}>
                    {t(`links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-4">
            <h3 className="fs-label text-[var(--color-navy)]">
              {t("platform_title")}
            </h3>

            <ul className="flex flex-col gap-3">
              {platformLinks.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className={linkClass}>
                    {t(`platform.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="fs-label text-[var(--color-navy)]">
              {t("contact_title")}
            </h3>

            <div className="flex flex-col gap-4">
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
        </div>

        {/* Bottom */}
        <div
          className="
            mt-12 flex flex-col gap-4
            border-t border-[var(--color-line)]
            pt-6
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <p className="initiative-code text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink)]/45">
            {t("copyright", {
              year: new Date().getFullYear(),
            })}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-[var(--color-ink)]/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-growth)]" />

            <span>{t("tagline")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}