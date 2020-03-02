/**
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    backgroundColor: '#0d0d66',
    padding: 10
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
    backgroundColor: '#3333cc',
  },
  slot1: {
    backgroundColor: 'red'
  },
  slot2: {
    backgroundColor: '#eedd00'
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