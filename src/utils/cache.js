import Cookies from 'js-cookie'

const tokenKey = 'Admin-Token'
const userName = 'userName'
const passWord = 'passWord'
export function getToken () {
  return Cookies.get(tokenKey)
}

export function setToken (token) {
  return Cookies.set(tokenKey, token)
}

export function removeToken () {
  return Cookies.remove(tokenKey)
}

export function setuser (token) {
  return Cookies.set(userName, token)
}

export function setpassword (token) {
  return Cookies.set(passWord, token)
}

export function getuser () {
  return Cookies.get(userName)
}

export function getpassword () {
  return Cookies.get(passWord)
}

export function removeuser () {
  return Cookies.remove(userName)
}

export function removepassword () {
  return Cookies.remove(passWord)
}
