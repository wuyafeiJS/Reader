import axios from "axios";
import { AsyncStorage } from 'react-native'
import DeviceInfo from "react-native-device-info";
import setAuthorizationToken from "../utils/setAuthorizationToken";

const handleData = data => {
  let msg;
  if (!data) msg = { msg: "研发GG正在加班修复中，请您稍后再试" };
  if (data.success === true) {
    msg = "操作成功";
  } else {
    msg = "操作失败";
  }
  alert(msg);
  return { data };
};
export function getAuth() {
  const uuid = DeviceInfo.getUniqueID();
  const json = { user: { uuid } };
  return axios.post("/users/tourists", json).then(res => {
    setAuthorizationToken(res.data.token);
    AsyncStorage.setItem(`userToken`, res.data.token)
    return { data: res };
  });
}

export function register(loginData) {
  return axios.post("/users/register", loginData).then(res => ({ data: res }), err => (console.log(err)));
}

export function login(loginData) {
  return axios.post("/auth", loginData).then(res => {
    console.log(res,99)
    if (res.data.code === 0) {
      setAuthorizationToken(res.data.token);
      console.log(res.data)
      AsyncStorage.multiSet([['username', res.data.username], ['userToken', res.data.token]])
    }
    return { data: res };
  }, err => {
    alert('登录失败，账号或密码错误')
  });
}
export function getBookshelfTourist(token) {
  setAuthorizationToken(token);
  return axios
    .get("/bookshelfs")
    .then(res => ({ data: res }), err => console.error(err));
}
export function searchBookWords(text) {
  return axios
    .get(`/novels/search/zh?keyword=${text}`)
    .then(res => ({ data: res }), err => console.error(err));
}
export function getNovelList(name) {
  return axios
    .get(`/novels/search/bqk?name=${name}`)
    .then(res => ({ data: res }), err => console.error(err));
}
export function getNovelInfo(name, url) {
  const json = {
    novel: {
      name: name,
      url: url
    }
  };
  return axios
    .post("/novels/acquire", json)
    .then(res => ({ data: res }), err => console.error(err));
}
export function orderNovel(id) {
  return axios.post('/bookshelfs/order', {id: id})
          .then(res => { console.log(res) })
}

export function deleteNovel(id) {
  return axios.post('/bookshelfs/delete', {id: id})
          .then(res => { console.log(res) })
}

export function getFirstRenderChapters(id, num) {
  return axios
    .get(`/chapters/firstRender?id=${id}&num=${num}`)
    .then(res => ({ data: res }), err => console.error(err));
}

export function getChapters(id, num) {
  let json = {
    id,
    num
  }
  return axios
    .post(`/chapters`, json)
    .then(res => ({ data: res }), err => console.error(err));
}

export function getDirectory(id, order) {
  return axios
  .get(`/novels/directory/${id}?order=${order}`)
  .then(res => ({ data: res }), err => console.error(err));
}