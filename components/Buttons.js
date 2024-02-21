import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'

const Buttons = ({on_press,btn_text, colorbtn, colortxt}) => {
    return (
        <TouchableOpacity style={{justifyContent:'center',width:'30%',backgroundColor:colorbtn,height:50,marginBottom:10,borderRadius:8}} 
        onPress={on_press}
        >
            <Text style={{fontSize:18,fontWeight:'bold',letterSpacing:1.5,textAlign:'center',position:'relative',color:colortxt}} >{btn_text}</Text>


        </TouchableOpacity>
    )
}

export default Buttons

const styles = StyleSheet.create({})