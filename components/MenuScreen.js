import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Btn from './Btn';

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        color: '#dd0000',
        fontSize: 40,
        fontFamily: 'Anton-Regular',
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