import SideBar from "@components/SideBar";
import "@public/styles/globals.css";
import NavbarComponent from "@components/NavBar";
import Footer from "@components/Footer";
import SearchNavBar from "@components/SearchNavBar";
import AlphabetLinks from "@components/AlphabetLinks";
import GAnalytics from "./GAnalytics";

export const metadata = {
  title: {
    default: "WordPapa: Master Vocabulary Words with Ease",
    template: "%s - WordPapa",
  },
  description:
    "WordPapa is a enriching vocabulary and word tools hub to find words for games and language learning. Dive into a world of words and become a confident English speaker and writer.",
};

const layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <GAnalytics />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="favicon.ico" />
      </head>
      <body className="font-responsive">
        <header className="card">
            <NavbarComponent />
            <SearchNavBar />
        </header>
        <main>
          <div className="container m-2">
            <div className="left-column card m-2 p-3">
              {children}
              {/** All the main content goes here */}
            </div>
            <div className="right-column card m-2 p-2">
              <SideBar />
            </div>
          </div>
        </main>
         <AlphabetLinks />
        <Footer />
      </body>
    </html>
  );
};

export default layout;
