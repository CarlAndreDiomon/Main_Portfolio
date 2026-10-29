"use client";

import { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

export default function PortfolioTheme({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="portfolio-theme" data-theme={theme}>
      {children}
    </div>
  );
}
