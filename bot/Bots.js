
class Bot {
    constructor() {}
	bestMove(board, turn, makeMove) {
        this.turn = turn;
		const n = new Node(board, turn);
        const thinking = this.minimax(n, 4, turn);
        console.log(thinking);
        if (!thinking.move) {
            return;
        }
		return setTimeout(() => {
			console.log(makeMove(thinking.move.justMoved));
		}, 500);
    }
    minimax(node, depth, turn) {
        if (depth === 0 || node.value !== 0 || node.getChildren().length === 0) {
            return {val: node.value !== 0 ? -1 : 0};
        }
        let move = null;
        let val = -Infinity;
        node.getChildren().forEach(child => {
            let tempVal = -this.minimax(child, depth - 1, node.turn % 2 + 1).val;
            if (tempVal > val) {
                val = tempVal;
                move = child;
            }
        });
        return {val, move};
    }
}

export class Node {
	constructor(board, nextTurn, justMoved) {
		this.board = board;
		this.nextTurn = nextTurn;
        this.prevTurn = nextTurn % 2 + 1;
        this.justMoved = justMoved;
		this.value = this.evaluate();
		this.children = [];
	}
	evaluate() {
        for (let col = 0; col < 7; col++) { // vertical matches
            let counter = 0;
            for (let row = 5; row >= 0; row--) {
                if (this.board[col][row] === this.prevTurn) {
                    counter++;
                    if (counter === 4) return this.prevTurn;
                }
                else if (this.board[col][row] === 0) break;
                else counter = 0;
            }
        }

        for (let row = 5; row >= 0; row--) { // horizontal
            let counter = 0;
            for (let col = 0; col < 7; col++) {
                if (this.board[col][row] === this.prevTurn) {
                    counter++;
                    if (counter === 4) return this.prevTurn;
                }
                else counter = 0;
            }
        }

        
        for (let col = 0; col < 6; col++) { // diagonal (forward)
            let counter = 0;
            // for (let row = 5; row >= 0; row--) {
            for (let row = 0; row < 6; row++) {
                if (col - 2 + row < 0)  continue;
                if (col - 2 + row >= 7) break;
                if (this.board[col - 2 + row][5 - row] === this.prevTurn) {
                    counter++;
                    if (counter === 4) return this.prevTurn;
                }
                else if (this.board[col - 2 + row][5 - row] === 0) break;
                else counter = 0;
            }
        }

        for (let col = 6; col >= 0; col--) { // diagonal (backwards)
            let counter = 0;
            for (let row = 0; row < 6; row++) {
                if (col + 2 - row < 0)  break;
                if (col + 2 - row >= 7) continue;
                if (this.board[col + 2 - row][5 - row] === this.prevTurn) {
                    counter++;
                    if (counter === 4) return this.prevTurn;
                }
                else if (this.board[col + 2 - row][5 - row] === 0) break;
                else counter = 0;
            }
        }
        return 0;
    }
	getChildren() {
		if (this.children.length)   return this.children;   // if children already generated, return them
        for (let col = 0; col < 7; col++) {
            let newBoard = copyBoard(this.board)
            for (let row = 5; row >= 0; row--) {
                if (this.board[col][row] === 0) {
                    newBoard[col][row] = this.nextTurn;
                    this.children.push(new Node(newBoard, this.prevTurn, col));
                    break;
                }
            }
        }
        return this.children;
	}
}

const copyBoard = board => {
    let newBoard = [];
    board.forEach(column => {
        newBoard.push([...column]);
    });
    return newBoard;
}

export default Bot = new Bot();