const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const token = uuid();
    
    const {displayName, email, password} = ctx.request.body;
    try {
        let user = await User.create({
            displayName, email, verificationToken: token
        })
        await user.setPassword(password);
        await user.save();

        await sendMail({to: user.email, subject: "Subject", template: "confirmation", locals: { token }});

        ctx.body = { status: 'ok' };
    } catch(err) {
        throw err;
    }
};

module.exports.confirm = async (ctx, next) => {
    const token = ctx.request.body.verificationToken;
    
    const user = await User.findOneAndUpdate({verificationToken: token}, { $unset : {"verificationToken": 1}});

    if(!user) {
      ctx.throw(400, {message: 'Ссылка подтверждения недействительна или устарела'})
    } else {   
      ctx.body = {token: await ctx.login(user)};
    }
};
