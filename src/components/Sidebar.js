'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, ListMusic, User, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const menuItems = [
    { name: 'Feed', href: '/', icon: <Home size={20} /> },
    { name: 'Favoritas', href: '/favoritas', icon: <Heart size={20} /> },
    { name: 'Playlists', href: '/playlists', icon: <ListMusic size={20} /> },
    { name: 'Perfil', href: '/profile', icon: <User size={20} /> },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#242526] border-r border-gray-200 dark:border-gray-800 flex flex-col p-4 z-50 shadow-xl">
      <div className="flex items-center gap-3 mb-10 px-2 text-[#6c63ff] font-bold text-xl">
        <span>🎵 SocialMusic</span>
      </div>
      <ul className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.href} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${pathname === item.href ? 'bg-[#6c63ff] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'}`}>
              {item.icon} {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-3 p-2 text-gray-500">
        {darkMode ? <Sun size={20} /> : <Moon size={20} />} Tema
      </button>
    </nav>
  );
}