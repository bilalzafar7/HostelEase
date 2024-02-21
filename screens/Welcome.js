import React, { useEffect, useRef } from 'react';
import { View, StatusBar, Image, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Splash = () => {
  const navigation = useNavigation();
  const gradientColors = ['orange', 'red'];
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 1000);

    const animateGradient = () => {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000, // Adjust the duration as needed
          useNativeDriver: false,
        })
      ).start();
    };

    animateGradient();

    return () => {
      clearTimeout(timer);
    };
  }, [animatedValue, navigation]);


  const interpolatedColors = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: gradientColors,
  });

  return (
    <LinearGradient
      colors={[gradientColors[0], gradientColors[1]]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <StatusBar barStyle="light-content" hidden={false} backgroundColor={gradientColors[0]} />
      <Image source={require('../components/images/bunk.png')} style={{ width: 130, height: 130, marginBottom: 20 }} />
      <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold' }}>
        Welcome to{' '}
        <Text style={{ fontSize: 35, color: 'yellow', fontWeight: 'bold' }}>Hostel Ease</Text>
      </Text>
    </LinearGradient>
  );
};

export default Splash;
