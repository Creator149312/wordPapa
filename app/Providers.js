"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const NextAuthProvider = ({ children, ...props }) => {
  return <NextThemesProvider  {...props}>
    <SessionProvider>{children}</SessionProvider>
  </NextThemesProvider>;
};
