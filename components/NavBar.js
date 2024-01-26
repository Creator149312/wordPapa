"use client";
import { useState } from "react";
import styles from "@public/styles/NavBar.module.css";
import logo from "@public/logo192.png";
import Image from "next/image";
import UserInfo from "./UserInfo";
import WordFindersListDropDown from "./WordFindersListDropDown";

function Navbar() {
  // adding the states
  const [isActive, setIsActive] = useState(false);

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
        <Image src={logo} alt="WordPapa Logo" width="30" height="30" />
        WordPapa
      </a>

      <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
        <li onClick={removeActive} >
          <a href="/define/" className={`${styles.navLink}`}>Word Dictionary
          </a>
        </li>
        <li onClick={removeActive}>
          <a href="/thesaurus/" className={`${styles.navLink}`}>Thesaurus
          </a>
        </li>
        <li onClick={removeActive}>
          <a href="/syllables/" className={`${styles.navLink}`}> Syllable Counter
          </a>
        </li>
        <li onClick={removeActive}>
          <a href="/rhyming-words/" className={`${styles.navLink}`}>Rhyming Dictionary
          </a>
        </li>
        <li onClick={removeActive}>
          <WordFindersListDropDown name={"Word Finders"}/>
        </li>
        <li>
          <UserInfo />
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
    </nav>
  );
}

export default Navbar;
