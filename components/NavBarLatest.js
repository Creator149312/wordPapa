"use client";
import { useState } from "react";
import styles from "@public/styles/NavBar.module.css";
import logo from "@public/logo192.png";
import Image from "next/image";
import UserInfo from "./UserInfo";
import CustomNavigationMenu from '@components/dropdowns/CustomNavigationMenu'
import { useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

function NavbarLatest() {
  // adding the states
  const [isActive, setIsActive] = useState(false);
  const { status, data: session } = useSession();

  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false);
  };
  
const wordToolsComponents = [
  {
    title: "Rhyming Dictionary",
    href: "/rhyming-words",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Syllable Counter",
    href: "/syllables",
    description:
      "For sighted users to preview content available behind a link.",
  },
];

const wordFindersComponents = [
  {
    title: "Word Unscrambler",
    href: "/word-finder",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Adjectives Finder",
    href: "/adjectives",
    description:
      "For sighted users to preview content available behind a link.",
  },
];

  return (
    <nav className={`${styles.navbar}`}>
      <a href="/" className={`${styles.logo}`}>
        <Image src={logo} alt="WordPapa Logo" width="35" height="35" />
        WordPapa
      </a>
      <div>
        <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
          <li>
          <ThemeToggle />
          </li>
        <li onClick={removeActive}>
            <CustomNavigationMenu title={"Word Tools"} itemList={wordToolsComponents} />
          </li>
          <li onClick={removeActive}>
            <CustomNavigationMenu title={"Word Finders"} itemList={wordFindersComponents}/>
          </li>
          <li onClick={removeActive}>
            <a href="/thesaurus" className={`${styles.navLink}`}>Thesaurus
            </a>
          </li>
          <li onClick={removeActive}>
            <a href="/browse" className={`${styles.navLink}`}>Dictionaries
            </a>
          </li>
          {/* <li >
            <UserInfo name={session?.user?.name} status={status}/>
          </li> */}
        </ul>

        <div
          className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
          onClick={toggleActiveClass}
        >
          <span className={`${styles.bar}`}></span>
          <span className={`${styles.bar}`}></span>
          <span className={`${styles.bar}`}></span>
        </div>
      </div>
    </nav>
  );
}

export default NavbarLatest;
