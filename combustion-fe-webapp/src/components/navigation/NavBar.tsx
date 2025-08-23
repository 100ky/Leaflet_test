"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import MobileNavItem from "./MobileNavItem";
import { t } from "@/utils/translations"; // Import the translation function

// This component renders the main navigation bar for the application.
// It includes desktop navigation links, and a mobile hamburger menu.
export default function NavBar() {
  // State to manage the visibility of the mobile menu.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Hook to get the current URL pathname.
  const pathname = usePathname(); // Array of navigation items, with labels fetched using the translation function.
  const navItems = [
    { href: "/", label: t("navigation.home") },
    { href: "/incinerators", label: t("navigation.incinerators") },
    { href: "/about", label: t("navigation.about") },
  ];

  // Function to determine if a navigation link is active based on the current pathname.
  const getIsActive = (href: string) => {
    return pathname === href;
  };

  return (
    // Element for the navigation bar.
    <>
      <div className="mx-auto flex max-w-7xl items-center md:px-8">
        {/* Desktop navigation menu. */}
        <div className="flex flex-1 justify-center">
          {/* Decorative vertical line. */}
          <div className="mx-8 hidden w-px bg-gray-200 lg:block"></div>

          {/* Navigation links for desktop view. */}
          <nav className="hidden items-center rounded-full border border-gray-200/50 bg-gray-50/80 px-2 py-2 shadow-inner md:flex">
            {navItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <NavItem
                  href={item.href}
                  label={item.label}
                  isActive={getIsActive(item.href)}
                />
                {/* Separator line between navigation items. */}
                {index < navItems.length - 1 && (
                  <div className="mx-1 h-4 w-px bg-gray-300"></div>
                )}
              </div>
            ))}
          </nav>

          {/* Decorative vertical line. */}
          <div className="mx-8 hidden w-px bg-gray-200 lg:block"></div>
        </div>{" "}
        {/* Mobile hamburger menu button. */}
        <div className="ml-auto md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Toggles the mobile menu visibility.
            className="rounded-xl p-3 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Open navigation menu"
          >
            {" "}
            <div className="flex h-6 w-6 flex-col items-center justify-center">
              {/* Hamburger to X transformation */}
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "translate-y-0.5 rotate-45"
                    : "-translate-y-1"
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "-translate-y-0.5 -rotate-45"
                    : "translate-y-1"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown, shown when isMobileMenuOpen is true. */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white shadow-lg md:hidden">
          <div className="space-y-2 px-6 py-4">
            {/* Navigation links for mobile view. */}
            {navItems.map((item) => (
              <MobileNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={getIsActive(item.href)}
                onClick={() => setIsMobileMenuOpen(false)} // Closes the mobile menu on item click.
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
