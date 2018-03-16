let schedule = require('node-schedule')
let cucurrentRule = new schedule.RecurrenceRule()
import * as UpdateNovel from '../updateNovel'
// let scheduleTime = [10, 51, 81] // 检查频率
// cucurrentRule.dayOfWeek = 0
cucurrentRule.hour = 24
cucurrentRule.minute = 0
// cucurrentRule.second = scheduleTime
console.log('===scheduler start ========.')
schedule.scheduleJob(cucurrentRule, async function () {
  try {
    console.info('===update started at: ' + new Date())
    await UpdateNovel.update()
    console.log('====down at: ' + new Date())
  } catch (error) {
    console.error('process error: ' + error)
  } finally {
    console.info('===ended at: ' + new Date())
  }
})
