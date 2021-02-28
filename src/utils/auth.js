import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getCacheUserInfo(){
  var userInfo= localStorage.getItem(localStorage.getItem(TokenKey));
  return JSON.parse(userInfo);
}
export function setCacheUserInfo(userInfo){
  var tokenValue=localStorage.getItem(TokenKey)
  localStorage.setItem(tokenValue, JSON.stringify(userInfo)) 
  return;
}
export function removeCacheUserInfo() {
  var tokenValue=localStorage.getItem(TokenKey)
  return localStorage.removeItem(tokenValue)
}