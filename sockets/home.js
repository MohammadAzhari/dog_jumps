const { socketHomeKeys } = require('./sokcet_events.js');

function homeSocket(io) {
  // memory cashe varible to restore the online games;
  io.onlineUsers = [];

  io.on('connection', (socket) => {
    //
    socket.on(socketHomeKeys.waitingForGame, (userName) => {
      let gameId = socket.id;
      // put the game in online games
      io.onlineUsers.push({ userName, gameId });
      // join the user to the game room
      socket.join(gameId);
      socket.emit(socketHomeKeys.waitingForGame, {
        gameId,
      });
    });
    //
    socket.on(socketHomeKeys.getOnlineUsers, () => {
      socket.emit(socketHomeKeys.getOnlineUsers, {
        onlineUsers: io.onlineUsers,
      });
    });
    //
    socket.on(socketHomeKeys.joinGame, ({ gameObj, userName }) => {
      let { gameId } = gameObj;
      // second user will join the game room;
      socket.join(gameId);
      // remove the game from online users;
      io.onlineUsers = io.onlineUsers.filter((game) => game.gameId !== gameId);
      // put the users in key;
      io[gameId] = {
        users: {
          a: gameObj.userName,
          b: userName,
        },
      };
      // emit the game id;
      io.to(gameId).emit(socketHomeKeys.joinGame, {
        gameId,
      });
    });

    socket.on('disconnect', () => {
      // remove the disconnected user from online users
      io.onlineUsers = io.onlineUsers.filter(
        (user) => user.gameId !== socket.id
      );
    });
  });
}

module.exports = homeSocket;
