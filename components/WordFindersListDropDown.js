'use client'

import { useState, useEffect, useRef } from 'react';
import { HiChevronDown } from "react-icons/hi";

function WordFindersListDropDown(props) {

  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
        // console.log(menuRef.current);
      }
    };

    document.addEventListener("mousedown", handler);


    return () => {
      document.removeEventListener("mousedown", handler);
    }

  });

  return (
    <div className='menu-container' ref={menuRef}>
      <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
        <div className='display-flex center-align'>{props.name} <HiChevronDown /></div>
      </div>
      <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
        <ul>
          <DropdownItem url={"/word-finder"} text={"Word Unscrambler"} />
          <DropdownItem url={"/adjectives"} text={"Adjectives Finder"} />
        </ul>
      </div>
    </div>
  );
}

function DropdownItem(props) {
  return (
    <li className='dropdownItem dropdown-menu-border-gap'>
      <a href={props.url}> {props.text} </a>
    </li>
  );
}

export default WordFindersListDropDown;