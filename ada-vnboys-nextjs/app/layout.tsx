import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PageTransition from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "Views as Votes, a Datastory of Political Polarization",
  description: "Is YouTube a mirror or a distortion of American politics?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="chrome=1" />
        <link rel="icon" type="image/png" href="/assets/img/favicon.png" />
        <link rel="stylesheet" href="/assets/css/styles.css" />
        <meta name="viewport" content="width=device-width" />
      </head>
      <body>
        <Header />

        <PageTransition>
          <main>{children}</main>
        </PageTransition>

        <Footer />

        <Script src="/assets/js/scale.fix.js" />
      </body>
    </html>
  );
}
