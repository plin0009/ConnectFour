import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import globalStyles from './globalStyles';

const styles = StyleSheet.create({
    button: {
        padding: 15,
        paddingHorizontal: 20,
        borderWidth: 4,
        borderRadius: 10,
        alignItems: 'center',
        margin: 5,
    },
    text: {
        fontFamily: globalStyles.font.title,
        fontSize: globalStyles.font.medium,
    },
});

export const TextBtn = ({title, color="#000000", onPress, disabled, children, style, size = 'medium'}) => 
	<TouchableOpacity style={{...styles.button, ...style, borderColor: color, opacity: disabled ? 0.2 : 1}} disabled={disabled} activeOpacity={0.6} onPress={onPress}>
        {children}
		<Text style={{...styles.text, fontSize: globalStyles.font[size], color: color}}>{title}</Text>
	</TouchableOpacity>

export const Btn = ({children, onPress, disabled}) => 
	<TouchableOpacity style={disabled ? {opacity: 0.2} : {}} disabled={disabled} activeOpacity={0.6} onPress={onPress}>
		{children}
	</TouchableOpacity>