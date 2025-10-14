import { toast } from "react-toastify";

export const showError = (message: string, duration: number = 5000) => {
  return toast.error(message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
