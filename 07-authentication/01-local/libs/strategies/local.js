const LocalStrategy = require('passport-local').Strategy;
const User = require("../../models/User");

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      
      try {
        const user = await User.find({ email });
        
        if(!user.length) {
          return done(null, false, 'Нет такого пользователя');
        }
        let isValidPassword = await user[0].checkPassword(password);
        if(!isValidPassword) {
          return done(null, false, 'Неверный пароль');
        }

        done(null, user[0])
      } catch(err) {
        return done(err);
      }
    },
);
