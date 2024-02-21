import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import * as Font from 'expo-font'


const SupportScreen = () => {
  const navigation = useNavigation();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        Vivan: require('../assets/fonts/VinaSans-Regular.ttf'),
        Kdam: require('../assets/fonts/KdamThmorPro-Regular.ttf'),
        Bunge: require('../assets/fonts/BungeeShade-Regular.ttf'),
        Kanit: require('../assets/fonts/Kanit-Regular.ttf'),
      })
    }

    loadFont()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Support',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Kanit',
      },
      headerStyle: {
        backgroundColor: '#0b1b32',
        height: 90,
        borderBottomColor: 'transparent',
        shadowColor: 'transparent',
      },
      headerLeft: () => (
        <Pressable
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate('Profile')}
        >
          <MaterialIcons name='arrow-back' size={24} color='white' />
        </Pressable>
      ),
    })
  }, [navigation])

  const questions = [
    "Contact us",
    "Having a complaint regarding hostel Owner",
    "Could not find your City",
    "Have idea of some Improvement",
    "Facing issue in rendering",
    "Rate Us on App"
  ];

  const answers = [
    "Email us at @cuilahore.edu.pk",
    "Please fill up the form in HostelInfo, we will look into this",
    "Let us know in the feedback, We will surely start working there soon",
    "Please fill the feedback form. Your idea is much appreciated",
    "Please reload the App, Thank you",
    "You will see rating Pop Up soon"
  ];

  const handleQuestionPress = (index) => {
    setSelectedQuestion(index);
    setChatHistory([
      ...chatHistory,
      { type: "question", text: questions[index] },
      { type: "answer", text: answers[index] },
    ]);
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContentContainer}
      >
        {chatHistory.map((item, index) => (
          <View
            key={index}
            style={[
              styles.bubble,
              item.type === "question" && styles.questionBubble,
              item.type === "answer" && styles.answerBubble,
            ]}
          >
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.questionsContainer}>
        {questions.map((text, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.questionBubble,
              selectedQuestion === index && styles.selectedQuestionBubble,
            ]}
            onPress={() => handleQuestionPress(index)}
          >
            <Text style={styles.bubbleText}>{text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  chatContainer: {
    flex: 0.8,
    width: "100%",
    marginTop: 20,
    padding:10
  },
  chatContentContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  questionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    backgroundColor:'#8eaad4',
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    padding:10
  },

  bubble: {
    backgroundColor: "lightblue",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
    maxWidth: "80%", 
  },
  questionBubble: {
    backgroundColor: "lightblue",
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  selectedQuestionBubble: {
    backgroundColor: "green",
  },
  answerBubble: {
    backgroundColor: "lightgreen",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  bubbleText: {
    fontSize: 16,
    color: "black",
    fontFamily:'Kanit',
    fontWeight:'400'
  },
});

export default SupportScreen;
