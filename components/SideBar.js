// import GoogleAd from "@utils/GoogleAd";
import { CardContent, CardHeader } from "@components/ui/card";
import AdsUnit from "./AdsUnit";

const SideBar = () => {
  return (
    <>
      <AdsUnit slot="3722270586" />
      <div className="hidden md:block">
        {/* This List of Links to englishbix.com is only displayed in desktop */}
        <CardHeader>
          <h2 className="text-2xl font-extrabold">Resources</h2>
        </CardHeader>
        <CardContent>
          <ul>
            <li className="no-style-list mb-2">
              <a href="https://www.englishbix.com/product/35-word-family-words-tracing-workbook/">
                Word Family Tracing Workbook
              </a>
            </li>
            <li className="no-style-list mb-2">
              <a href="https://www.englishbix.com/shop/">
                Worksheets and Printables for Kids
              </a>
            </li>
          </ul>
        </CardContent>
      </div>
      {/* This Ad is only displayed in desktop */}
      <div className="hidden md:block">
        <AdsUnit slot="3722270586" />
      </div>
      {/* ad for Spinwheel website goes after two ads */}
      <div className="hidden md:block">
        {/* This List of Links to spinpapa.com is only displayed in desktop */}
        <CardHeader>
          <h2 className="text-2xl font-extrabold">Spin the Wheel</h2>
        </CardHeader>
        <CardContent>
          <ul>
            <li className="no-style-list mb-2">
              <a href="https://www.spinpapa.com">
                Make a Custom Wheel Decider
              </a>
            </li>
            <li className="no-style-list mb-2">
              <a href="https://www.spinpapa.com/search">
                Find Spin Wheels to Make Choice
              </a>
            </li>
          </ul>
        </CardContent>
      </div>
    </>
  );
};

export default SideBar;
