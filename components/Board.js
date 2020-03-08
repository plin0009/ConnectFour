/**
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import globalStyles from './globalStyles';

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 10,
  },
  column: {
    flexDirection: 'column'
  },
  slot: {
    margin: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
const Board = ({board, makeMove, theme}) => {
    return (
        <View style={{...styles.board, backgroundColor: globalStyles.themes[theme].boardBackground}}>
            {
            board.map((column, columnIndex) => 
                <TouchableWithoutFeedback key={columnIndex} onPress={() => makeMove(columnIndex)}>
                <View style={styles.column}>
                {
                    column.map((slot, slotIndex) => <Text style={/* [styles.slot, styles['slot' + slot]] */{
											...styles.slot,
											backgroundColor: globalStyles.themes[theme].board[slot]
										}} key={'' + columnIndex + slotIndex}></Text>)
                }
                </View>
                </TouchableWithoutFeedback>
            )
            }
        </View>
    );
};

export default Board;