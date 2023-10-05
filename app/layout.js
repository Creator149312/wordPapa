import SideBar from '@components/SideBar';
import '@public/styles/globals.css'
import NavbarComponent from '@components/NavBar';
import Footer from '@components/Footer';
import SearchNavBar from '@components/SearchNavBar';

export const metadata = {
  title: {
    default: "WordPapa",
    template: '%s - WordPapa'
  },
  description: "WordPapa is a enriching vocabulary and word tools hub to find words for games and language learning. Dive into a world of words and become a confident English speaker and writer."
}

const layout = ({children}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className='font-responsive'>
        <header className='card'>
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
        <Footer />
      </body>
    </html>
  );
};

export default layout;
