import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import * as Font from "expo-font";


const ChatScreen = () => {
  const route = useRoute();
  const { city, hostelId, roomId, currentUserName, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        Vivan: require("../assets/fonts/VinaSans-Regular.ttf"),
        Kdam: require("../assets/fonts/KdamThmorPro-Regular.ttf"),
        Bunge: require("../assets/fonts/BungeeShade-Regular.ttf"),
        Kanit: require("../assets/fonts/Kanit-Regular.ttf"),
      });
    };

    loadFont();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [city, hostelId, roomId]);

  const fetchMessages = async () => {
    try {
      const chatQuery = query(
        collection(db, "chats"),
        where("city", "==", city),
        where("hostelId", "==", hostelId),
        where("roomId", "==", roomId)
      );

      const chatSnapshot = await getDocs(chatQuery);

      if (!chatSnapshot.empty) {
        const chatDoc = chatSnapshot.docs[0];
        const messagesCollectionRef = collection(chatDoc.ref, "messages");
        const messagesQuery = query(
          messagesCollectionRef,
          orderBy("timestamp", "desc")
        );

        const messagesSnapshot = await getDocs(messagesQuery);

        const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
        setMessages(messagesData);
      }
    } catch (error) {
      alert("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
        if (!newMessage.trim()) {
            return; 
          }

      const existingChatQuery = query(
        collection(db, "chats"),
        where("city", "==", city),
        where("hostelId", "==", hostelId),
        where("roomId", "==", roomId)
      );

      const existingChatSnapshot = await getDocs(existingChatQuery);

      if (existingChatSnapshot.empty) {
        const chatData = {
          city,
          hostelId,
          roomId,
          members: [userId],
        };

        const chatDocRef = await addDoc(collection(db, "chats"), chatData);

        await addDoc(collection(chatDocRef, "messages"), {
          sender: currentUserName,
          text: newMessage,
          timestamp: serverTimestamp(),
        });
      } else {
        const chatDocSnapshot = existingChatSnapshot.docs[0];

        const messagesCollectionRef = collection(
          chatDocSnapshot.ref,
          "messages"
        );
        await addDoc(messagesCollectionRef, {
          sender: currentUserName,
          text: newMessage,
          timestamp: serverTimestamp(),
        });
      }

      setNewMessage("");
      fetchMessages();
    } catch (error) {
      alert("Error sending message:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        inverted 
        renderItem={({ item }) => (
          <View
            style={{
              alignItems:
                item.sender === currentUserName ? "flex-end" : "flex-start",
              margin: 10,
              marginHorizontal:10
            }}
          >
            <View
              style={{
                backgroundColor:
                  item.sender === currentUserName ? "#5fb36b" : "#E5E5E5",
                borderRadius: 10,
                padding: 10,
                paddingHorizontal:10
              }}
            >
              <Text style={{fontFamily:'Kanit', fontSize:15}}>{item.text}</Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily:'Kanit',
                color: "gray",
                textAlign: item.sender === currentUserName ? "right" : "left",
              }}
            >
              {item.sender}
            </Text>
          </View>
        )}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor:'orange',
          padding: 6,
          borderTopLeftRadius:10,
          borderTopRightRadius:10
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: 50,
            borderColor: "#c90644",
            backgroundColor:'white',
            borderWidth: 3,
            borderRadius:10,
            marginHorizontal: 10,
            padding: 15,
            marginVertical:10
          }}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={{backgroundColor:'#c90644',borderRadius:5,paddingHorizontal:11, paddingVertical:8}} onPress={handleSendMessage}>
          <Text style={{ color: "white", fontFamily:'Kdam' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
