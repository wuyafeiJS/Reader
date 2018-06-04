import React from 'react'
import { AppRegistry, AsyncStorage } from 'react-native'
import { persistStore, autoRehydrate } from 'redux-persist' // 状态持久化
import axios from 'axios'
import dva from './utils/dva'
import Router from './router'
import appModel from './models/app'
import reader from './models/reader'
import routerModel from './models/router'

const app = dva({
  initialState: {},
  models: [appModel, routerModel, reader],
  extraEnhancers: [autoRehydrate()],
  onError(e) {
    console.log('onError', e)
  },
})
// 设置后台地址
// axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.baseURL = 'http://120.79.161.225/server'
const App = app.start(<Router />)
persistStore(app.getStore(), {
  storage: AsyncStorage,
  blacklist: ['router'],
})

AppRegistry.registerComponent('wyfReader', () => App)
