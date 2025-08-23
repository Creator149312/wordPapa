import SideBar from "@components/SideBar";
import "./globals.css";
//import NavbarComponent from "@components/NavBar";
// import NavBarLatest from "@components/NavBarLatest";
import Footer from "@components/Footer";
import SearchNavBar from "@components/SearchNavBar";
import AlphabetLinks from "@components/AlphabetLinks";
import GAnalytics from "./GAnalytics";
import { NextAuthProvider } from "./Providers";
// import { Toaster } from "react-hot-toast";
import { Card } from "@/components/ui/card";
// import MobileTopAdsUnit from "@/components/MobileTopAdsUnit";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@app/api/auth/[...nextauth]/route";

import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "../components/navbar/Navbar";
import AdsScriptLoader from "@components/AdsScriptLoader";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: {
    default: "WordPapa: Master Vocabulary Words with Ease",
    template: "%s - WordPapa",
  },
  description:
    "WordPapa is a enriching vocabulary and word tools hub to find words for games and language learning. Dive into a world of words and become a confident English speaker and writer.",
};

// const SESSION = await getServerSession(authOptions);

const layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <GAnalytics />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="eRHE29e6-yFJJ0WUWShysLxHV_QJkOyv_ZpPc00pzYA"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-slate-100 dark:bg-slate-900 font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextAuthProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="border-b-2">
            <Card className="rounded-none m-0 p-0">
              <Navbar />
            </Card>
          </div>
          {/* <div className="md:hidden z-10"><MobileTopAdsUnit slot='7782807936'/></div> */}
          <main className="grid md:grid-cols-12 gap-x-2 m-2">
            <Card className="md:m-2 mb-2 mt-2 md:p-4 md:col-span-9">
              {children}
              {/** All the main content goes here */}
            </Card>
            <Card className="md:m-2 mb-2 mt-2 md:col-span-3">
              <SideBar />
            </Card>
          </main>
          <AlphabetLinks />
          <Footer />
          {/* <Toaster position="top-right" /> */}
        </NextAuthProvider>
        <AdsScriptLoader />
      </body>
    </html>
  );
};

export default layout;
