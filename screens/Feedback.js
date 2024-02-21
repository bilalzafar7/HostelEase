import React, { useLayoutEffect, useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from "../Firebase";
import { useUserContext } from "../UserContext";
import { doc, getDoc } from "firebase/firestore";
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, } from 'firebase/firestore';
import { MaterialIcons } from "@expo/vector-icons";

const Feedback = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [complaint, setComplaint] = useState('');
    const { userId } = useUserContext();
    const [userData, setUserData] = useState(null);
    useEffect(() => {
      fetchUserData();
    }, []);
  
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserData(userData);
        } else {
          alert("User document not found");
        }
      } catch (error) {
        alert("Error fetching user data:", error);
      }
    };
  
    const handleSubmit = async () => {
      if (complaint.trim() === '') {
        alert('Please enter your feedback.');
      } else {
        try {
          const complaintsRef = collection(db, 'feedbacks');
          await addDoc(complaintsRef, {
            text: complaint,
            userId: userId,
          });
    
          alert('Thanks for your Feedback');
          setComplaint('');
    
          navigation.goBack(); 
        } catch (error) {
          alert('Failed to submit Feedback. Please try again.');
        }
      }
    };
    
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: "Feedback",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "white",
        },
        headerStyle: {
          backgroundColor: "#0b1b32",
          height: 90,
          borderBottomColor: "transparent",
          shadowColor: "transparent",
        },
        headerLeft: () => (
          <Pressable
            style={{ marginLeft: 10 }}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
        ),
      });
    }, [navigation]);
  
      
  
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Submit a Feedback</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your feedback here. Your feedback is appreciated"
          multiline
          numberOfLines={10}
          value={complaint}
          onChangeText={(text) => setComplaint(text)}
        />
        <View style={styles.userBtnWrapper}>
              <TouchableOpacity style={styles.userBtn} onPress={handleSubmit} >
                <Text style={styles.userBtnTxt}>Submit</Text>
              </TouchableOpacity>
            </View>
      </View>
    )
  }

export default Feedback
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    input: {
      borderWidth: 2,
      borderColor: '#0b1b32',
      borderRadius: 8,
      padding: 19,
      marginBottom: 16,
    },
    userBtnWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 13,
      },
      userBtn: {
        backgroundColor: "#0b1b32",
        borderWidth: 4,
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginHorizontal: 5,
      },
      userBtnTxt: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
      },
  });
  