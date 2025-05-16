import { useMutation, useQuery } from '@tanstack/react-query';
import { 
    registration, 
  login, 
  verifyEmail 
} from './authServices.js';

export const useRegister = () => {
    return useMutation({
      mutationFn: (userData) => registration(userData),
      onSuccess: () => {
        console.log('Registration successful');
      }
    });
  };


export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      throw error;
    }
  });
};


export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token) => verifyEmail(token),
    onSuccess: (data) => {
      console.log('Email verified successfully:', data);
    },
  });
};

export const resendVerificationEmail = (email) => {
    return useMutation({
        mutationFn: () => apiClient.post('/auth/resend-verification-email', { email }),
        onSuccess: (data) => {
            console.log('Verification email resent:', data);
        },
        onError: (error) => {
            console.error('Error resending verification email:', error);
        }
    });
}