import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native';
import {TextBtn, Btn} from './Btn';
import Board from './Board';

import {BackSVG, EyeSVG, UndoSVG, ResetSVG, MoonSVG, CircleSVG, HumanSVG, BotSVG} from './SVGs';

import globalStyles from './globalStyles';

import Bot from '../bot/Bots';

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
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginHorizontal: 20,
		marginVertical: 15,
	},
	player: {
		width: 64,
		height: 64,
		borderRadius: 6.4,
	},
	SVG: {
		width: 32,
		height: 32,
		margin: 8,
	},
	bigButtonSVG: {
		width: 50,
		height: 50,
	},
});

export default MatchScreen = ({toMenu, themeState, lightsState, playersState}) => {
	const [theme, setTheme] = themeState;
	const [lights, toggleLights] = lightsState;

	const [showSettings, setShowSettings] = useState(false);
	const toggleShowSettings = () => setShowSettings(showSettings => !showSettings);

	const [board, setBoard] = useState([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]);
	const [gameState, setGameState] = useState('active');
	const [moves, setMoves] = useState([]);
	const [undidMove, setUndidMove] = useState([]);
	const [players, setPlayers] = playersState;
	
	useEffect(() => {
		// get player to make a move
		// it's players[moves.length % 2]'s turn

		if (players[moves.length % 2] === 'local') {
			return;	// player moves by pressing
		}
		console.log('bot move incoming')
		const timer = Bot.bestMove(board, moves.length % 2 + 1, makeMove);
		//const timer = setTimeout(() => makeMove(2), 2000);
		return () => {
			clearTimeout(timer);
		}
	}, [moves, undidMove]);
	
	const makeMove = (column) => {
		if (gameState !== 'active') {
			console.log(gameState);
			return false;	// game is not in progress (paused, finished, etc.)
		}
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
			if (evaluation !== 0) {
				setGameState('win');
				return;
			}
		}
	}

	const evaluateBoard = (newBoard, lastMove) => {
		// use last move
		if (moves.length) {
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
					return color; // win
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
		setMoves(moves => {
			if (moves.length > 0) {
				const lastMove = moves.pop();
				setBoard(prevBoard => {
					prevBoard[lastMove[0]][lastMove[1]] = 0;
					return [...prevBoard];
				});
				//gameState === 'active' && switchTurns();
				setGameState('active');
				setUndidMove(lastMove);
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
			<View style={styles.playerContainer}>
				<Player type={players[0]} size={(gameState === 'active' && moves.length % 2 === 1) ? 48 : 64} backgroundColor={globalStyles.themes[theme].boardBackground} color={globalStyles.themes[theme].board[1]}/>
				<Player type={players[1]} size={(gameState === 'active' && moves.length % 2 === 0) ? 48 : 64} backgroundColor={globalStyles.themes[theme].boardBackground} color={globalStyles.themes[theme].board[2]}/>
			</View>
			<Board board={board} makeMove={makeMove} lastMove={moves.length > 0 ? moves[moves.length - 1] : []} undidMove={undidMove} theme={theme} playerCanMove={gameState === 'active' && players[moves.length % 2] === 'local'}/>
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