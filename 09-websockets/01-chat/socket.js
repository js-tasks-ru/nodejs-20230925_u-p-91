const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server, {allowEIO3: true});

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    try {
      if(!token) {
        return next(new Error("anonymous sessions are not allowed"));
      }
      
      const sessionUser = await Session.findOne({ token: token }).populate('user');
      if(!sessionUser) {
        return next(new Error("wrong or expired session token"));
      }
      socket.user = sessionUser.user;

      next();

    } catch(err) {
      next(new Error(err.message))
    }
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      try {
        await Message.create({
          date: new Date(),
          text: msg,
          chat: socket.user._id.toString(),
          user: socket.user.displayName
        });
      }catch(err) {
        next(new Error(err.message))
      }
    });
  });

  return io;
}

module.exports = socket;
