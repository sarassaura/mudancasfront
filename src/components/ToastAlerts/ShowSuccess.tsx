import { toast } from "react-toastify";

export const showSuccess = (message: string, duration: number = 3000) => {
  return toast.success(message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
