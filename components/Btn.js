import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import globalStyles from './globalStyles';

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#cccccc',
        margin: 5,
    },
    default: {
        backgroundColor: '#999999',
    },
    primary: {
        backgroundColor: globalStyles.colors.yellow,
    },
    secondary: {
        backgroundColor: '#ddbb77',
    },
    text: {
        fontFamily: globalStyles.font.primary,
        fontSize: globalStyles.font.medium,
    },
});

export default Btn = ({title, backgroundColor="default", textStyles = [], onPress}) => 
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={[styles.button, styles[backgroundColor]]}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>