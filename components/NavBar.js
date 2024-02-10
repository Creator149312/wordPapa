"use client";
import { useState } from "react";
import styles from "@public/styles/NavBar.module.css";
import logo from "@public/logo192.png";
import Image from "next/image";
import UserInfo from "./UserInfo";
import WordFindersListDropDown from "./dropdowns/WordFindersListDropDown";
import WordToolsListDropDown from "./dropdowns/WordToolsListDropDown";
import { useSession } from "next-auth/react";

function Navbar() {
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

  return (
    <nav className={`${styles.navbar}`}>
      {/* logo */}
      <a href="/" className={`${styles.logo}`}>
        <Image src={logo} alt="WordPapa Logo" width="35" height="35" />
        WordPapa
      </a>
      <div>
        <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
          <li onClick={removeActive}>
            <a href="/thesaurus/" className={`${styles.navLink}`}>Thesaurus
            </a>
          </li>
          <li onClick={removeActive}>
            <a href="/define/" className={`${styles.navLink}`}>Dictionary
            </a>
          </li>
          <li onClick={removeActive}>
            <WordToolsListDropDown name={"Word Tools"} />
          </li>
          <li onClick={removeActive}>
            <WordFindersListDropDown name={"Word Finders"} />
          </li>
          <li >
            <UserInfo name={session?.user?.name} status={status}/>
          </li>
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

export default Navbar;
