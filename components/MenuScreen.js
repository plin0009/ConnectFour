import React from 'react';
import {View, Button } from 'react-native';

export default MenuScreen = ({toMatch}) => {
    return (
        <View>
            <Button title="Start match" onPress={toMatch}/>
        </View>
    );
}