"use client";
// import GoogleAd from "@utils/GoogleAd";
import { CardContent, CardHeader } from "@components/ui/card";
import AdsUnit from "./AdsUnit";

const SideBar = () => {
  return (
    <>
      {/* <div className="">
        <CardHeader>
          <h2 className="text-2xl font-extrabold">Workbooks</h2>
        </CardHeader>
        <CardContent>
          <ul>
            <li className="no-style-list">
              <a href="https://www.englishbix.com/product/35-word-family-words-tracing-workbook/">
                Rhyming Words Tracing Workbook
              </a>
            </li>
            <li className="no-style-list">
              <a href="https://www.englishbix.com/product/3-letter-rhyming-words-workbook/">
                3 Letter Rhyming Words Workbook
              </a>
            </li>
          </ul>
        </CardContent>
      </div> */}

      <AdsUnit slotID={3722270586} />
      <AdsUnit slotID={3722270586} />
    </>
  );
};

export default SideBar;
