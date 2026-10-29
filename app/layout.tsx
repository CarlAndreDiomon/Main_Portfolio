import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./_providers/ConvexProvider";
import { ThemeProvider } from "./_providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Portfolio — Product Engineer",
  description:
    "A dynamic personal portfolio built with Next.js and Convex. Explore my projects, skills, experience, and more.",
  keywords: ["portfolio", "product engineer", "full-stack", "developer"],
  authors: [{ name: "Portfolio Owner" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Portfolio — Product Engineer",
    description: "Dynamic personal portfolio built with Next.js and Convex.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ThemeProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
