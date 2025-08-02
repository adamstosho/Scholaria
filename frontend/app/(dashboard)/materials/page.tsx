'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useMaterials } from '@/hooks/use-materials';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Calendar, User, BookOpen, Plus, Download, File, Folder } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format as formatDateFn } from 'date-fns';

export default function MaterialsPage() {
  // Helper function to safely format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return formatDateFn(date, 'MMM dd');
    } catch (error) {
      return 'N/A';
    }
  };
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const { data: materialsData, isLoading } = useMaterials(page, 12, search, category);

  const isLecturer = user?.role === 'lecturer';
  const materials = materialsData?.data || [];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'lecture', label: 'Lecture Notes' },
    { value: 'assignment', label: 'Assignments' },
    { value: 'reading', label: 'Readings' },
    { value: 'exam', label: 'Exams' },
    { value: 'other', label: 'Other' }
  ];

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <h1 className="text-3xl font-bold text-gray-900">Course Materials</h1>
            <p className="text-gray-600 mt-2">
              {isLecturer ? 'Manage and share course materials' : 'Access your course materials'}
            </p>
          </div>
          {isLecturer && (
            <Link href="/materials/upload">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Material
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Materials Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material, index) => (
              <motion.div
                key={material._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{material.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {material.course.title}
                          </div>
                          {material.category && (
                            <Badge variant="secondary" className="text-xs">
                              {material.category}
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{getFileIcon(material.fileType)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {material.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {material.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <File className="h-4 w-4" />
                          {material.fileName}
                        </div>
                        <span>{formatFileSize(material.fileSize)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {material.uploadedBy.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(material.uploadedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(material.fileUrl, '_blank')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      
                      {isLecturer && material.uploadedBy._id === user?._id && (
                        <Link href={`/materials/${material._id}/edit`}>
                          <Button variant="outline" size="sm">
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
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search || category ? 'No materials found' : 'No materials available'}
            </h3>
            <p className="text-gray-500 mb-6">
              {search || category 
                ? 'Try adjusting your search terms or filters'
                : isLecturer 
                  ? 'Upload your first material to get started'
                  : 'Check back later for new materials'
              }
            </p>
            {isLecturer && !search && !category && (
              <Link href="/materials/upload">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Material
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {materialsData && materialsData.pagination.pages > 1 && (
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
                Page {page} of {materialsData.pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(materialsData.pagination.pages, page + 1))}
                disabled={page === materialsData.pagination.pages}
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