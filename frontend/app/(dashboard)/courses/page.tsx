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
import { formatDateMedium } from '@/lib/utils';

export default function CoursesPage() {


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
        <div className="flex justify-between items-center mb-10">
          <div>
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Courses
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 mt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {isLecturer ? 'Manage your courses effectively' : 'Discover and enroll in amazing courses'}
            </motion.p>
          </div>
          {isLecturer && (
            <Link href="/courses/create">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </motion.div>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <motion.div 
            className="relative max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search courses by name or lecturer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
            />
          </motion.div>
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
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
                          {course.title}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                          <Badge className="w-fit bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                            {course.code}
                          </Badge>
                          <span className="text-gray-600 truncate font-medium">{course.lecturer.name}</span>
                        </div>
                      </div>
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                      >
                        <BookOpen className="h-6 w-6 text-white" />
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">{course.students?.length || 0} students</span>
                      </div>
                      <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                        <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="font-medium">{formatDateMedium(course.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href={`/courses/${course._id}`} className="flex-1">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="w-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                            View Details
                          </Button>
                        </motion.div>
                      </Link>
                      
                      {!isLecturer && !isEnrolled(course._id) && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                          <Button
                            onClick={() => handleEnroll(course._id)}
                            disabled={enrollMutation.isPending}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                          >
                            {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
                          </Button>
                        </motion.div>
                      )}
                      
                      {!isLecturer && isEnrolled(course._id) && (
                        <Button disabled className="flex-1 bg-green-100 text-green-700 border-green-200">
                          ✓ Enrolled
                        </Button>
                      )}
                      
                      {isLecturer && isOwner(course) && (
                        <Link href={`/courses/${course._id}/edit`}>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" className="w-full border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
                              Edit Course
                            </Button>
                          </motion.div>
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
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {search ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="text-muted-foreground mb-6">
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