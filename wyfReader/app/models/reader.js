import { Toast } from 'antd-mobile'
import { createAction, NavigationActions } from '../utils'
import * as authService from '../services/auth'
import * as services from '../services/app'

export default {
  namespace: 'reader',
  state: {
  },
  reducers: {
    receiveRenderChapters(state, { payload: { id } }) {
      return { ...state, id }
    },
    receiveFirstChapters(state, { payload: { firstChapter } }) {
      return { ...state, firstChapter }
    },
    receiveChapters(state, { payload: { chapter } }) {
      return { ...state, chapter }
    },
    receiveDirectory(state, { payload: { directory } }) {
      return { ...state, directory }
    },
  },
  effects: {
    *getFirstRenderChapters({ payload: { id, num } }, { call, put }) {
      const { data } = yield call(services.getFirstRenderChapters, id, num)
      yield put({
        type: 'receiveFirstChapters',
        payload: {
          firstChapter: data.data.response
        }
      })
    },
    *getChapters({ payload: { id, num } }, { call, put }) {
      const { data } = yield call(services.getChapters, id, num)
      yield put({
        type: 'receiveChapters',
        payload: {
          chapter: data.data.response
        }
      })
    },
    *getDirectory({ payload: { id, order } }, { call, put }) {
      const { data } = yield call(services.getDirectory, id, order)
      yield put({
        type: 'receiveDirectory',
        payload: {
          directory: data.data.chapters
        }
      })
    }
  }
}
