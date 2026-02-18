"use client";

import { links } from "./Mylinks";
import Dropdown from "./Dropdown";

const NavLinks = () => {
  return (
    <>
      {links.map((link, i) => (
        <Dropdown key={i} name={link.name} items={link.items} />
      ))}
    </>
  );
};

export default NavLinks;
