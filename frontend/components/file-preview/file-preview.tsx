'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  Download, 
  ExternalLink, 
  X,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FilePreviewProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  title?: string;
  description?: string;
}

export function FilePreview({ 
  fileUrl, 
  fileName, 
  fileType, 
  fileSize, 
  title,
  description 
}: FilePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (fileType.includes('image')) return <Image className="h-8 w-8 text-green-500" />;
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  const canPreview = fileType.includes('pdf') || fileType.includes('image');

  const handlePreview = () => {
    setIsPreviewOpen(true);
    setIsLoading(true);
    setPreviewError(null);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <CardTitle className="text-lg">{title || fileName}</CardTitle>
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {formatFileSize(fileSize)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p><strong>File:</strong> {fileName}</p>
              <p><strong>Type:</strong> {fileType}</p>
            </div>
            
            <div className="flex gap-2">
              {canPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="flex-1"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Preview: {fileName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative min-h-[400px] bg-gray-50 rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading preview...</span>
                </div>
              </div>
            )}
            
            {previewError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Unable to preview file</p>
                  <p className="text-sm text-gray-500">{previewError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenInNewTab}
                    className="mt-2"
                  >
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}

            {fileType.includes('pdf') && (
              <iframe
                src={`${fileUrl}#toolbar=0`}
                className="w-full h-full min-h-[600px]"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setPreviewError('Failed to load PDF preview');
                }}
              />
            )}

            {fileType.includes('image') && (
              <img
                src={fileUrl}
                alt={fileName}
                className="w-full h-auto max-h-[600px] object-contain"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setPreviewError('Failed to load image preview');
                }}
              />
            )}

            {!fileType.includes('pdf') && !fileType.includes('image') && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenInNewTab}
                    className="mt-2"
                  >
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 