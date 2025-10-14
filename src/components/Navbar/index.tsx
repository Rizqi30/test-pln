'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { SidebarTrigger } from '../ui/sidebar';
import { useRouter } from 'next/router';
import { CgProfile } from "react-icons/cg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileDropdownContent } from '../Profile';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession()

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/anotherPages/home':
        return 'Home';
      case '/anotherPages/project':
        return 'Projects';
      case '/anotherPages/detail':
        return 'Detail';
      default:
        return '';
    }
  };

  const pageTitle = getPageTitle(router.pathname);

  const handleProfile = () => {
    alert('Menuju halaman profil...');
    // Di sini Anda bisa menambahkan logika untuk navigasi ke halaman profil
    // router.push('/profile');
  };

  const handleLogout = () => {
    signOut({
      callbackUrl: '/',
    });
  };
  return (
    <header className="bg-slate-200">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/assets/pattern/configPattern.svg)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '8rem 8rem',
          opacity: 0.05, // Sesuaikan opacity sesuai kebutuhan
          zIndex: 0,
        }}
      />
      <div className="p-4 flex h-20 w-full shrink-0 items-center bg-white rounded-md ">
        <div className="md:hidden relative z-50">
          <SidebarTrigger />
        </div>
        <div className="mr-6 hidden lg:flex items-center text-lg font-semibold text-gray-700">
          <span>Worklog Managements</span>
          {pageTitle && (
            <>
              <span className="mx-2 text-gray-400">&gt;</span>
              <span className="text-gray-900">{pageTitle}</span>
            </>
          )}
        </div>
        <nav className="ml-auto flex gap-6 relative z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="iconLg"
                className="rounded-full h-10 w-10 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <CgProfile className="h-8 w-8 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <ProfileDropdownContent
                session={session}
                handleProfile={handleProfile}
                handleLogout={handleLogout}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
