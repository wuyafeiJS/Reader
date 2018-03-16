import passport from '../../../config/passport'

/**
 * @apiDefine TokenError
 * @apiError Unauthorized Invalid JWT token
 *
 * @apiErrorExample {json} Unauthorized-Error:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": 401,
 *       "error": "Unauthorized"
 *     }
 */
// 认证登录
export async function authUser (ctx, next) {
  const code = ctx.request.body.code
  const captcha = ctx.session.captcha.toLowerCase()
  if (captcha !== code.toLowerCase()) {
    ctx.body = {
      code: -1,
      msg: '验证码错误'
    }
    return
  }
  return passport.authenticate('local', (user) => {
    if (!user) {
      // ctx.throw(401)
      ctx.body = {
        code: 11,
        msg: '账号或密码错误'
      }
      return
    }

    const token = user.generateToken()

    const response = user.toJSON()
    delete response.password
    ctx.body = {
      code: 0,
      token,
      username: response.username
    }
    ctx.login(user)
  })(ctx, next)
}
// 测试是否认证
export async function testUser (ctx, next) {
  console.log(ctx.isAuthenticated(), '=======')
  if (ctx.isAuthenticated()) {
    ctx.body = '认证通过'
  } else {
    ctx.throw(401)
    ctx.body = '非法访问'
  }
}
