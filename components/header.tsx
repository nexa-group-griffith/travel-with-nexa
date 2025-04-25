'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import { UserNav } from '@/components/user-nav';
import { DialogTitle } from './ui/dialog';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, loading, error } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6 md:gap-10'>
          <Link
            href={user ? '/dashboard' : '/'}
            className='flex items-center space-x-2'
          >
            <span className='text-2xl font-bold'>Travel With Nexa</span>
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <ModeToggle />
          {!loading && (
            <>
              {user ? (
                <UserNav user={user} />
              ) : (
                <div className='hidden space-x-2 md:flex'>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                  >
                    <Link href='/about'>About Us</Link>
                  </Button>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                  >
                    <Link href='/login'>Log In</Link>
                  </Button>
                  <Button
                    asChild
                    size='sm'
                  >
                    <Link href='/signup'>Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}
          {!user ? (
            <Sheet
              open={open}
              onOpenChange={(isOpen) => setOpen(isOpen)}
            >
              <SheetTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='md:hidden'
                >
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='top'>
                <DialogTitle className='sr-only'>Navigation Menu</DialogTitle>
                <nav className='flex flex-col gap-4'>
                  {!user && !error && (
                    <>
                      <Link
                        href='/login'
                        className='text-sm font-medium transition-colors hover:text-primary'
                      >
                        Log In
                      </Link>
                      <Link
                        href='/signup'
                        className='text-sm font-medium transition-colors hover:text-primary'
                      >
                        Sign Up
                      </Link>
                      <Link
                        href='/about'
                        className='text-sm font-medium transition-colors hover:text-primary'
                      >
                        About Us
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          ) : null}
        </div>
      </div>
    </header>
  );
}
