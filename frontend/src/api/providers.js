import { api } from './auth';

export const getAllProviders = async () => {
  const response = await api.get('/provider/all');
  return response.data?.data || [];
};


