import SideBar from "@components/SideBar";
import "./globals.css";
import Footer from "@components/Footer";
import AlphabetLinks from "@components/AlphabetLinks";
import GAnalytics from "./GAnalytics";
import { NextAuthProvider } from "./Providers";
import { Card } from "@/components/ui/card";
import { ProfileProvider } from './ProfileContext';
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "../components/navbar/Navbar";
import AdsScriptLoader from "@components/AdsScriptLoader";
import MobileAppChrome from "@components/mobile/MobileAppChrome";

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
          "min-h-screen bg-gray-50 dark:bg-gray-950 font-sans antialiased selection:bg-[#75c32c]/30 selection:text-[#5fa323]",
          fontSans.variable,
        )}
      >
        <NextAuthProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        ><ProfileProvider>
            <MobileAppChrome />
            {/* Navbar Wrapper - Removed the harsh border-b-2 */}
            <div className="sticky top-0 z-[100] hidden md:block">
              <Card className="rounded-none border-none shadow-none m-0 p-0 overflow-visible">
                <Navbar />
              </Card>
            </div>

            {/* Main Content Grid */}
            <main className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-4 p-3 pb-16 md:p-4 md:pb-4 pt-4 md:pt-6">
              {/* Primary Content Area - Large Rounded Corners */}
              <Card className="md:col-span-9 border-none bg-white dark:bg-gray-900 shadow-sm rounded-[2rem] md:rounded-[2.5rem] md:p-6 overflow-hidden min-h-[80vh]">
                {children}
              </Card>

              {/* Sidebar Area - Subtle design to keep focus on main content */}
              <Card className="hidden md:block md:col-span-3 border-none bg-transparent shadow-none rounded-[2.5rem]">
                <SideBar />
              </Card>
            </main>

            <div className="mt-8 space-y-8">
              <AlphabetLinks />
              <Footer />
            </div>
          </ProfileProvider>
        </NextAuthProvider>
        <AdsScriptLoader />
      </body>
    </html>
  );
};

export default layout;
