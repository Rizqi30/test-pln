// src/components/ProfileDropdownContent.tsx
'use client';

import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle } from 'lucide-react';
import { Session } from 'next-auth';

// Komponen ini menerima data sesi dan fungsi handler sebagai props
interface ProfileDropdownContentProps {
  session: Session | null;
  handleProfile: () => void;
  handleLogout: () => void;
}

export function ProfileDropdownContent({
  session,
  handleProfile,
  handleLogout,
}: ProfileDropdownContentProps) {
  return (
    <>
      {/* Bagian Info Pengguna */}
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {session?.user?.name}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {session?.user?.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      {/* Aksi Profile */}
      <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
        <UserCircle className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />

      {/* Aksi Logout */}
      <DropdownMenuItem
        onClick={handleLogout}
        className="text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-600"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </>
  );
}