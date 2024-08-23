"use client";
// import GoogleAd from "@utils/GoogleAd";
import { CardContent, CardHeader } from "@components/ui/card";
import AdsUnit from "./AdsUnit";

const SideBar = () => {
  return (
    <>
      <div className="">
        <CardHeader>
          <h2 className="text-2xl font-extrabold">Resources</h2>
        </CardHeader>
        <CardContent>
          <ul>
            <li className="no-style-list">
              <a href="https://www.englishbix.com/product/35-word-family-words-tracing-workbook/">
                Word Family Tracing Workbook
              </a>
            </li>
            <li className="no-style-list">
              <a href="https://www.englishbix.com/shop/">
                Worksheets and Printables for Kids
              </a>
            </li>
          </ul>
        </CardContent>
      </div>

      <AdsUnit slotID={3722270586} />
      <AdsUnit slotID={3722270586} />
    </>
  );
};

export default SideBar;
