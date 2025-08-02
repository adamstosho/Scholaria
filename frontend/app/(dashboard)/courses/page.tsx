'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useCourses, useEnrollCourse } from '@/hooks/use-courses';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Plus, Search, Calendar } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format as formatDateFn } from 'date-fns';

export default function CoursesPage() {
  // Helper function to safely format dates
  const formatDate = (dateString: string | null | undefined, formatString: string = 'MMM yyyy') => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return formatDateFn(date, formatString);
    } catch (error) {
      return 'N/A';
    }
  };

  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: coursesData, isLoading } = useCourses(page, 12, search);
  const enrollMutation = useEnrollCourse();

  const isLecturer = user?.role === 'lecturer';
  const courses = coursesData?.data || [];

  const handleEnroll = (courseId: string) => {
    enrollMutation.mutate(courseId);
  };

  const isEnrolled = (courseId: string) => {
    return user?.enrolledCourses?.includes(courseId);
  };

  const isOwner = (course: any) => {
    return course.lecturer._id === user?._id;
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-2">
              {isLecturer ? 'Manage your courses' : 'Discover and enroll in courses'}
            </p>
          </div>
          {isLecturer && (
            <Link href="/courses/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg mb-2 truncate">{course.title}</CardTitle>
                        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <Badge variant="secondary" className="w-fit">
                            {course.code}
                          </Badge>
                          <span className="text-gray-500 truncate">{course.lecturer.name}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {course.students?.length || 0} students
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">{formatDate(course.createdAt)}</span>
                        <span className="sm:hidden">{formatDate(course.createdAt, 'MMM yyyy')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/courses/${course._id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      
                      {!isLecturer && !isEnrolled(course._id) && (
                        <Button
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollMutation.isPending}
                          className="flex-1"
                        >
                          {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
                        </Button>
                      )}
                      
                      {!isLecturer && isEnrolled(course._id) && (
                        <Button disabled className="flex-1">
                          Enrolled
                        </Button>
                      )}
                      
                      {isLecturer && isOwner(course) && (
                        <Link href={`/courses/${course._id}/edit`}>
                          <Button variant="outline" className="w-full sm:w-auto">
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="text-gray-500 mb-6">
              {search 
                ? 'Try adjusting your search terms'
                : isLecturer 
                  ? 'Create your first course to get started'
                  : 'Check back later for new courses'
              }
            </p>
            {isLecturer && !search && (
              <Link href="/courses/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Course
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {coursesData && coursesData.pagination.pages > 1 && (
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
                Page {page} of {coursesData.pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(coursesData.pagination.pages, page + 1))}
                disabled={page === coursesData.pagination.pages}
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