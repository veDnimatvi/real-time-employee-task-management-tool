import Cookies from "js-cookie";

export function getCookie(key) {
  return Cookies.get(key);
}

export function setCookie(key, value) {
  return Cookies.set(key, value);
}

export function removeCookie(key) {
  return Cookies.remove(key);
}

export const KEY = {
  TOKEN: "TOKEN",
  NAME: "NAME",
  PHONE: "PHONE",
  ROLE: "ROLE",
};
