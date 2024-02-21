import React from 'react';
import { StyleSheet, Text, View, StatusBar, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Buttons from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';

const Onboarding = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../components/images/1b.jpg')} 
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{ flex: 2 }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent:'center', alignItems:'center', marginTop:300 }}>
          <Buttons colorbtn="#b5d5ba" colortxt="white" btn_text="LOGIN" on_press={() => navigation.navigate('Login')} />
          <Buttons colorbtn="#d97b3d" colortxt="white" btn_text="SIGNUP" on_press={() => navigation.navigate('Sign')} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center', 
    backgroundColor: 'transparent', 
  },
});
