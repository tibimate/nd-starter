import axiosInstance from '@/lib/axiosInstance';

interface AccountParams {
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: File | null | string; // Permitir tanto File para upload como string para URL existente
  [key: string]: any; // Para permitir otros campos dinámicos
}

interface PasswordParams {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

export const userService = {
  

  async getAccount() {
    const response = await axiosInstance.get(`/user/account`);
    return response.data;
  },

  async removeAvatar() {
    const response = await axiosInstance.post(`/user/account/remove_avatar/`);
    return response.data;
  },


  async updateAccount(data: AccountParams) {
    // If avatar file is being sent, use FormData for multipart/form-data encoding
    if (data.avatar) {
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      
      const response = await axiosInstance.patch(`/user/account/update_account/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // For non-file updates, use regular JSON
      const response = await axiosInstance.patch(`/user/account/update_account/`, data);
      return response.data;
    }
  },


  async updatePassword(data: PasswordParams) {
    const response = await axiosInstance.post(`/user/account/update_password/`, data);
    return response.data;
  },


};  
