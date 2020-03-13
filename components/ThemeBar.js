import React, {useState} from 'react';

import globalStyles from './globalStyles';
import { View, StyleSheet } from 'react-native';

import {BackSVG, CircleSVG, MoonSVG, EyeSVG} from './SVGs';
import {Btn} from './Btn';

const styles = StyleSheet.create({
	topBar: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 6,
	},
	SVG: {
		width: 32,
		height: 32,
		margin: 8,
	},
});

export default ThemeBar = ({onLeftButton, lightsState, themeState}) => {
    const [lights, toggleLights] = lightsState;
    const [theme, setTheme] = themeState;

    const [showTheme, setShowTheme] = useState(false);
    const toggleShowTheme = () => setShowTheme(showingTheme => !showingTheme);
    
    return (
        <View style={styles.topBar}>
            <Btn onPress={onLeftButton}>
                <BackSVG style={styles.SVG} fill={globalStyles.themes[theme].accent}/>
            </Btn>
            {showTheme ? <>
            <Btn onPress={() => setTheme('default')}>
                <CircleSVG style={styles.SVG} selected={theme === 'default'} fill={globalStyles.themes.default.accent}/>
            </Btn>
            <Btn onPress={() => setTheme('orange')}>
                <CircleSVG style={styles.SVG} selected={theme === 'orange'} fill={globalStyles.themes.orange.accent}/>
            </Btn>
            <Btn onPress={() => setTheme('grayscale')}>
                <CircleSVG style={styles.SVG} selected={theme === 'grayscale'} fill={globalStyles.themes.grayscale.accent}/>
            </Btn>
            <Btn onPress={toggleLights}>
                <MoonSVG style={styles.SVG} fill={globalStyles.lights[!lights]}/>
            </Btn>
            </> : null}
            <Btn onPress={toggleShowTheme}>
                <EyeSVG style={styles.SVG} selected={showTheme} fill={globalStyles.themes[theme].accent}/>
            </Btn>
        </View>
    );
}