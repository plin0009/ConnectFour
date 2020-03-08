import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import globalStyles from './globalStyles';

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        margin: 5,
    },
    text: {
        fontFamily: globalStyles.font.primary,
        fontSize: globalStyles.font.medium,
    },
});

export const TextBtn = ({title, backgroundColor="#ffffff", textStyles = [], onPress}) => 
	<TouchableOpacity activeOpacity={0.6} onPress={onPress} style={{...styles.button, backgroundColor: backgroundColor}}>
		<Text style={styles.text}>{title}</Text>
	</TouchableOpacity>

export const Btn = ({children, onPress, disabled}) => 
	<TouchableOpacity style={disabled ? {opacity: 0.2} : {}} disabled={disabled} activeOpacity={0.6} onPress={onPress}>
		{children}
	</TouchableOpacity>