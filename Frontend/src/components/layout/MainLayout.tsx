import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <Navbar />
      <div className="flex justify-center mx-auto max-w-[1600px]">
        <LeftSidebar />
        <main className="flex-1 max-w-[680px] w-full mx-auto sm:px-4 py-4 min-h-[calc(100vh-56px)]">
          {children ?? <Outlet />}
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
