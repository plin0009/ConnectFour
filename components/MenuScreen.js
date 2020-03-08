import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Btn, TextBtn} from './Btn';
import {BackSVG, CircleSVG, MoonSVG, EyeSVG} from './SVGs';
import globalStyles from './globalStyles';

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
});

export default MenuScreen = ({toMatch, themeState, lightsState}) => {
    const [theme, setTheme] = themeState;
    const [lights, toggleLights] = lightsState;

    const [showSettings, setShowSettings] = useState(false);
    const toggleShowSettings = () => setShowSettings(showSettings => !showSettings);

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
            <TextBtn title="Two-player" backgroundColor={globalStyles.themes[theme].accent} onPress={toMatch} theme={theme}/>
            <TextBtn title="Play against AI" backgroundColor={globalStyles.themes[theme].accent} onPress={toMatch} theme={theme}/>
        </View>
    );
}