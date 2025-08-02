'use client';

import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  Megaphone, 
  FileText, 
  Users,
  Plus,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  requireRole?: 'student' | 'lecturer';
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Courses',
    href: '/courses',
    icon: BookOpen,
  },
  {
    name: 'Create Course',
    href: '/courses/create',
    icon: Plus,
    requireRole: 'lecturer',
  },
  {
    name: 'Announcements',
    href: '/announcements',
    icon: Megaphone,
  },
  {
    name: 'Materials',
    href: '/materials',
    icon: FileText,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: Users,
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const filteredItems = sidebarItems.filter(item => 
    !item.requireRole || item.requireRole === user?.role
  );

  return (
    <motion.div 
      className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 transition-colors duration-200',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.div>
  );
}