import { api } from './auth';

export const listPatientPermissions = async () => {
  const res = await api.get('/permission/patient', { withCredentials: true });
  return res.data?.data || [];
};

export const upsertPermission = async ({ providerId, documentType, scope, isActive }) => {
  const res = await api.post('/permission/upsert', { providerId, documentType, scope, isActive }, { withCredentials: true });
  return res.data?.data;
};

export const togglePermission = async ({ providerId, isActive }) => {
  const res = await api.post('/permission/toggle', { providerId, isActive }, { withCredentials: true });
  return res.data?.data;
};

export const listProviderPermissions = async () => {
  const res = await api.get('/permission/provider', { withCredentials: true });
  return res.data?.data || [];
};


