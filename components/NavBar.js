'use client'
import { useState } from 'react';
import styles from '@public/styles/NavBar.module.css';
import logo from '@public/logo192.png'
import Image from 'next/image';

function Navbar() {

  // adding the states 
  const [isActive, setIsActive] = useState(false);

  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false)
  }

  return (
        <nav className={`${styles.navbar}`}>

          {/* logo */}
          <a href='/' className={`${styles.logo}`}><Image
          src={logo} alt="WordPapa Logo" width="30" height="30"/>WordPapa
          </a>

          <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
            {/* <li onClick={removeActive}>
              <a href='/define/' className={`${styles.navLink}`}>Dictionary</a>
            </li> */}
             <li onClick={removeActive}>
              <a href='/syllables/' className={`${styles.navLink}`}>Syllable Counter</a>
            </li>
            <li onClick={removeActive}>
              <a href='/adjectives/' className={`${styles.navLink}`}>Adjectives Finder</a>
            </li>
            <li onClick={removeActive}>
              <a href='/rhyming-words/' className={`${styles.navLink}`}>Rhyming Words</a>
            </li>
            <li onClick={removeActive}>
              <a href='/homophones/' className={`${styles.navLink}`}>Find Homophones</a>
            </li>
            <li onClick={removeActive}>
              <a href='/synonyms/' className={`${styles.navLink}`}> Find Synonyms</a>
            </li>
          </ul>

          <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`}  onClick={toggleActiveClass}>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>
  );
}

export default Navbar;