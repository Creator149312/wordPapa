import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-[#0a0a0a] border-t-2 border-gray-100 dark:border-gray-800 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 bg-[#75c32c] rounded-full" />
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Word<span className="text-[#75c32c]">Papa</span>
            </span>
          </div>

          {/* Copyright Section */}
          <div className="text-center md:text-right">
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
              &copy; {currentYear} All Rights Reserved
            </p>
            <p className="text-xs font-medium text-gray-400">
              Handcrafted for word lovers and puzzle solvers.
            </p>
          </div>

        </div>

        {/* Bottom Decorative Bar */}
        <div className="mt-8 h-1 w-full bg-gradient-to-r from-transparent via-[#75c32c]/20 to-transparent rounded-full" />
      </div>
    </footer>
  );
};

export default Footer;