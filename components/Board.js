/**
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    backgroundColor: '#2d2d99',
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
  slot0: {
    backgroundColor: '#4f4fdd',
  },
  slot1: {
    backgroundColor: '#de1616'
  },
  slot2: {
    backgroundColor: '#eecc22'
  }
});
const Board = ({board, makeMove}) => {
    return (
        <View style={styles.board}>
            {
            board.map((column, columnIndex) => 
                <TouchableWithoutFeedback key={columnIndex} onPress={() => makeMove(columnIndex)}>
                <View style={styles.column}>
                {
                    column.map((slot, slotIndex) => <Text style={[styles.slot, styles['slot' + slot]]} key={'' + columnIndex + slotIndex}></Text>)
                }
                </View>
                </TouchableWithoutFeedback>
            )
            }
        </View>
    );
};

export default Board;