import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import logger from 'koa-logger'
import mongoose from 'mongoose'
import session from 'koa-generic-session'
import passport from '../config/passport'
import mount from 'koa-mount'
import serve from 'koa-static'

import config from '../config'
import handle from '../src/utils/handle'
import { errorMiddleware } from '../src/middleware'

// const easyMonitor = require('easy-monitor')
// easyMonitor({
//   cluster: true,
//   bootstrap: 'embrace',
//   project_name: 'wu-server',
//   /**
//      @param {string} tcp_host 填写你部署的 dashboard 进程所在的服务器 ip
//      @param {number} tcp_port 填写你部署的 dashboard 进程所在的服务器 端口
//      **/
//   embrace: {
//     tcp_host: '127.0.0.1',
//     tcp_port: 26666
//   }
// })

global.Handle = handle

const app = new Koa()
app.keys = [config.session]

mongoose.Promise = global.Promise
mongoose.connect(config.database)

app.use(convert(logger()))
app.use(bodyParser())
app.use(convert(session()))
app.use(errorMiddleware())

app.use(convert(mount('/docs', serve(`${process.cwd()}/docs`))))

// require('../config/passport')
app.use(passport.initialize())
app.use(passport.session())

const modules = require('../src/modules')
modules(app)

app.listen(config.port, () => {
  console.log(`Server started on ${config.port}`)
})

// 每天凌晨准时更新小说爬虫
// const UpdateNovel = require('../src/utils/updateNovel')
// if (app.env === 'production') {
//   UpdateNovel.update()
// }
require('../src/utils/schedule/updateChapter')

export default app
