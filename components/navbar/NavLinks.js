'use client'

import { useState } from "react";
import Link from "next/link";
import { links } from "./Mylinks";
import { ChevronUp, ChevronDown } from "lucide-react";

const NavLinks = ({ setOpen }) => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");

  return (
    <>
      {links.map((link, index) => (
        <div key={index} className="relative group">
          {/* Top-level link */}
          <div
            className="px-3 text-left md:cursor-pointer"
            onClick={() => {
              heading !== link.name ? setHeading(link.name) : setHeading("");
              setSubHeading("");
            }}
          >
            <p className="py-2 flex justify-between items-center text-base font-medium">
              {link.name}
              {/* Mobile icon */}
              <span className="text-base md:hidden inline">
                {heading === link.name ? <ChevronUp /> : <ChevronDown />}
              </span>
              {/* Desktop icon */}
              {link.submenu && (
                <span className="text-base md:ml-1 hidden md:inline-block group-hover:rotate-180 transition-transform">
                  <ChevronDown />
                </span>
              )}
            </p>
          </div>

          {/* Desktop dropdown */}
          {link.submenu && (
            <div className="absolute left-0 top-full hidden group-hover:block bg-white dark:bg-[#020817] shadow-lg rounded-md z-20 min-w-[200px] pt-1">
              <div className="p-3">
                {link.sublinks.map((mysublinks, subIndex) => (
                  <div key={`dropdown${subIndex}`}>
                    {mysublinks.sublink.map((slink, i) => (
                      <a
                        key={`sublink${i}`}
                        href={slink.link}
                        className="block px-3 py-1 text-base hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        {slink.name}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile dropdown */}
          <div
            className={`${
              heading === link.name ? "md:hidden block" : "hidden"
            } bg-white dark:bg-[#020817]`}
          >
            {link.sublinks.map((slinks, subIndex) => (
              <div key={`mb${subIndex}`}>
                <p
                  onClick={() =>
                    subHeading !== slinks.Head
                      ? setSubHeading(slinks.Head)
                      : setSubHeading("")
                  }
                  className="py-2 pl-5 font-medium text-base flex justify-between items-center"
                >
                  {slinks.Head}
                  <span className="text-base">
                    {subHeading === slinks.Head ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </p>
                <div
                  className={`${
                    subHeading === slinks.Head ? "block" : "hidden"
                  }`}
                >
                  {slinks.sublink.map((slink, i) => (
                    <Link
                      key={`mbsub${i}`}
                      href={slink.link}
                      className="block py-1 pl-8 text-base hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {slink.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default NavLinks;
