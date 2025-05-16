// src/utils/toast.js
import { toast } from 'react-toastify';

const defaultOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const toastService = {
  success: (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message, options = {}) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },
};

// Usage:
// import { toastService } from '../utils/toast';
// toastService.success('Message');
// toastService.error('Message', { autoClose: 10000 });