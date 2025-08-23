// This component renders a single navigation item for the desktop view.
import Link from 'next/link';

// Defines the properties for the NavItem component.
interface NavItemProps {
    href: string; // The URL the navigation item links to.
    label: string; // The text displayed for the navigation item.
    isActive: boolean; // Indicates if the navigation item is currently active.
}

// Defines the structure of the NavItem component.
export default function NavItem({ href, label, isActive }: NavItemProps) {
    return (
        <Link
            href={href}
            // Applies conditional styling based on whether the item is active.
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive
                    ? 'bg-blue-500 text-white shadow-md transform scale-105' // Active state styling.
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm' // Inactive state styling.
                }`}
        >
            {label}
        </Link>
    );
}