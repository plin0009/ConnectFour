import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native';
import {TextBtn, Btn} from './Btn';
import Board from './Board';

import {BackSVG, EyeSVG, UndoSVG, ResetSVG, MoonSVG, CircleSVG} from './SVGs';

import globalStyles from './globalStyles';

const styles = StyleSheet.create({
	parent: {
		alignItems: 'center',
		alignSelf: 'stretch',
	},
	topBar: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		margin: 20,
	},
	text: {
		fontSize: globalStyles.font.big,
		fontFamily: globalStyles.font.primary,
		margin: 10,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginVertical: 15,
		alignSelf: 'stretch',
		justifyContent: 'space-evenly',
	},
	playerContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		marginVertical: 15
	},
	player: {
		opacity: 0.7,
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
		fontFamily: globalStyles.font.primary,
	},
	playerWins: {
		textAlign: 'center',
		fontSize: 14,
		fontFamily: globalStyles.font.secondary,
	},
	SVG: {
		width: 32,
		height: 32,
		margin: 8,
	},
	bigButtonSVG: {
		width: 50,
		height: 50,
	},/* 
	selectedTheme: {
		width: 40,
		height: 40,
		margin: 4
	}, */
});

export default MatchScreen = ({toMenu, themeState, lightsState}) => {
	const [theme, setTheme] = themeState;
	const [lights, toggleLights] = lightsState;

	const [showSettings, setShowSettings] = useState(false);
	const toggleShowSettings = () => setShowSettings(showSettings => !showSettings);

	const [board, setBoard] = useState([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]);
	const [gameState, setGameState] = useState('active');
	const [moves, setMoves] = useState([]);
	const [players, setPlayers] = useState([{name: 'Player 1', wins: 0},{name: 'Player 2', wins: 0}]);

	useEffect(() => {
		checkGameState();
	}, [moves]);
	
	const makeMove = (column) => {
		if (gameState !== 'active') {
			return;	// game is not in progress (paused, finished, etc.)
		}
		for (let i = board[column].length - 1; i >= 0; i--) {
			if (!board[column][i]) {
				setBoard(prevBoard => {
					prevBoard[column][i] = moves.length % 2 + 1;
					return [...prevBoard];
				});
				setMoves([...moves, [column, i]]);	// useEffect hook checks game state after every move change
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

	const resetBoard = () => {
		setBoard([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]);
		// setTurn(1);
		setMoves([]);
		setGameState('active');
	}
	
	const undoMove = () => {
		setMoves(moves => {
			if (moves.length > 0) {
				const lastMove = moves.pop();
				setBoard(prevBoard => {
					prevBoard[lastMove[0]][lastMove[1]] = 0;
					return [...prevBoard];
				});
				//gameState === 'active' && switchTurns();
				setGameState('active');
			}
			return moves;
		})

	}

	const choiceAlert = ({title, message, ok}) => {
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
		if (moves.length) {
			return choiceAlert({
				title: 'Undo move',
				message: 'Take back a move?',
				ok: undoMove
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
			<View style={styles.topBar}>
				<Btn onPress={toMenu}>
					<BackSVG style={styles.SVG} fill={globalStyles.themes[theme].accent}/>
				</Btn>
				{showSettings ? <>
				<Btn onPress={() => setTheme('default')}>
					<CircleSVG style={styles.SVG} selected={theme === 'default'} fill={globalStyles.themes.default.accent}/>
				</Btn>
				<Btn onPress={() => setTheme('orange')}>
					<CircleSVG style={styles.SVG} selected={theme === 'orange'} fill={globalStyles.themes.orange.accent}/>
				</Btn>
				<Btn onPress={() => setTheme('grayscale')}>
					<CircleSVG style={styles.SVG} selected={theme === 'grayscale'} fill={globalStyles.themes.grayscale.accent}/>
				</Btn>
				<Btn onPress={toggleLights}>
					<MoonSVG style={styles.SVG} fill={globalStyles.lights[!lights]}/>
				</Btn>
				</> : null}
				<Btn onPress={toggleShowSettings}>
					<EyeSVG style={styles.SVG} selected={showSettings} fill={globalStyles.themes[theme].accent}/>
				</Btn>
			</View>
			{/* <View style={styles.playerContainer}>
				<View style={[styles.player, styles.red, (moves.length % 2 === 0 && gameState === 'active') ? styles.playerTurn : undefined]}>
					<Text style={styles.playerName}>{players[0].name}</Text>
					<Text style={styles.playerWins}>Wins: {players[0].wins}</Text>
				</View>
				<View style={[styles.player, styles.yellow, (moves.length % 2 === 1 && gameState === 'active') ? styles.playerTurn : undefined]}>
					<Text style={styles.playerName}>{players[1].name}</Text>
					<Text style={styles.playerWins}>Wins: {players[1].wins}</Text>
				</View>
			</View> */}
			<Board board={board} makeMove={makeMove} theme={theme}/>
			<View style={styles.buttonContainer}>
				<Btn onPress={confirmUndoMove} disabled={moves.length === 0}>
					<UndoSVG style={[styles.SVG, styles.bigButtonSVG]} fill={globalStyles.themes[theme].accent}/>
				</Btn>
				<Btn onPress={confirmResetBoard} disabled={moves.length === 0}>
					<ResetSVG style={[styles.SVG, styles.bigButtonSVG]} fill={globalStyles.themes[theme].accent}/>
				</Btn>
			</View>
		</View>
	);
}