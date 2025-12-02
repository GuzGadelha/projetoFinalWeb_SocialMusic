import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = { title: 'Social Music', description: 'Rede social de música' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#f5f6fa] dark:bg-[#18191a] text-black dark:text-white transition-colors duration-300">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}