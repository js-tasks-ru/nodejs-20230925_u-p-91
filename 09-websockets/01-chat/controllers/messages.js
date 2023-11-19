const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  if(!ctx.user) {
    return ctx.throw(401, 'Пользователь не залогинен');
  }
  
  try {
    const messages = await Message.find({chat: ctx.user._id.toString()}).limit(20);
    ctx.body = {messages: messages.map(mapMessage)};
  } catch(err) {
    throw err;
  }
};
