import { Toast } from 'antd-mobile'
import { createAction, NavigationActions } from '../utils'
import * as authService from '../services/auth'
import * as services from '../services/app'

export default {
  namespace: 'app',
  state: {
  },
  reducers: {
    loginStart(state, { payload: { loginData } }) {
      return { ...state, loginData }
    },
    receiveRegister(state, { payload: { registerData } }) {
      return { ...state, registerData }
    },
    receiveBookList(state, { payload: { bookList } }){
      return { ...state, bookList }
    },
    receiveToken(state, { payload: { token } }){
      return { ...state, token }
    },
    receiveBookName(state, { payload: { bookNames } }){
      return { ...state, bookNames }
    },
    receiveSearchNovel(state, { payload: { searchBooks } }){
      return { ...state, searchBooks }
    },
    receiveNovelInfo(state, { payload: { NovelInfo } }){
      return { ...state, NovelInfo }
    },
    
  },
  effects: {
    *register({ payload: { registerData } }, { call, put }) {
      // yield put(createAction('loginStart')())
      const { data } = yield call(services.register, registerData)
      yield put({
        type: "receiveRegister",
        payload: {
          registerData: data.data
        }
      })
      if (data.data.code === 0) {
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
          })
        )
      }
    },
    *login({ payload: { loginData } }, { call, put }) {
      const { data } = yield call(services.login, loginData)
      yield put({
        type: "loginStart",
        payload: {
          loginData: data.data
        }
      })
      
      if (data.data.code === 0) {
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          })
        )
      }
    },
    *getBookList({}, { call, put, select }) {
      const token = yield select(state => state.app.token)
      
      if (!token) {
        yield put({
          type: 'getAuth',
          payload: {}
        })
        return
      }
      const { data } = yield call(services.getBookshelfTourist, token)
      yield put({
        type:'receiveBookList',
        payload: {
          bookList: data.data.list,
        }
      })
    },
    *getNovelList({ payload: { name } }, { call, put }){
      const { data } = yield call(services.getNovelList, name)
      yield put({
        type:'receiveSearchNovel',
        payload: {
          searchBooks: data.data.response,
        }
      })
    },
    *getNovelInfo({ payload: { name, url } }, { call, put }){
      const { data } = yield call(services.getNovelInfo, name, url)
      if (!data) {
        Toast.fail('服务器错误！', 2)
      }
      let novelInfo;
      if (data.data.code === 404) {
        novelInfo = {}
      } else {
        novelInfo = data.data.novelInfo
      }
      
      yield put({
        type:'receiveNovelInfo',
        payload: {
          NovelInfo: novelInfo,
        }
      })
    },
    // 加入书架
    *orderNovel ({ payload: { id } }, { call }) {
      yield call(services.orderNovel, id)
    },
    *searchBookWords({ payload: { text } }, { call, put }) {
      const { data } = yield call(services.searchBookWords, text)
      yield put({
        type:'receiveBookName',
        payload: {
          bookNames: data.data.response,
        }
      })
    },
    *getAuth({ payload:{} }, { call, put }) {
      const {data} = yield call(services.getAuth)
      yield put({
        type: 'receiveToken',
        payload: {
          token: data.data.token
        }
      })
      yield put({
        type: 'getBookList',
        payload: {
          
        }
      })
    },
    
  },
}
