const { moveStatus } = require('./move_status');

class Game {
  constructor() {
    this.elements = [
      ['a', 'a', 'a', 'a', 'a'],
      ['a', 'a', 'a', 'a', 'a'],
      ['a', 'a', '-', 'b', 'b'],
      ['b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'b', 'b'],
    ];
    this.turn = 'b';
    this.bindingMove = false;
  }

  opposite = {
    a: 'b',
    b: 'a',
  };

  moveTurnHandler(from, to) {
    let x1 = Number(from[0]),
      x2 = Number(to[0]),
      y1 = Number(from[1]),
      y2 = Number(to[1]);

    if (this.elements[x1][y1] !== this.turn) {
      return moveStatus.invalidTurn;
    }
    // chick if it non kill move:
    // eg: (00) -> (01)
    if (this.isNonKillMove(x1, x2, y1, y2) && !this.bindingMove) {
      this.moveCell(from, to);
      this.resetState(this.turn);
      return moveStatus.nonekillMove;
    }
    // chick if it kill move:
    if (this.isKillMove(x1, x2, y1, y2)) {
      this.moveCell(from, to);
      this.bindingMove = true;
      return moveStatus.killMove;
    }

    return moveStatus.invalidMove;
  }

  moveCell(from, to) {
    this.elements[from[0]][from[1]] = '-';
    this.elements[to[0]][to[1]] = this.turn;
  }

  isNonKillMove(x1, x2, y1, y2) {
    if (this.elements[x2][y2] === '-') {
      if (
        (x1 === x2 && Math.abs(y1 - y2) === 1) ||
        (y1 === y2 && Math.abs(x1 - x2) === 1)
      ) {
        return true;
      }
    }
    return false;
  }

  isKillMove(x1, x2, y1, y2) {
    if (this.elements[x2][y2] !== '-') return false;

    let avgX = (x1 + x2) / 2,
      avgY = (y1 + y2) / 2;
    if (
      x1 === x2 &&
      Math.abs(y1 - y2) === 2 &&
      this.elements[x1][avgY] === this.opposite[this.turn]
    ) {
      this.elements[x1][avgY] = '-';
      return true;
    }
    if (
      y1 === y2 &&
      Math.abs(x1 - x2) === 2 &&
      this.elements[avgX][y1] === this.opposite[this.turn]
    ) {
      this.elements[avgX][y1] = '-';
      return true;
    }
    return false;
  }

  resetState(turn) {
    this.bindingMove = false;
    this.turn = this.opposite[turn];
  }
}

module.exports = Game;
