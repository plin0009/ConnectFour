/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MenuScreen from './components/MenuScreen';
import MatchScreen from './components/MatchScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    fontFamily: 'Nunito'
  },
});
const App = () => {
  const [screen, setScreen] = useState('menu');
  return (
    <View style={styles.view}>
      {screen === 'menu' && <MenuScreen toMatch={() => setScreen('match')}/>}
      {screen === 'match' && <MatchScreen toMenu={() => setScreen('menu')}/>}
    </View>
  );
};

export default App;