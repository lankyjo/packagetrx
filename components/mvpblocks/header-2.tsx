'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeSwitcher } from '../ui/shadcn-io/theme-switcher';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { Button } from '@/components/ui/button';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Legal', href: '/legal' },
  { name: 'FAQ', href: '/faq' },
];

export default function Header2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { isAuthenticated } = useKindeBrowserClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.header
        className={`fixed bg-white/30 dark:bg-background/40 top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-border/50 bg-background/80 border-b shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link
                prefetch={false}
                href="/"
                className="flex items-center space-x-3"
              >
                <Image 
                  src={'/vector/default-monochrome.svg'} 
                  alt={'logo'} 
                  width={150} 
                  height={80} 
                  className='dark:hidden' 
                />
                <Image 
                  src={'/vector/default-monochrome-white.svg'} 
                  alt={'logo'} 
                  width={150} 
                  height={80} 
                  className='dark:block hidden' 
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    prefetch={false}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {hoveredItem === item.name && (
                      <motion.div
                        className="bg-muted absolute inset-0 rounded-lg"
                        layoutId="navbar-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <motion.div
              className="hidden lg:flex items-center space-x-3"
              variants={itemVariants}
            >
              <motion.div className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors duration-200">
                <ThemeSwitcher />
              </motion.div>

              {isAuthenticated ? (
                <AvatarDropdown />
              ) : (
                <LoginLink postLoginRedirectURL="/dashboard">
                  <Button variant={'outline'} className='cursor-pointer'>
                    Log in
                  </Button>
                </LoginLink>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="text-foreground hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="border-border bg-background fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-6 p-6">
                {/* User Profile Section - Only show if authenticated */}
                {isAuthenticated && (
                  <motion.div
                    className="border-border border-b pb-4"
                    variants={mobileItemVariants}
                  >
                    <MobileUserProfile />
                  </motion.div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants}>
                      <Link
                        prefetch={false}
                        href={item.href}
                        className="text-foreground hover:bg-muted block rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Actions Section */}
                <motion.div
                  className="border-border space-y-3 border-t pt-4"
                  variants={mobileItemVariants}
                >
                  {/* Theme Switcher for Mobile */}
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeSwitcher />
                  </div>

                  {/* Auth Actions */}
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        className="hover:bg-muted flex items-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <LogoutLink>
                        <button className="bg-red-600 hover:bg-red-500 text-white flex w-full items-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors duration-200">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </LogoutLink>
                    </div>
                  ) : (
                    <LoginLink postLoginRedirectURL="/dashboard">
                      <Button variant={'outline'} className='w-full cursor-pointer'>
                        <User className="mr-2 h-4 w-4" />
                        Log in
                      </Button>
                    </LoginLink>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Desktop Avatar Dropdown
const AvatarDropdown = () => {
  const { user, isLoading } = useKindeBrowserClient();

  const firstInitial = user?.given_name?.[0] || '';
  const lastInitial = user?.family_name?.[0] || '';

  const userInitials = isLoading ? 'ID' : firstInitial + lastInitial;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='cursor-pointer focus:outline-none'>
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.picture || ''} alt={user?.given_name || 'User'} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.picture || ''} alt={user?.given_name || 'User'} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">
              {user?.given_name} {user?.family_name}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='bg-red-600 hover:bg-red-500 text-white focus:bg-red-500 focus:text-white'>
          <LogoutLink postLogoutRedirectURL='/' className="flex items-center w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Mobile User Profile Component
const MobileUserProfile = () => {
  const { user, isLoading } = useKindeBrowserClient();

  const firstInitial = user?.given_name?.[0] || '';
  const lastInitial = user?.family_name?.[0] || '';
  const userInitials = isLoading ? 'ID' : firstInitial + lastInitial;

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user?.picture || ''} alt={user?.given_name || 'User'} />
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="font-semibold">
          {user?.given_name} {user?.family_name}
        </p>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>
    </div>
  );
};