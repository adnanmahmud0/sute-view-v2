import type { SiteConfig } from "@/types/site-config";
import { env } from "@/env";

export const siteConfig: SiteConfig = {
  name: "The Sartorialist Zürich | Massanzüge & Hochzeitsanzüge",
  description:
    "Exklusive Massanzüge, Hochzeitsanzüge und Luxus-Herrenmode in Zürich. Höchste sartoriale Handwerkskunst in der Kuttelgasse 7, 8001 Zürich.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "The Sartorialist Zürich",
  locale: "de",
  themeColor: "#121212",
  keywords: [
    "The Sartorialist Zürich",
    "Massanzug Zürich",
    "Hochzeitsanzug Zürich",
    "Sartoriale Herrenmode",
    "Masskonfektion Schweiz",
    "Loro Piana",
    "Ermenegildo Zegna"
  ],
  social: {
    twitter: "",
    github: "https://github.com/shariarSultanFahim",
    linkedin: "https://www.linkedin.com/in/shariarsultan"
  },
  ogImage: "/og.jpg"
} as const;
