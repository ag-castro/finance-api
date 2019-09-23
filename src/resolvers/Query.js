const moment = require('moment')
const { getUserId } = require('./../utils')

function accounts(parent, args, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.query.accounts({
    where: {
      OR: [
        {
          user: {
            id: userId
          }
        },
        {
          user: null
        }
      ]
    },
    orderBy: 'description_ASC'
  }, info)
}

function categories(parent, {operation}, ctx, info) {
  const userId = getUserId(ctx)
  let AND = [
    {
      OR: [
        {user: { id: userId}},
        {user: null}
      ]
    }
  ]
  
  AND = !operation ? AND : [ ...AND, {operation} ]
  
  return ctx.db.query.categories({
    where: {AND},
    orderBy: 'description_ASC'
  }, info)
}

function records(parent, {month, type, accountsIds, categoriesIds}, ctx, info) {
  const userId = getUserId(ctx)
  let AND = [{user: {id: userId}}]
  AND = !type ? AND : [...AND, { type }]
  AND = !accountsIds || accountsIds.length === 0 
    ? AND
    : [
      ...AND,
      { OR: accountsIds.map(id => ({ account: {id} })) }
    ]
  AND = !categoriesIds || categoriesIds.length === 0 
    ? AND
    : [
      ...AND,
      { OR: categoriesIds.map(id => ({ category: {id} })) }
    ]
  if (month) {
    const date = moment(month, 'MM-YYYY')
    const startDate = date.startOf('month').toISOString()
    const endDate = date.endOf('month').toISOString()
    AND = [
      ...AND,
      {date_gte: startDate},
      {date_lte: endDate}
    ]

    console.log('Base date: ', date.toISOString())
    console.log('Start date: ', startDate)
    console.log('End date: ', endDate)

  }
  return ctx.db.query.records({
    where: {AND},
    orderBy: 'date_ASC'
  }, info)
}

function user(parent, args, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.query.user({ where: { id: userId }}, info)
}

module.exports = {
  accounts,
  categories,
  records,
  user
}