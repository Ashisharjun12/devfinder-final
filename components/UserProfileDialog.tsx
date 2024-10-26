'use client';

import { useState } from 'react';
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  LogOut, 
  MessageSquare, 
  FolderGit2, 
  Settings,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileDialogProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const menuItems = [
  {
    icon: User,
    label: 'Profile',
    href: '/profile',
    description: 'View and edit your profile'
  },
  {
    icon: FolderGit2,
    label: 'My Projects',
    href: '/projects',
    description: 'Manage your projects'
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    href: '/messages',
    description: 'View your messages'
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    description: 'Manage your preferences'
  }
];

export function UserProfileDialog({ user }: UserProfileDialogProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 transition-all hover:ring-primary/50">
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 p-2 bg-secondary/95 backdrop-blur-xl border-primary/10"
        align="end"
      >
        <div className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-primary/10" />

        <div className="p-2 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </motion.div>
              </Link>
            );
          })}
        </div>

        <DropdownMenuSeparator className="bg-primary/10" />

        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Log out
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
