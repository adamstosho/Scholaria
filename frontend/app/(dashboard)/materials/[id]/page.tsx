'use client';

import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useMaterialDetails } from '@/hooks/use-material-details';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FilePreview } from '@/components/file-preview/file-preview';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  BookOpen,
  FileText,
  Download,
  Eye,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format as formatDateFn } from 'date-fns';

export default function MaterialDetailPage() {
  // Helper function to safely format dates
  const formatDate = (dateString: string | null | undefined, formatString: string = 'MMM dd, yyyy HH:mm') => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return formatDateFn(date, formatString);
    } catch (error) {
      return 'N/A';
    }
  };
  const params = useParams();
  const materialId = params.id as string;
  const { user } = useAuth();
  const { data: materialData, isLoading, error } = useMaterialDetails(materialId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !materialData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Material not found</h3>
          <p className="text-gray-500 mb-6">The material you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/materials">
            <Button>Back to Materials</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { material, fileInfo } = materialData.data;
  const isLecturer = user?.role === 'lecturer';
  const isOwner = material.uploadedBy._id === user?._id;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    return '📎';
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${material.fileUrl}`;
    link.download = material.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(`http://localhost:5000${material.fileUrl}`, '_blank');
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Materials', href: '/materials' },
            { label: material.title }
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/materials">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Materials
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{getFileIcon(material.fileType)}</span>
                <h1 className="text-3xl font-bold text-gray-900">{material.title}</h1>
                <Badge variant="secondary" className="text-sm capitalize">
                  {material.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {material.uploadedBy.name}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(material.uploadedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {material.course.title} ({material.course.code})
                </div>
              </div>
            </div>
            
            {isLecturer && isOwner && (
              <div className="flex gap-2">
                <Link href={`/materials/${materialId}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Material Description */}
            {material.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{material.description}</p>
                </CardContent>
              </Card>
            )}

            {/* File Preview */}
            <Card>
              <CardHeader>
                <CardTitle>File Preview</CardTitle>
                <CardDescription>
                  {fileInfo.canPreview 
                    ? 'Preview the file directly in your browser'
                    : 'This file type cannot be previewed'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fileInfo.canPreview ? (
                  <div className="border rounded-lg overflow-hidden">
                    {material.fileType.includes('pdf') && (
                      <iframe
                        src={`http://localhost:5000${material.fileUrl}#toolbar=0`}
                        className="w-full h-96"
                        title={material.fileName}
                      />
                    )}
                    {material.fileType.includes('image') && (
                      <img
                        src={`http://localhost:5000${material.fileUrl}`}
                        alt={material.fileName}
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>Preview not available for this file type</p>
                    <p className="text-sm">Use the download button to view the file</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* File Information */}
            <Card>
              <CardHeader>
                <CardTitle>File Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File Name:</span>
                    <span className="text-sm font-medium">{material.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File Type:</span>
                    <span className="text-sm font-medium">{material.fileType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File Size:</span>
                    <span className="text-sm font-medium">{formatFileSize(material.fileSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category:</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {material.category}
                    </Badge>
                  </div>
                  {fileInfo.lastModified && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Modified:</span>
                      <span className="text-sm font-medium">
                        {formatDate(fileInfo.lastModified, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{material.course.title}</h3>
                    <p className="text-sm text-gray-600">Code: {material.course.code}</p>
                  </div>
                  <Link href={`/courses/${material.course._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Course
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
                <Button variant="outline" onClick={handleOpenInNewTab} className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </Button>
                {fileInfo.canPreview && (
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
} 