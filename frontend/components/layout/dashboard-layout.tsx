'use client';

import { Header } from './header';
import { Sidebar } from './sidebar';
import { ProtectedRoute } from './protected-route';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requireRole?: 'student' | 'lecturer';
}

export function DashboardLayout({ children, requireRole }: DashboardLayoutProps) {
  return (
    <ProtectedRoute requireRole={requireRole}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}