import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React from 'react'



interface MediumFontTextProps {
    textstyle: TextStyle
    data: string
}

export const MediumFontText = ({ textstyle, data }: MediumFontTextProps) => {
    return (
        <Text style={[textstyle, {}]}>{data} </Text>
    )
}  