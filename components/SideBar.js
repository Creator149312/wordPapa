// import GoogleAd from "@utils/GoogleAd";
import { CardContent, CardHeader } from "@components/ui/card";
import AdsUnit from "./AdsUnit";
import { Gamepad2 } from "lucide-react";

const SideBar = () => {
  const linkStyles =
    "block py-2 px-3 text-gray-600 dark:text-gray-400 font-medium rounded-lg hover:bg-[#75c32c]/10 hover:text-[#75c32c] transition-all duration-200 border-l-2 border-transparent hover:border-[#75c32c]";

  return (
    <aside className="space-y-6 sticky top-[70px] self-start">
      {/* <a
        href="/games/hangman"
        className="group relative flex flex-col items-center justify-center gap-1 bg-[#75c32c] text-white px-6 py-4 rounded-[2rem] border-2 border-b-8 border-black/20 hover:border-b-4 hover:translate-y-[4px] active:translate-y-[6px] active:border-b-2 transition-all duration-75 shadow-2xl shadow-[#75c32c]/30 min-w-[280px]"
      >
        <div className="flex items-center gap-3">
          <Gamepad2
            size={28}
            strokeWidth={3}
            className="group-hover:rotate-12 transition-transform"
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100">
        Flex your vocabulary, see How long can you last in Endless Run?
        </span>
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[9px] font-bold px-2 py-0.5 rounded-lg border-2 border-zinc-900 rotate-12 shadow-md">
          +XP
        </div>
      </a> */}
      {/* Sidebar Ad Unit — single slot, sticky with the aside */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <AdsUnit slot="3722270586" variant="tall" />
      </div>

      <div className="hidden md:block space-y-6">
        {/* Resources Section */}
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 border-b border-gray-50 dark:border-gray-800">
            <div className="h-5 w-1.5 bg-[#75c32c] rounded-full" />
            <h2 className="text-lg font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Resources
            </h2>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-1">
              <li>
                <a
                  href="https://www.englishbix.com/product/35-word-family-words-tracing-workbook/"
                  className={linkStyles}
                >
                  Word Family Tracing Workbook
                </a>
              </li>
              <li>
                <a
                  href="https://www.englishbix.com/shop/"
                  className={linkStyles}
                >
                  Worksheets and Printables
                </a>
              </li>
            </ul>
          </CardContent>
        </div>

        {/* Spin the Wheel Section */}
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 border-b border-gray-50 dark:border-gray-800">
            <div className="h-5 w-1.5 bg-[#75c32c] rounded-full" />
            <h2 className="text-lg font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Spin the Wheel
            </h2>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-1">
              <li>
                <a href="https://www.spinpapa.com" className={linkStyles}>
                  Custom Wheel Decider
                </a>
              </li>
              <li>
                <a
                  href="https://www.spinpapa.com/search"
                  className={linkStyles}
                >
                  Find Spin Wheels
                </a>
              </li>
            </ul>
          </CardContent>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
