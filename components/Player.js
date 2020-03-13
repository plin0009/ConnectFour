import React from 'react';
import { HumanSVG, BotSVG } from './SVGs';

export default Player = ({type, backgroundColor, color, size, opacity = 'ff', style}) => {
    const basicStyle = {
        width: size,
        height: size,
        borderRadius: size / 10,
        backgroundColor: backgroundColor,
    }
    switch (type) {
        case 'human':
            return <HumanSVG style={{...basicStyle, ...style}} fill={color + opacity}/>
        case 'easy':
            return <BotSVG difficulty="easy" style={{...basicStyle, ...style}} fill={color + opacity}/>
        case 'medium':
            return <BotSVG difficulty="medium" style={{...basicStyle, ...style}} fill={color + opacity}/>
        case 'hard':
            return <BotSVG difficulty="hard" style={{...basicStyle, ...style}} fill={color + opacity}/>
                
        default:
            break;
    }
}