import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, TouchableWithoutFeedback} from 'react-native';

import Board from './Board';

export default MatchScreen = () => {
	const [board, setBoard] = useState([[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]);
	const [gameState, setGameState] = useState('active');
	const [turn, setTurn] = useState(1);
	const [moves, setMoves] = useState([]);
	const [players, setPlayers] = useState([{name: 'Player 1', wins: 0},{name: 'Player 2', wins: 0}]);

	useEffect(() => {
		checkGameState();
	}, [moves]);
	
	const makeMove = (column, turn) => {
		if (gameState !== 'active') {
			return;	// game is not in progress (paused, finished, etc.)
		}
		for (let i = board[column].length - 1; i >= 0; i--) {
			if (!board[column][i]) {
				setBoard(prevBoard => {
					prevBoard[column][i] = turn;
					return prevBoard;
				});
				setMoves([...moves, [column, i]]);
				//checkGameState();
				return;
			}
		}
		// invalid move
	}

	const checkGameState = () => {
		if (moves.length && gameState === 'active') {
			const evaluation = evaluateBoard();
			if (evaluation) {
				setGameState('win');
				return;
			}
			switchTurns();
			return;
		}
	}

	const evaluateBoard = () => {
    // use last move
    if (moves.length) {
      const lastMove = moves[moves.length - 1];
      const color = board[lastMove[0]][lastMove[1]];
      for (let direction of [[0,1],[1,0],[1,1],[1,-1]]) {
        let reverseCount = 0;
        let forwardCount = 0;
        let currentPos = [...lastMove];
        while (true) {
          currentPos[0] -= direction[0];  // reverse
          currentPos[1] -= direction[1];
          // check if out of bounds (todo: replace 7 with constant)
          if (currentPos[0] < 0 || currentPos[0] >= 7) break;
          if (currentPos[1] < 0 || currentPos[1] >= 7) break;
          // if the chain stops
          if (board[currentPos[0]][currentPos[1]] !== color) break;
          reverseCount++;
        }
        currentPos = [...lastMove];
        while (true) {
          currentPos[0] += direction[0];  // forward
          currentPos[1] += direction[1];
          // check if out of bounds (todo: replace 7 with constant)
          if (currentPos[0] < 0 || currentPos[0] >= 7 || currentPos[1] < 0 || currentPos[1] >= 7) break;
          // if the chain stops
          if (board[currentPos[0]][currentPos[1]] !== color) break;
          forwardCount++;
        }
        if (reverseCount + 1 + forwardCount >= 4) {
          return color; // win
        }
      }
    }
    return 0;
	}
	
	const switchTurns = () => {
		setTurn(turn => turn === 1 ? 2 : 1);
	}

	const resetBoard = () => {
		setBoard([[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]);
		setTurn(1);
		setMoves([]);
		setGameState('active');
	}
	
  const undoMove = () => {
		setMoves(moves => {
			if (moves.length) {
				const lastMove = moves.pop();
				setBoard(board => {
					board[lastMove[0]][lastMove[1]] = 0;
					return board;
				});
				switchTurns();
				setGameState('active');
			}
			return moves;
		})

	}
	
	const styles = StyleSheet.create({
		parent: {
			alignItems: 'center'
		},
		text: {
			fontSize: 30,
			margin: 10
		},
		red: {
			color: 'red'
		},
		yellow: {
			color: '#eedd00'
		},
		buttonContainer: {
			flexDirection: 'row',
			marginVertical: 15,
			alignItems: 'stretch'
		},
		button: {
			fontSize: 50,
			justifyContent: 'space-between',
		},
		board: {
			flexDirection: 'row',
			backgroundColor: '#0d0d66',
			padding: 10
		},
		column: { flexDirection: 'column' },
		slot: {
			margin: 4,
			width: 40,
			height: 40,
			borderRadius: 20,
		},
		slot0: { backgroundColor: '#3333cc'		},
		slot1: { backgroundColor: 'red'				},
		slot2: { backgroundColor: '#eedd00'		}
	});

	return (
		<View style={styles.parent}>
			<Text style={[styles.text, styles[turn === 1 ? 'red' : 'yellow']]}>{gameState === 'active' ? `${turn === 1 ? 'Red' : 'Yellow'} to move` : 'Game over'}</Text>
			<Board board={board} makeMove={column => makeMove(column, turn)}/>
			<View style={styles.buttonContainer}>
				<Button style={styles.button} title="Reset Board" onPress={() => resetBoard()}></Button>
			<Button style={styles.button} title="Undo Move" onPress={() => undoMove()}></Button>
			</View>
		</View>
	);
}