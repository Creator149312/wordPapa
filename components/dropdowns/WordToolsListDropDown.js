'use client'

import { useState, useEffect, useRef } from 'react';
import { HiChevronDown } from "react-icons/hi";

function WordToolsListDropDown(props) {

  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);


    return () => {
      document.removeEventListener("mousedown", handler);
    }

  });

  return (
    <div className='menu-container cursor-pointer' ref={menuRef}>
      <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
        <div className='display-flex center-align'>{props.name} <HiChevronDown /></div>
      </div>

      <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
        <ul>
          <DropdownItem url={"/rhyming-words"} text={"Rhyming Dictionary"} />
          <DropdownItem url={"/syllables"} text={"Syllable Counter"} />
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

export default WordToolsListDropDown;