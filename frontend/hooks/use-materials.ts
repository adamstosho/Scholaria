import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Material, PaginatedResponse, ApiResponse } from '@/types/api';
import toast from 'react-hot-toast';

export function useMaterials(page: number = 1, limit: number = 10, search?: string, category?: string, courseId?: string) {
  return useQuery<PaginatedResponse<Material>>({
    queryKey: ['materials', page, limit, search, category, courseId],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && category !== 'all' && { category }),
        ...(courseId && { courseId }),
      });
      const response = await api.get(`/materials?${params}`);
      return response.data;
    },
  });
}

export function useMaterial(id: string) {
  return useQuery<ApiResponse<Material>>({
    queryKey: ['material', id],
    queryFn: async () => {
      const response = await api.get(`/materials/detail/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUploadMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload material');
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{
      title: string;
      description: string;
      category: string;
    }> }) => {
      const response = await api.put(`/materials/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material'] });
      toast.success('Material updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update material');
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/materials/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete material');
    },
  });
}

export function useDownloadMaterial() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.get(`/materials/download/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    },
    onSuccess: (data, id) => {
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `material-${id}.pdf`); // You might want to get the actual filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      toast.error('Failed to download material');
    },
  });
}