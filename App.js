/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import LoadingScreen from './components/LoadingScreen';
import MenuScreen from './components/MenuScreen';
import MatchScreen from './components/MatchScreen';

import globalStyles from './components/globalStyles';

import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
});
const App = () => {
  let prevTheme = 'default';
  let prevLights = true;
  let prevGame = {players:['local','local']};
  let prevPlayers = null;
  const getSaved = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      console.log(`loaded theme ${savedTheme}`);
      const savedLights = await AsyncStorage.getItem('lights');
      console.log(`loaded lights ${savedLights}`);
      const savedGame = await AsyncStorage.getItem('game');
      console.log(`loaded game ${savedGame}`);
      const savedPlayers = await AsyncStorage.getItem('players');
      console.log(`loaded players ${savedPlayers}`);
      if (savedTheme !== null) {
        prevTheme = savedTheme;
        setTheme(prevTheme);
      }
      if (savedLights !== null) {
        prevLights = JSON.parse(savedLights);
        setLights(prevLights);
      }
      if (savedGame !== null) {
        prevGame = JSON.parse(savedGame);
        setGame(prevGame);
      }
      if (savedPlayers !== null) {
        prevPlayers = JSON.parse(savedPlayers);
        setPlayers(prevPlayers);
      }
    } catch (e) {
      console.log('error loading theme or lights');
      console.log(e);
    }
    setScreen('menu');
  }
  const saveTheme = async (theme) => {
    setTheme(theme);
    try {
      await AsyncStorage.setItem('theme', theme);
      console.log(`set theme ${theme}`)
    } catch (e) {
      console.log('could not save theme');
      console.log(e);
    }
  }
  const toggleAndSaveLights = async () => {
    setLights(lights => {
      try {
        AsyncStorage.setItem('lights', JSON.stringify(!lights));
        console.log(`set lights ${JSON.stringify(!lights)}`)
      } catch (e) {
        console.log('could not save lights');
        console.log(e);
      }
      return !lights;
    });
  }

  const saveGame = async (board, moves) => {
    const savedGame = {board, moves};
    setGame(savedGame);
    try {
      await AsyncStorage.setItem('game', JSON.stringify(savedGame));
      console.log(JSON.stringify(savedGame));
    } catch (e) {
      console.log('could not save game');
      console.log(e);
    }
  }

  const discardGame = async () => {
    setGame({board:[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]], moves:[]});
    setPlayers(null);
    try {
      await AsyncStorage.removeItem('game');
      await AsyncStorage.removeItem('players');
      console.log('discarded game?');
    } catch (e) {
      console.log('could not discard game');
      console.log(e);
    }
  }
  const restoreGame = async (board, moves, players) => {
    const savedGame = {board, moves};
    setGame(savedGame);
    setPlayers(players);
    try {
      await AsyncStorage.setItem('players', JSON.stringify(players));
      console.log('saved players');
      await AsyncStorage.setItem('game', JSON.stringify(savedGame));
      console.log(JSON.stringify(savedGame));
    } catch (e) {
      console.log('could not restore game');
      console.log(e);
    }
  }

  const saveNewPlayers = async () => {
    setPlayers(newGamePlayers);
    try {
      await AsyncStorage.setItem('players', JSON.stringify(newGamePlayers));
      console.log(players);
    } catch (e) {
      console.log('could not save players');
    }
  }

  const newGame = async () => {
    //await saveGame([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],[],players);
    //setBoard()
    await discardGame();
    await saveNewPlayers();

    setScreen('match');
  }
  const continueGame = () => {
    // await saveGame([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],[],players);
    //setBoard()
    setScreen('match');
  }

  // get all saved items
  useEffect(() => {
    getSaved();
  }, []);

  const [screen, setScreen] = useState('loading');
  const [theme, setTheme] = useState(prevTheme);
  const [lights, setLights] = useState(prevLights);
  const [newGamePlayers, setNewGamePlayers] = useState(['human', 'human']);
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState(null);

  // current game stuff (default is new game)
  /* const [board, setBoard] = useState([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]);
  const [moves, setMoves] = useState([]);
  const [players, setPlayers] = useState(['local', 'local']);
  const [gameState, setGameState] = useState('active'); */
  
  const themeState = [theme, saveTheme];
  const lightsState = [lights, toggleAndSaveLights];


  return (
    <View style={{...styles.view, backgroundColor: globalStyles.lights[lights]}}>
      {screen === 'loading' && <LoadingScreen/>}
      {screen === 'menu' && 
        <MenuScreen
          themeState={themeState} lightsState={lightsState}
          newGamePlayersState={[newGamePlayers, setNewGamePlayers]}
          newGame={newGame}
          continueGame={continueGame}
          game={game}
          oldPlayers={players}
        />
      }
      {screen === 'match' && 
        <MatchScreen
          themeState={themeState} lightsState={lightsState}
          toMenu={() => setScreen('menu')}
          game={game}
          oldPlayers={players}
          saveGame={saveGame}
          restoreGame={restoreGame}
          discardGame={discardGame}
        />
      }
    </View>
  );
};

export default App;