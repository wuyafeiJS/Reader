import passport from 'koa-passport'
import User from '../src/models/users'
import { Strategy } from 'passport-local'

/**
 * @param username 用户输入的用户名
 * @param password 用户输入的密码
 * @param done 验证完成后的回调函数
*/
passport.use('local', new Strategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const user = await User.findOne({ username })
    if (!user) { return done(null, false) }

    try {
      const isMatch = await user.validatePassword(password)

      if (!isMatch) { return done(null, false) }

      done(null, user)
    } catch (err) {
      done(err)
    }
  } catch (err) {
    return done(err)
  }
}))
// serializeUser 在用户登录验证成功后将会把用户的数据储存到 session 中
passport.serializeUser((user, done) => {
  console.log('kkkkkkk')
  done(null, user.id)
})

// deserializeUser 在每次请求时候将从 session 中读用户对象
passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser, id: ' + id)
  try {
    const user = await User.findById(id, '-password')
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport
