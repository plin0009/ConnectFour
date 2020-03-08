import React from 'react';
import { HumanSVG, BotSVG } from './SVGs';

export default Player = ({type, backgroundColor, color, size, style}) => {
    const basicStyle = {
        width: size,
        height: size,
        borderRadius: size / 10,
        backgroundColor: backgroundColor,
    }
    switch (type) {
        case 'local':
            return <HumanSVG style={{...basicStyle, ...style}} fill={color}/>
        case 'bot':
            return <BotSVG style={{...basicStyle, ...style}} fill={color}/>
                
        default:
            break;
    }
}