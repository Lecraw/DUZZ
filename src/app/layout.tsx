import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { ThemeProvider } from "@/components/theme-provider";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DUZZ — Win DECA. Don't Just Compete.",
  description:
    "The all-in-one platform to master roleplays, dominate exams, and build winning projects. AI-powered DECA performance training.",
  openGraph: {
    title: "DUZZ — Win DECA. Don't Just Compete.",
    description:
      "The all-in-one platform to master roleplays, dominate exams, and build winning projects.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DUZZ — Win DECA. Don't Just Compete.",
    description:
      "The all-in-one platform to master roleplays, dominate exams, and build winning projects.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
