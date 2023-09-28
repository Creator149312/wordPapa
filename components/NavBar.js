'use client'
import { useState } from 'react';
import styles from '@public/styles/Navbar.module.css';

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
          <a href='#home' className={`${styles.logo}`}>WordPapa
          </a>

          <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
            <li onClick={removeActive}>
              <a href='/dictionary/' className={`${styles.navLink}`}>Dictionary</a>
            </li>
            <li onClick={removeActive}>
              <a href='/adjectives-finder/' className={`${styles.navLink}`}>Adjectives Finder</a>
            </li>
            <li onClick={removeActive}>
              <a href='/rhyming-words/' className={`${styles.navLink}`}>Rhyming Words</a>
            </li>
            <li onClick={removeActive}>
              <a href='/homophones-finder/' className={`${styles.navLink}`}>Find Homophones</a>
            </li>
            <li onClick={removeActive}>
              <a href='/similar-words/' className={`${styles.navLink}`}> Similar Words</a>
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