const Game = require('../logic/game');
const { moveStatus } = require('../logic/move_status');
const { socketGameKeys } = require('./sokcet_events');

function gameSockets(io) {
  io.of('/game').on('connection', (socket) => {
    // socket listeners
    socket.on(socketGameKeys.startGame, (gameId) => {
      // chick if the game exist:
      if (!(gameId in io)) return;
      // enter each user to game room:
      socket.join(gameId);
      // get users:
      let { users } = io[gameId];
      // create and save game instnce to cashe memory:
      io[gameId].game = new Game();
      // emit:
      io.of('/game').to(gameId).emit(socketGameKeys.startGame, {
        users,
        elements: io[gameId].game.elements,
      });
    });
    socket.on(socketGameKeys.moveTurn, ({ gameId, from, to }) => {
      // get the game instance from cashe memory:
      let { game } = io[gameId];
      // handle the move and save the status in the varible:
      const status = game.moveTurnHandler(from, to);

      const emitMoveTurn = () => {
        io.of('/game').to(gameId).emit(socketGameKeys.moveTurn, {
          turn: game.turn,
          elements: game.elements,
        });
      };

      emitMoveTurn();

      if (status === moveStatus.killMove) {
        // here will handle the double move situation:
        let currentTurn = game.turn;
        const timeout = setTimeout(() => {
          game.resetState(currentTurn);
          emitMoveTurn();
          return clearTimeout(timeout);
        }, 2000);
      }
    });
  });
}

module.exports = gameSockets;
