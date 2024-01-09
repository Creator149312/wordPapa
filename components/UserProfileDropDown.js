'use client'

import { useState, useEffect, useRef } from 'react';
import { HiChevronDown } from "react-icons/hi";
import SignOut from './user/SignOut';

function UserProfileDropDown(props) {

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
        <h4 className='display-flex'>{props.name} <HiChevronDown /></h4>
      </div>

      <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
        <ul>
          <DropdownItem url={"/dashboard"} text={"My Lists"} />
          <li className='dropdownItem'>
            <SignOut />
          </li>
        </ul>
      </div>
    </div>

  );
}

function DropdownItem(props) {
  return (
    <li className='dropdownItem'>
      <a href={props.url}> {props.text} </a>
    </li>
  );
}

export default UserProfileDropDown;