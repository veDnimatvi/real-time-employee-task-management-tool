import { getCookie, KEY } from "./cookie";

export const isAuthenticated = () => {
  const accessToken = getCookie(KEY.TOKEN);
  return !!accessToken && accessToken.length > 0;
};

export function formatPrice(x) {
  return x.toLocaleString("vi", { style: "currency", currency: "AUD" });
}

export const formatter = (value) => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parser = (value) => {
  return value.replace(/\$\s?|(,*)/g, "");
};

export const handleKeyDown = (e) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];

  if (!allowedKeys.includes(e.key) && isNaN(Number(e.key))) {
    e.preventDefault();
  }
};
