'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAnnouncements } from '@/hooks/use-announcements';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Search, Calendar, User, BookOpen, Plus, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: announcementsData, isLoading } = useAnnouncements(page, 10, search);

  const isLecturer = user?.role === 'lecturer';
  const announcements = announcementsData?.data || [];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-2">
              {isLecturer ? 'Manage course announcements' : 'Stay updated with course announcements'}
            </p>
          </div>
          {isLecturer && (
            <Link href="/announcements/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Announcements List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-shadow duration-300 ${
                  announcement.isImportant ? 'border-orange-200 bg-orange-50' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          {announcement.isImportant && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Important
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {announcement.course.title}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {announcement.createdBy.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Megaphone className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                      {announcement.body}
                    </p>
                    
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {announcement.attachments.map((attachment, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <Link href={`/announcements/${announcement._id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      
                      {isLecturer && announcement.createdBy._id === user?._id && (
                        <div className="flex gap-2">
                          <Link href={`/announcements/${announcement._id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search ? 'No announcements found' : 'No announcements yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {search 
                ? 'Try adjusting your search terms'
                : isLecturer 
                  ? 'Create your first announcement to get started'
                  : 'Check back later for new announcements'
              }
            </p>
            {isLecturer && !search && (
              <Link href="/announcements/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Announcement
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {announcementsData && announcementsData.pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {page} of {announcementsData.pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(announcementsData.pagination.pages, page + 1))}
                disabled={page === announcementsData.pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
} 