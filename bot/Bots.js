
class Bot {
    constructor() {}
	async bestMove(board, difficulty, turn, makeMove) {
        await new Promise((res) => {
            this.timer = setTimeout(res, 1000);
        });
        this.turn = turn;
		const n = new Node(board, turn, 0, 49);
        const thinking = this.minimax(n, difficulty);
        if (!thinking.move) return; // no moves?
        makeMove(thinking.move.justMoved);
    }
    abort() {
        clearTimeout(this.timer);
    }
    minimax(node, depth) {
        if (depth === 0 || node.over || node.getChildren().length === 0) {
            return {val: -node.value};
        }
        let move = null;
        let val = -Infinity;
        node.getChildren().forEach(child => {
            let tempVal = -this.minimax(child, depth - 1).val;
            if (tempVal > val) {
                val = tempVal;
                move = child;
            }
            if (val === tempVal && Math.abs(3 - child.justMoved) < Math.abs(3 - move.justMoved)) {
                move = child;
            }
        });
        return {val, move};
    }
}

export class Node {
	constructor(board, nextTurn, justMoved, slotsLeft) {
		this.board = board;
		this.nextTurn = nextTurn;
        this.prevTurn = nextTurn % 2 + 1;
        this.justMoved = justMoved;
        this.slotsLeft = slotsLeft;
        this.over = true;
		this.value = this.evaluate();
		this.children = [];
	}
	evaluate() {
        let highestCounter = 0;
        for (let col = 0; col < 7; col++) { // vertical matches
            let counter = 0;
            for (let row = 5; row >= 0; row--) {
                if (this.board[col][row] === this.prevTurn) {
                    counter++;
                    if (counter > highestCounter)   highestCounter = counter;
                    if (counter === 4) return this.slotsLeft;
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
                    if (counter > highestCounter)   highestCounter = counter;
                    if (counter === 4) return this.slotsLeft;
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
                    if (counter > highestCounter)   highestCounter = counter;
                    if (counter === 4) return this.slotsLeft;
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
                    if (counter > highestCounter)   highestCounter = counter;
                    if (counter === 4) return this.slotsLeft;
                }
                else if (this.board[col + 2 - row][5 - row] === 0) break;
                else counter = 0;
            }
        }
        this.over = false;
        return highestCounter * 0.1;
    }
	getChildren() {
        if (this.over)   return [];
		if (this.children.length)   return this.children;   // if children already generated, return them
        for (let col = 0; col < 7; col++) {
            let newBoard = copyBoard(this.board);
            for (let row = 5; row >= 0; row--) {
                if (this.board[col][row] === 0) {
                    newBoard[col][row] = this.nextTurn;
                    this.children.push(new Node(newBoard, this.prevTurn, col, this.slotsLeft - 1));
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

const compareBoards = (a,b) => {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 6; j++) {
            if (a[i][j] !== b[i][j]) {
                return false;
            }
        }
    }
    return true;
}

export default Bot = new Bot();