import All503Links from "./All503Links";
const BASE_URL = "https://words.englishbix.com";
import { promises as fs } from "fs";

function getISOTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Include milliseconds if needed (optional)
  // const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  const time = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

  return time;
}

export async function CreateSitemap() {
  let allLinks = [];
  // for (var i = 0; i < All503Links.length; i++) {
  //   allLinks.push(`<url>
  //           <loc>${All503Links[i]}</loc>
  //           <lastmod>2024-09-14T03:27:42.448Z</lastmod>
  //            <changefreq>daily</changefreq>
  //           </url>`);
  // }

  // const creationPath = process.cwd() + "/app/dataValidator/Sitemap/sitemap.txt"; // Replace with the actual path to your file.
  // fs.writeFile(creationPath, allLinks, "utf8");

  return <div>{allLinks}</div>;
}

export default CreateSitemap;
