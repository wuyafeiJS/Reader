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

export function getFirstRenderChapters(id, num) {
  return axios
    .get(`/chapters/firstRender?id=${id}&num=${num}`)
    .then(res => ({ data: res }), err => console.error(err));
}