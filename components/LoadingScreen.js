import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import globalStyles from './globalStyles';

export default LoadingScreen = () => {
    return (
        <View>
            <ActivityIndicator size="large" color={globalStyles.themes.default.accent}/>
        </View>
    );
}