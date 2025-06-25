import { toast, Slide } from "react-toastify";
const toastConfig = {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Slide,
};

export function showSuccessToast(message) {
  toast.success(message, toastConfig);
}

export function showErrorToast(message) {
  toast.error(message, toastConfig);
}
