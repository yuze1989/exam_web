import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}
export function setUsers(users) {
  return Cookies.set("users", users);
}
export function getUsers() {
  return Cookies.get("users");
}
export function getMenu() {
  return JSON.parse(localStorage.getItem("menu"));
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}



