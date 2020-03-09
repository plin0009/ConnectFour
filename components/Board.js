/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback, Animated} from 'react-native';
import globalStyles from './globalStyles';
import { BoardSVG } from './SVGs';

const styles = StyleSheet.create({
  board: {
    marginVertical: 10,
  },
  boardSVG: {
    width: 48 * 7 + 20,
    height: 48 * 6 + 20,
  },
  columnContainer: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
    width: 48,
    height: 48 * 6,
    position: 'absolute',
  },
  slot: {
    margin: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
  },
});
const Board = ({board, lastMove, makeMove, theme, undidMove, playerCanMove}) => {
  const [positions] = useState(Array(7).fill().map(col => Array(6).fill().map(() => new Animated.Value(0))));

  useEffect(() => {
    if (lastMove.length > 0) {
      positions[lastMove[0]][lastMove[1]].setValue(0);
      Animated.timing(positions[lastMove[0]][lastMove[1]], {toValue: 1, duration: 500}).start();
    }
  }, [lastMove]);

  useEffect(() => {
    if (undidMove === 'all' || undidMove === 'everything') {
      // set all to zero
      positions.forEach(column => column.forEach(slot => slot.setValue(0)));
      return;
    }
    if (undidMove.length > 0) {
      positions[undidMove[0]][undidMove[1]].setValue(0);
    }
  }, [undidMove])

  return (
      <View style={{...styles.board, backgroundColor: globalStyles.themes[theme].board[0]}}>
        <View style={styles.columnContainer}>
          {board.map((column, columnIndex) => 
            <View key={columnIndex} style={{...styles.column, transform: [{translateX: columnIndex * 48 + 10}, {translateY: 10}]}}>{
                column.map((slot, slotIndex) => 
                  <Animated.View key={'' + columnIndex + slotIndex} style={{
                    ...styles.slot,
                    backgroundColor: globalStyles.themes[theme].board[slot],
                    opacity: positions[columnIndex][slotIndex],
                    transform: [
                      {translateY: positions[columnIndex][slotIndex].interpolate({
                        inputRange: [0,1],
                        outputRange: [48 * slotIndex - 336, 48 * slotIndex],
                      })}
                    ],
                  }}/>
                  )
            }</View>
          )}
        </View>
        <BoardSVG style={styles.boardSVG} fill={globalStyles.themes[theme].boardBackground}/>
        {board.map((column, columnIndex) => 
          <TouchableWithoutFeedback key={columnIndex} onPress={() => makeMove(columnIndex)} disabled={column[0] !== 0 || !playerCanMove}>
            <View style={{...styles.column, transform: [{translateX: columnIndex * 48 + 10}, {translateY: 10}]}}/>
          </TouchableWithoutFeedback>
        )}
      </View>
  );
};

export default Board;