/**
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, Button, TouchableWithoutFeedback} from 'react-native';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212'
  },
  text: {
    fontSize: 30,
    margin: 10
  },
  red: {
    color: 'red'
  },
  yellow: {
    color: '#eedd00'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 15
  },
  button: {
    fontSize: 50
  },
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
class App extends React.Component {

  constructor() {
    super();
    this.state = {
      board: [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
      turn: 1,
      moves: [],
      gameState: 'active'
    }
  }

  addToBoard(column, turn) {
    if (this.state.gameState !== 'active') {
      return;
    }
    for (let i = this.state.board[column].length - 1; i >= 0; i--) {
      if (!this.state.board[column][i]) {
        this.setState(
          state => {
            state.board[column][i] = turn;
            state.moves.push([column, i]);
            return state;
          }, () => this.checkGameState()
        );
        return;
      }
    }
  }

  checkGameState() {
    const evaluation = this.evaluateBoard();
    if (evaluation) {
      this.setState({
        gameState: 'win'
      });
      return;
    }
    this.switchTurns();
  }

  switchTurns() {
    this.setState(state => {  
      state.turn = state.turn === 1 ? 2 : 1;
      return state;
    });
  }

  resetBoard() {
    this.setState({
      board: [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
      turn: 1,
      moves: [],
      gameState: 'active'
    })
  }

  undoMove() {
    this.setState(state => {
      if (state.moves.length) {
        const lastMove = state.moves.pop();
        state.board[lastMove[0]][lastMove[1]] = 0;
        state.turn = state.turn === 1 ? 2 : 1;
        state.gameState = 'active';
        return state;
      }
    })
  }

  evaluateBoard() {
    // use last move
    if (this.state.moves.length) {
      const lastMove = this.state.moves[this.state.moves.length - 1];
      const color = this.state.board[lastMove[0]][lastMove[1]];
      const directions = [[0,1],[1,0],[1,1],[1,-1]];
      for (let direction of directions) {
        let reverseCount = 0;
        let forwardCount = 0;
        let currentPos = [...lastMove];
        while (true) {
          currentPos[0] -= direction[0];  // reverse
          currentPos[1] -= direction[1];
          // check if out of bounds (todo: replace 7 with constant)
          if (currentPos[0] < 0 || currentPos[0] >= 7) break;
          if (currentPos[1] < 0 || currentPos[1] >= 7) break;
          // if the chain stops
          if (this.state.board[currentPos[0]][currentPos[1]] !== color) break;
          reverseCount++;
        }
        currentPos = [...lastMove];
        while (true) {
          currentPos[0] += direction[0];  // forward
          currentPos[1] += direction[1];
          // check if out of bounds (todo: replace 7 with constant)
          if (currentPos[0] < 0 || currentPos[0] >= 7 || currentPos[1] < 0 || currentPos[1] >= 7) break;
          // if the chain stops
          if (this.state.board[currentPos[0]][currentPos[1]] !== color) break;
          forwardCount++;
        }
        if (reverseCount + 1 + forwardCount >= 4) {
          return color; // win
        }
      }
    }
    return 0;
  }

  render() {
    return (
      <View style={styles.view}>
        <Text style={[styles.text, styles[this.state.turn === 1 ? 'red' : 'yellow']]}>{this.state.gameState === 'active' ? `${this.state.turn === 1 ? 'Red' : 'Yellow'} to move` : 'Game over'}</Text>
        <View style={styles.board}>
          {
            this.state.board.map((column, columnIndex) => 
              <TouchableWithoutFeedback key={columnIndex} onPress={() => this.addToBoard(columnIndex, this.state.turn)}>
                <View style={styles.column}>
                {
                  column.map((slot, slotIndex) => <Text style={[styles.slot, styles['slot' + slot]]} key={'' + columnIndex + slotIndex}></Text>)
                }
                </View>
              </TouchableWithoutFeedback>
            )
          }
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} title="Reset Board" onPress={() => this.resetBoard()}></Button>
          <Button style={styles.button} title="Undo Move" onPress={() => this.undoMove()}></Button>
        </View>
      </View>
    );
  }  
};

export default App;