'use client';

import { useAuth } from '@/lib/auth-context';
import { useCourses } from '@/hooks/use-courses';
import { useAnnouncements } from '@/hooks/use-announcements';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Megaphone, FileText, Users, Plus, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: coursesData } = useCourses(1, 5);
  
  const isLecturer = user?.role === 'lecturer';
  const courses = coursesData?.data || [];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isLecturer 
              ? "Manage your courses and connect with students" 
              : "Stay updated with your courses and announcements"
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isLecturer ? 'My Courses' : 'Enrolled Courses'}
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLecturer ? user?.createdCourses?.length || 0 : user?.enrolledCourses?.length || 0}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Announcements</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">In the last 7 days</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Materials</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Available resources</p>
              </CardContent>
            </Card>
          </motion.div>

          {isLecturer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">34</div>
                  <p className="text-xs text-muted-foreground">Across all courses</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Courses</CardTitle>
                    <CardDescription>
                      {isLecturer ? 'Courses you created' : 'Your enrolled courses'}
                    </CardDescription>
                  </div>
                  <Link href="/courses">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.length > 0 ? (
                    courses.slice(0, 3).map((course) => (
                      <div key={course._id} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {course.title}
                          </p>
                          <p className="text-sm text-gray-500">{course.code}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.students?.length || 0} students
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {isLecturer ? 'No courses created yet' : 'No courses enrolled yet'}
                      </p>
                      <Link href={isLecturer ? '/courses/create' : '/courses'}>
                        <Button className="mt-4" size="sm">
                          {isLecturer ? 'Create Course' : 'Browse Courses'}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks you might want to perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {isLecturer ? (
                    <>
                      <Link href="/courses/create">
                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                          <Plus className="h-6 w-6" />
                          <span className="text-sm">Create Course</span>
                        </Button>
                      </Link>
                      <Link href="/announcements">
                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                          <Megaphone className="h-6 w-6" />
                          <span className="text-sm">New Announcement</span>
                        </Button>
                      </Link>
                      <Link href="/materials">
                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                          <FileText className="h-6 w-6" />
                          <span className="text-sm">Upload Material</span>
                        </Button>
                      </Link>
                      <Link href="/students">
                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                          <Users className="h-6 w-6" />
                          <span className="text-sm">View Students</span>
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/courses">
                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                          <BookOpen className="h-6 w-6" />
                          <span className="text-sm">Browse Courses</span>
                        </Button>
                      </Link>
                      <Link href="/announcements">
                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                          <Megaphone className="h-6 w-6" />
                          <span className="text-sm">View Announcements</span>
                        </Button>
                      </Link>
                      <Link href="/materials">
                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                          <FileText className="h-6 w-6" />
                          <span className="text-sm">Course Materials</span>
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                          <Users className="h-6 w-6" />
                          <span className="text-sm">My Profile</span>
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}