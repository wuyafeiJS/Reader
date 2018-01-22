import { Toast } from 'antd-mobile'
import { createAction, NavigationActions } from '../utils'
import * as authService from '../services/auth'
import * as services from '../services/app'

export default {
  namespace: 'reader',
  state: {
  },
  reducers: {
    apply(state, { payload: action }) {
      return routerReducer(state, action)
    },
    receiveRenderChapters(state, { payload: { id } }) {
      return { ...state, id }
    },
    receiveFirstChapters(state, { payload: { firstChapter } }) {
      return { ...state, firstChapter }
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
    }
  }
}
