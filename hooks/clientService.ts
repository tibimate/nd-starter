import axiosInstance from '@/lib/axiosInstance';
import { Client } from '@/types/models';



export const clientService = {
  
  
  async getClients(query_params?: Record<string, any>) {
    const response = await axiosInstance.get(`/clients/`, { params: query_params });
    return response.data;
  },

  async getClientById(id: number) {
    const response = await axiosInstance.get(`/clients/${id}/`);
    return response.data;
  },

  async createClient(data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    const response = await axiosInstance.post(`/clients/`, data);
    return response.data;
  },

  async updateClient(id: number, data: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>) {
    const response = await axiosInstance.patch(`/clients/${id}/`, data);
    return response.data;
  },

  async deleteClient(id: number) {
    const response = await axiosInstance.delete(`/clients/${id}/`);
    return response.data;
  }


};  
