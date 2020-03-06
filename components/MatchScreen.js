import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import Btn from './Btn';
import Board from './Board';

import globalStyles from './globalStyles';

const styles = StyleSheet.create({
	parent: {
		alignItems: 'center'
	},
	text: {
		fontSize: globalStyles.font.big,
		fontFamily: globalStyles.font.primary,
		margin: 10,
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
	red: { backgroundColor: globalStyles.colors.red				},
	yellow: { backgroundColor: globalStyles.colors.yellow		},
	playerContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		marginVertical: 15
	},
	player: {
		opacity: 0.7,
		backgroundColor: globalStyles.colors.darkBlue,
		padding: 10,
		borderRadius: 100,
		borderWidth: 3,
		borderColor: '#00000000',
		width: 150,
	},
	playerTurn: {
		opacity: 1,
		borderColor: '#ffffffff',
	},
	playerName: {
		textAlign: 'center',
		fontSize: 20,
		fontFamily: 'Nunito-Regular',
	},
	playerWins: {
		textAlign: 'center',
		fontSize: 14,
		fontFamily: 'Nunito-Regular',
	},
});

export default MatchScreen = ({toMenu}) => {
	const [board, setBoard] = useState([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]);
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
			if (moves.length % 2 + 1 !== turn)	switchTurns();
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
			if (currentPos[0] < 0 || currentPos[0] >= 7 || currentPos[1] < 0 || currentPos[1] >= 6) break;
			// if the chain stops
			if (board[currentPos[0]][currentPos[1]] !== color) break;
			reverseCount++;
			}
			currentPos = [...lastMove];
			while (true) {
			currentPos[0] += direction[0];  // forward
			currentPos[1] += direction[1];
			// check if out of bounds (todo: replace 7 with constant)
			if (currentPos[0] < 0 || currentPos[0] >= 7 || currentPos[1] < 0 || currentPos[1] >= 6) break;
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
		setBoard([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]);
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
				gameState === 'active' && switchTurns();
				setGameState('active');
			}
			return moves;
		})

	}
	return (
		<View style={styles.parent}>
			<Btn title="Back to menu" onPress={toMenu}/>
			<View style={styles.playerContainer}>
				<View style={[styles.player, styles.red, (turn === 1 && gameState === 'active') ? styles.playerTurn : undefined]}>
					<Text style={styles.playerName}>{players[0].name}</Text>
					<Text style={styles.playerWins}>Wins: {players[0].wins}</Text>
				</View>
				<View style={[styles.player, styles.yellow, (turn === 2 && gameState === 'active') ? styles.playerTurn : undefined]}>
					<Text style={styles.playerName}>{players[1].name}</Text>
					<Text style={styles.playerWins}>Wins: {players[1].wins}</Text>
				</View>
			</View>
			{/* <Text style={[styles.text, styles[turn === 1 ? 'red' : 'yellow']]}>{gameState === 'active' ? `${turn === 1 ? 'Red' : 'Yellow'} to move` : 'Game over'}</Text> */}
			<Board board={board} makeMove={column => makeMove(column, turn)}/>
			<View style={styles.buttonContainer}>
				<Btn backgroundColor="primary" title="Reset Board" onPress={() => resetBoard()}/>
				<Btn backgroundColor="secondary" title="Undo Move" onPress={() => undoMove()}/>
			</View>
		</View>
	);
}