const jwt = require('jsonwebtoken')

function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const {userId} = jwt.verify(token, process.env.JWT_SECRET)
    return userId
  }
  throw new new Error('Not authenticated!')
}

module.exports = {
  getUserId
}