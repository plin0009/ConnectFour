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

export const TextBtn = ({title, backgroundColor="#000000", textColor="#000000", onPress}) => 
	<TouchableOpacity activeOpacity={0.6} onPress={onPress} style={{...styles.button, borderColor: backgroundColor}}>
		<Text style={{...styles.text, color: backgroundColor}}>{title}</Text>
	</TouchableOpacity>

export const Btn = ({children, onPress, disabled}) => 
	<TouchableOpacity style={disabled ? {opacity: 0.2} : {}} disabled={disabled} activeOpacity={0.6} onPress={onPress}>
		{children}
	</TouchableOpacity>