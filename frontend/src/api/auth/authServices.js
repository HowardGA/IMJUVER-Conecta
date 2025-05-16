import apiClient from '../client.js'

export const registration = (userData) => 
  apiClient.post('/auth/register', userData);

export const login = (credentials) => 
  apiClient.post('/auth/login', credentials, 
   { withCredentials: true}
  );

export const verifyEmail = (token) => 
  apiClient.get(`/auth/verify-email/${token}`);

export const resendVerificationEmail = (email) =>
  apiClient.post('/auth/resend-verification-email', { email });