/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MenuScreen from './components/MenuScreen';
import MatchScreen from './components/MatchScreen';

import globalStyles from './components/globalStyles';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
});
const App = () => {
  const [screen, setScreen] = useState('menu');
  const themeState = useState('default');
  const [lights, setLights] = useState(true);
  const playersState = useState(['local', 'local']);

  const toggleLights = () => setLights(lights => !lights);

  return (
    <View style={{...styles.view, backgroundColor: globalStyles.lights[lights]}}>
      {screen === 'menu' && <MenuScreen themeState={themeState} lightsState={[lights, toggleLights]} playersState={playersState} toMatch={() => setScreen('match')}/>}
      {screen === 'match' && <MatchScreen themeState={themeState} lightsState={[lights, toggleLights]} playersState={playersState} toMenu={() => setScreen('menu')}/>}
    </View>
  );
};

export default App;