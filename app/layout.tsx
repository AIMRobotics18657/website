import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./industry.css";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: {
    default: "AIM Robotics | FTC Team 18657, Bronx NYC",
    template: "%s | AIM Robotics",
  },
  description:
    "AIM Robotics is a student-led FIRST Tech Challenge team from the Bronx. We build a competition robot every season and run the Student Clean Air Network.",
  icons: { icon: "/images/aim-logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
