import Cookies from 'js-cookie'

const TokenKey = 'token'

const UserInfoKey='userInfo'

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
  var userInfo= localStorage.getItem(UserInfoKey);
  return JSON.parse(userInfo);
}
export function setCacheUserInfo(userInfo){ 
  localStorage.setItem(UserInfoKey, JSON.stringify(userInfo)) 
  return;
}
export function removeCacheUserInfo() { 
  return localStorage.removeItem(UserInfoKey)
}