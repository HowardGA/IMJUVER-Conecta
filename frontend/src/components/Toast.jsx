import React, { useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = ({ message, type }) => {
  useEffect(() => {
    if (!message) return;

    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    };

    if (type === "success") {
      toast.success(message, toastOptions);
    } else if (type === "error") {
      toast.error(message, toastOptions);
    }
  }, [message, type]);

  return <ToastContainer />;
};

export default Toast;