import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Btn from './Btn';
import globalStyles from './globalStyles';

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        color: globalStyles.colors.red,
        fontSize: 40,
        fontFamily: globalStyles.font.secondary,
    },
});

export default MenuScreen = ({toMatch}) => {
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Connect Four</Text>
            <Btn title="Start match" backgroundColor="primary" onPress={toMatch}/>
        </View>
    );
}