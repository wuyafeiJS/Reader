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
  return passport.authenticate('local', (user) => {
    if (!user) {
      ctx.throw(401)
    }

    const token = user.generateToken()

    const response = user.toJSON()
    delete response.password
    ctx.body = {
      token,
      user: response
    }
    ctx.login(user)
  })(ctx, next)
}
// 测试是否认证
export async function testUser (ctx, next) {
  console.log(ctx.isAuthenticated(),'=======')
  if (ctx.isAuthenticated()) {
    ctx.body = '认证通过'
  } else {
    ctx.throw(401)
    ctx.body = '非法访问'
  }
}
