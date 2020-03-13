import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Btn, TextBtn} from './Btn';
import globalStyles from './globalStyles';
import Player from './Player';
import ThemeBar from './ThemeBar';

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    title: {
        fontSize: 40,
        fontFamily: globalStyles.font.title,
    },
    chooseNewPlayers: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginTop: 20,
    },
    chooseNewPlayersSVG: {
        margin: 10,
    },
    vsText: {
        fontSize: globalStyles.font.medium,
        fontFamily: globalStyles.font.title,
    },
});

export default MenuScreen = ({newGame, continueGame, themeState, lightsState, newGamePlayersState, game, oldPlayers}) => {
    const [theme] = themeState;
    const [players, setPlayers] = newGamePlayersState;
    const nextPlayer = (player) => {
        if (player === 'human') return 'easy';
        if (player === 'easy') return 'medium';
        if (player === 'medium') return 'hard';
        if (player === 'hard') return 'human';
    }
    const togglePlayer = (index) => setPlayers(mode => index === 0 ? [nextPlayer(mode[0]), mode[1]] : [mode[0], nextPlayer(mode[1])]);

    return (
        <View style={styles.view}>
            <ThemeBar themeState={themeState} lightsState={lightsState}/>
            <Text style={{...styles.title, color: globalStyles.themes[theme].accent}}>Connect Four</Text>
            <View style={styles.chooseNewPlayers}>
                <Btn onPress={() => togglePlayer(0)}>
                    <Player style={styles.chooseNewPlayersSVG} type={players[0]} size={150} backgroundColor={globalStyles.themes[theme].boardBackground} color={globalStyles.themes[theme].board[1]}/>
                </Btn>
                <Text style={{...styles.vsText, color: globalStyles.themes[theme].accent}}>:</Text>
                <Btn onPress={() => togglePlayer(1)}>
                    <Player style={styles.chooseNewPlayersSVG} type={players[1]} size={150} backgroundColor={globalStyles.themes[theme].boardBackground} color={globalStyles.themes[theme].board[2]}/>
                </Btn>
            </View>
            <TextBtn size="bigger" title="New game"color={globalStyles.themes[theme].accent} onPress={() => newGame(players)}/>
            {(oldPlayers && game && game.moves.length) ? <TextBtn style={{marginTop: 30}} title={`Resume ${oldPlayers.join(' : ')}`} color={globalStyles.themes[theme].accent} onPress={continueGame}/> : null}
        </View>
    );
}