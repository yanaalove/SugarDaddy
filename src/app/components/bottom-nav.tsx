import React from 'react'; 
import { Home, User, Share2, Layers } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-black fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-12">
        {[
          { href: "/", icon: <Home className="h-5 w-5" />, label: "Mining" },
          { href: "/levels", icon: <Layers className="h-5 w-5" />, label: "Levels" },
          { href: "/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
          { href: "/social", icon: <Share2 className="h-5 w-5" />, label: "social" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={`flex flex-col items-center text-xs transition-transform duration-300 hover:scale-105 ${
              isActive(item.href)
                ? 'text-green-400 bg-green-600/10 px-2 py-1 rounded-md'
                : 'text-white/70'
            }`}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
