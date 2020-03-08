import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Btn, TextBtn} from './Btn';
import {BackSVG, CircleSVG, MoonSVG, EyeSVG, HumanSVG, BotSVG, GoSVG} from './SVGs';
import globalStyles from './globalStyles';
import Player from './Player';

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        alignSelf: 'stretch',
    },
	topBar: {
		flexDirection: 'row-reverse',
		alignSelf: 'stretch',
        justifyContent: 'space-between',
        margin: 20,
	},
	SVG: {
		width: 32,
		height: 32,
		margin: 8,
	},
    title: {
        //color: globalStyles.themes[theme].red,
        fontSize: 40,
        fontFamily: globalStyles.font.title,
    },
    chooseMode: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    chooseModeSVG: {
        margin: 10,
    },
    vsText: {
        fontSize: globalStyles.font.medium,
        fontFamily: globalStyles.font.title,
    },
    goButton: {
        width: 64,
        height: 64,
    }
});

export default MenuScreen = ({toMatch, themeState, lightsState, playersState}) => {
    const [theme, setTheme] = themeState;
    const [lights, toggleLights] = lightsState;

    const [showSettings, setShowSettings] = useState(false);
    const toggleShowSettings = () => setShowSettings(showSettings => !showSettings);

    const [players, setPlayers] = playersState;
    const togglePlayer = (index) => setPlayers(mode => index === 0 ? [mode[0] === 'local' ? 'bot' : 'local', mode[1]] : [mode[0], mode[1] === 'local' ? 'bot' : 'local']);

    return (
        <View style={styles.view}>
            <View style={styles.topBar}>
                <Btn onPress={toggleShowSettings}>
                    <EyeSVG style={styles.SVG} selected={showSettings} fill={globalStyles.themes[theme].accent}/>
                </Btn>
                {showSettings ? <>
                <Btn onPress={toggleLights}>
                    <MoonSVG style={styles.SVG} fill={globalStyles.lights[!lights]}/>
                </Btn>
                <Btn onPress={() => setTheme('grayscale')}>
                    <CircleSVG style={styles.SVG} selected={theme === 'grayscale'} fill={globalStyles.themes.grayscale.accent}/>
                </Btn>
                <Btn onPress={() => setTheme('orange')}>
                    <CircleSVG style={styles.SVG} selected={theme === 'orange'} fill={globalStyles.themes.orange.accent}/>
                </Btn>
                <Btn onPress={() => setTheme('default')}>
                    <CircleSVG style={styles.SVG} selected={theme === 'default'} fill={globalStyles.themes.default.accent}/>
                </Btn>
                </> : null}
            </View>
            <Text style={{...styles.title, color: globalStyles.themes[theme].accent}}>Connect Four</Text>
            <View style={styles.chooseMode}>
                {/* <HumanSVG style={{...styles.chooseModeSVG, backgroundColor: globalStyles.themes[theme].boardBackground}} fill={globalStyles.themes[theme].board[1]}/> */}
                {/* 
                <Btn onPress={() => toggleMode(0)}>{
                    mode[0] === 'local' ? 
                    <HumanSVG style={{...styles.chooseModeSVG, backgroundColor: globalStyles.themes[theme].boardBackground}} fill={globalStyles.themes[theme].board[1]}/>
                    :
                    <BotSVG style={{...styles.chooseModeSVG, backgroundColor: globalStyles.themes[theme].boardBackground}} fill={globalStyles.themes[theme].board[1]}/>
                }</Btn> */}
                <Btn onPress={() => togglePlayer(0)}>
                    <Player style={styles.chooseModeSVG} type={players[0]} size={150} backgroundColor={globalStyles.themes[theme].boardBackground} color={globalStyles.themes[theme].board[1]}/>
                </Btn>
                <Text style={{...styles.vsText, color: globalStyles.themes[theme].accent}}>:</Text>
                <Btn onPress={() => togglePlayer(1)}>
                    <Player style={styles.chooseModeSVG} type={players[1]} size={150} backgroundColor={globalStyles.themes[theme].boardBackground} color={globalStyles.themes[theme].board[2]}/>
                </Btn>{/* 
                <Btn onPress={() => toggleMode(1)}>{
                    mode[1] === 'local' ? 
                    <HumanSVG style={{...styles.chooseModeSVG, backgroundColor: globalStyles.themes[theme].boardBackground}} fill={globalStyles.themes[theme].board[2]}/>
                    :
                    <BotSVG style={{...styles.chooseModeSVG, backgroundColor: globalStyles.themes[theme].boardBackground}} fill={globalStyles.themes[theme].board[2]}/>
                }</Btn> */}
            </View>
            {/* <Btn onPress={toMatch}>
                <GoSVG style={styles.goButton} fill={globalStyles.themes[theme].accent}/>
            </Btn> */}
            <TextBtn title="Start game" backgroundColor={globalStyles.themes[theme].accent} onPress={toMatch} theme={theme}/>

        </View>
    );
}