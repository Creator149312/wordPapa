'use client'

import { useState } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button"
import { Menu, X } from 'lucide-react';
import NavLinks from "./NavLinks";
import CustomNavigationMenu from "@components/dropdowns/CustomNavigationMenu";
import ThemeToggle from "@components/ThemeToggle";

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


const Navbar = () => {
    const [open, setOpen] = useState(false);
    return (
        <nav className="mr-2 ml-2">
            <div className="flex items-center font-medium justify-between">
                <div className="z-50 p-3 md:w-auto w-full flex justify-between">
                    <a href="/" className="text-3xl font-bold flex items-center">
                        <img src={"/logo192.png"} alt="logo" className="md:cursor-pointer h-9 pr-2" />
                        Wordpapa
                    </a>
                    <div className="text-3xl md:hidden" onClick={() => setOpen(!open)}>
                        {open ? <X /> : <Menu />}
                    </div>
                </div>
                <ul className="md:flex hidden items-center gap-2">
                    <li>
                        <ThemeToggle />
                    </li>
                    <NavLinks />
                    <li>
                        <Link href="/" className="py-7 text-lg px-3 inline-block">
                            Thesaurus
                        </Link>
                    </li>
                    {/* <li>
                    <CustomNavigationMenu title={"Word Finders"} itemList={wordFindersComponents}/>
                    </li> */}
                </ul>
                {/* <div className="md:block hidden">
                    <Button> Subscribe</Button>
                </div> */}
                {/* Mobile nav */}
                <ul
                    className={`
        md:hidden dark:bg-[#020817] bg-white fixed w-full top-0 overflow-y-auto bottom-0 py-24 pl-4
        duration-500 ${open ? "left-0" : "left-[-100%]"}
        `}
                >
                    <NavLinks setOpen={setOpen}/>
                    <li>
                        <Link href="/" className="py-7 px-3 inline-block">
                            Home
                        </Link>
                    </li>
                    {/* 
                    <div className="py-5">
                        <Button />
                    </div> */}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;