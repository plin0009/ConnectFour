import React, {useState, useEffect} from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { TextBtn, Btn } from './Btn';
import Board from './Board';

import { UndoSVG, ResetSVG } from './SVGs';
import ThemeBar from './ThemeBar';

import globalStyles from './globalStyles';

import Bot from '../bot/Bots';
const styles = StyleSheet.create({
	parent: {
		alignItems: 'center',
		alignSelf: 'stretch',
	},
	playerContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 4,
		marginVertical: 6,
		paddingHorizontal: 50,
	},
	player: {
		width: 64,
		height: 64,
		borderRadius: 6.4,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginVertical: 6,
		alignSelf: 'stretch',
		justifyContent: 'space-evenly',
	},
	bigButtonSVG: {
		width: 40,
		height: 40,
		margin: 8,
	},
	endText: {
		fontFamily: globalStyles.font.title,
		fontSize: globalStyles.font.medium,
	}
});

export default MatchScreen = ({toMenu, themeState, lightsState, saveGame, discardGame, restoreGame, game, oldPlayers}) => {
	const [theme] = themeState;
	const [lights] = lightsState;

	const [board, setBoard] = useState(game.board);
	const [moves, setMoves] = useState(game.moves);
	const [players, setPlayers] = useState(oldPlayers);
	const [gameState, setGameState] = useState('active');
	const [undidMove, setUndidMove] = useState([]);
	//const [gameState, setGameState] = gameStateState;
	//const [moves, setMoves] = movesState;
	//const [players, setPlayers] = playersState;

	useEffect(() => {
		console.log('hook on gameState change');
		if (gameState === 'active') {
			restoreGame(board, moves, players);
			return;
		}
		discardGame();
	}, [gameState]);
	
	useEffect(() => {
		console.log('hook on move/undid move change');
		// save game
		// console.log('saving game')
		saveGame(board, moves);
		// get player to make a move
		// it's players[moves.length % 2]'s turn
		const currentPlayer = players[moves.length % 2];
		if (currentPlayer === 'human') {
			return;	// player moves by pressing
		}
		let difficulty = 1;
		if (currentPlayer === 'easy') {
			difficulty = 4;
		} else if (currentPlayer === 'medium') {
			difficulty = 4;
		} else if (currentPlayer === 'hard') {
			difficulty = 6;
		}
		Bot.bestMove(board, difficulty, moves.length % 2 + 1, makeMove);
		return () => {
			Bot.abort();
		}
	}, [moves, undidMove]);
	
	const makeMove = (column) => {
		if (gameState !== 'active') {
			return false;	// game is not in progress (paused, finished, etc.)
		}
		console.log('making move')
		for (let i = board[column].length - 1; i >= 0; i--) {
			if (!board[column][i]) {
				setBoard(prevBoard => {
					prevBoard[column][i] = moves.length % 2 + 1;
					const newBoard = [...prevBoard];
					setMoves([...moves, [column, i]]);
					checkGameState(newBoard, [column, i]);
					return newBoard;
				});
				return true;
			}
		}
		// invalid move
		return false;
	}

	const checkGameState = (newBoard, lastMove) => {
		if (moves.length && gameState === 'active') {
			const evaluation = evaluateBoard(newBoard, lastMove);
			if (evaluation === 'draw') {
				setGameState('draw');
				discardGame();
				return;
			}
			if (evaluation.win) {
				setGameState(evaluation); // gameState becomes winning array
				discardGame();
				return;
			}
		}
	}

	const evaluateBoard = (newBoard, lastMove) => {
		// use last move
		if (moves.length) {
			if (lastMove[1] === 0) {
				for (let col = 0; col < 7; col++) {
					if (newBoard[col][0] === 0)	break;
					if (col === 6)	return 'draw';
				}
			}

			//const lastMove = moves[moves.length - 1];
			const color = newBoard[lastMove[0]][lastMove[1]];
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
					if (newBoard[currentPos[0]][currentPos[1]] !== color) break;
					reverseCount++;
				}
				currentPos = [...lastMove];
				while (true) {
					currentPos[0] += direction[0];  // forward
					currentPos[1] += direction[1];
					// check if out of bounds (todo: replace 7 with constant)
					if (currentPos[0] < 0 || currentPos[0] >= 7 || currentPos[1] < 0 || currentPos[1] >= 6) break;
					// if the chain stops
					if (newBoard[currentPos[0]][currentPos[1]] !== color) break;
					forwardCount++;
				}
				if (reverseCount + 1 + forwardCount >= 4) {
					// get the pieces
					let winners = [lastMove];
					for (let i = 1; i <= reverseCount; i++) {
						winners.push([lastMove[0] - (i * direction[0]), lastMove[1] - (i * direction[1])]);
					}
					for (let i = 1; i <= forwardCount; i++) {
						winners.push([lastMove[0] + (i * direction[0]), lastMove[1] + (i * direction[1])]);
					}
					return {
						win: color,
						winners
					}; // win
				}
			}
		}
		return 0;
	}

	const resetBoard = () => {
		setBoard([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]);
		setGameState('active');
		setMoves([]);
		setUndidMove(undidMove => undidMove === 'all' ? 'everything' : 'all');	// a different value to trigger useEffect, which clears the board when reset
	}
	
	const undoMove = () => {
		console.log('undoing move!!!');
		setMoves(moves => {
			if (moves.length > 0) {
				const lastMove = moves.pop();
				console.log(lastMove);
				setBoard(prevBoard => {
					prevBoard[lastMove[0]][lastMove[1]] = 0;
					return [...prevBoard];
				});
				setGameState('active');
				setUndidMove(lastMove);
			}
			return moves;
		})

	}

	const choiceAlert = ({title, message, ok}) => {
		console.log('choice alert');
		Alert.alert(
			title, message, [
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					onPress: ok
				}
			]
		)
	}

	const okAlert = ({title, message}) => {
		Alert.alert(title, message)
	}
	const confirmUndoMove = () => {
		console.log('confirm undo');
		if (moves.length) {
			return choiceAlert({
				title: 'Undo move',
				message: 'Take back a move?',
				ok: () => undoMove('from alert')
			});
		}
		return okAlert({title: 'Uh oh', message: 'No moves to take back'})
	}
	const confirmResetBoard = () => {
		if (moves.length) {
			return choiceAlert({
				title: 'Reset board',
				message: 'Start over?',
				ok: resetBoard
			});
		}
	}
	return (
		<View style={styles.parent}>
			<ThemeBar onLeftButton={toMenu} themeState={themeState} lightsState={lightsState}/>
			<View style={styles.playerContainer}>
				<Player type={players[0]} size={(gameState === 'active' ? (moves.length % 2 === 1 ? 48 : 64) : (gameState.win === 1 || gameState === 'draw' ? 64 : 48))} backgroundColor={globalStyles.themes[theme].boardBackground} color={globalStyles.themes[theme].board[1]} opacity={gameState.win === 2 ? 'aa' : 'ff'}/>
				{gameState === 'draw' && <Text style={{...styles.endText, color: globalStyles.themes[theme].accent}}>Draw game</Text>}
				{gameState.win && <Text style={{...styles.endText, color: globalStyles.themes[theme].board[gameState.win]}}>Game over</Text>}
				<Player type={players[1]} size={(gameState === 'active' ? (moves.length % 2 === 0 ? 48 : 64) : (gameState.win === 2 || gameState === 'draw' ? 64 : 48))} backgroundColor={globalStyles.themes[theme].boardBackground} color={globalStyles.themes[theme].board[2]} opacity={gameState.win === 1 ? 'aa' : 'ff'}/>
			</View>
			<Board
				board={board}
				winners={(gameState.win) && gameState.winners}
				makeMove={makeMove}
				lastMove={moves.length > 0 ? moves[moves.length - 1] : []}
				undidMove={undidMove}
				theme={theme}
				lights={lights}
				playerCanMove={gameState === 'active' && players[moves.length % 2] === 'human'}/>
			<View style={styles.buttonContainer}>
				<TextBtn title="Undo" size="small" disabled={moves.length === 0} onPress={undoMove} color={globalStyles.themes[theme].accent}>
					<UndoSVG style={styles.bigButtonSVG} fill={globalStyles.themes[theme].accent}/>
				</TextBtn>
				<TextBtn title="Reset" size="small" disabled={moves.length === 0} onPress={confirmResetBoard} color={globalStyles.themes[theme].accent}>
					<ResetSVG style={styles.bigButtonSVG} fill={globalStyles.themes[theme].accent}/>
				</TextBtn>
			</View>
		</View>
	);
}