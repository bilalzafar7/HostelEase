import React, { useLayoutEffect, useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
  Button,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { useUserContext } from "../UserContext";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import * as Font from "expo-font";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { signOut, getAuth, updatePassword } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";

const EditDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = useUserContext();
  const [userData, setUserData] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (userData) {
      setEditedFirstName(userData.firstName);
      setEditedLastName(userData.lastName);
      setEditedEmail(userData.email);
      setEditedPhone(userData.phone);
    }
  }, [userData]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "User Details",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        fontFamily: "Kanit",
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
          onPress={() => navigation.navigate("Profile")}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
      ),
    });
  }, [navigation]);

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
    try {
      if (
        editedFirstName !== userData.firstName ||
        editedLastName !== userData.lastName ||
        editedEmail !== userData.userData.email ||
        editedPhone !== userData.phone
      ) {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          firstName: editedFirstName,
          lastName: editedLastName,
          email: editedEmail,
          phone: editedPhone,
        });

        const updatedUserDocSnap = await getDoc(userDocRef);
        if (updatedUserDocSnap.exists()) {
          const updatedUserData = updatedUserDocSnap.data();
          setUserData(updatedUserData);
          setChangesMade(true);
          alert("Updated Successfully");
        }
      }
    } catch (error) {
      alert("Error updating user data:", error);
      // Handle the error as needed
    }
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 20,
      }}
    >
      {userData && (
        <View>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Kanit",
                color: "#333",
                marginBottom: 10,
              }}
            >
              User Profile
            </Text>
          </View>
          <View>
            <Text
              style={{ fontSize: 16, fontFamily: "Kanit", marginBottom: 5 }}
            >
              First Name:
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 10,
                  flex: 1,
                  marginBottom: 10,
                  fontFamily: "Kanit",
                  color: "gray",
                }}
                value={editedFirstName}
                onChangeText={(text) => setEditedFirstName(text)}
              />
            </View>
          </View>

          <View>
            <Text
              style={{ fontSize: 16, fontFamily: "Kanit", marginBottom: 5 }}
            >
              Last Name:
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 10,
                  flex: 1,
                  marginBottom: 10,
                  fontFamily: "Kanit",
                  color: "gray",
                }}
                value={editedLastName}
                onChangeText={(text) => setEditedLastName(text)}
              />
            </View>
          </View>

          <View>
            <Text
              style={{ fontSize: 16, fontFamily: "Kanit", marginBottom: 5 }}
            >
              Email Provided:
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 10,
                  flex: 1,
                  marginBottom: 10,
                  fontFamily: "Kanit",
                  color: "gray",
                }}
                value={editedEmail}
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text
              style={{ fontSize: 16, fontFamily: "Kanit", marginBottom: 5 }}
            >
              Phone:
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 10,
                  flex: 1,
                  marginBottom: 10,
                  fontFamily: "Kanit",
                  color: "gray",
                }}
                value={editedPhone}
                onChangeText={(text) => setEditedPhone(text)}
              />
            </View>
          </View>

          <View>
            {editedFirstName !== userData.firstName ||
            editedLastName !== userData.lastName ||
            editedEmail !== userData.email ||
            editedPhone !== userData.phone ? (
              <Pressable style={{ marginTop: 20 }} onPress={handleSubmit}>
                <Text
                  style={{
                    color: "white",
                    padding: 10,
                    backgroundColor: "#0b1b32",
                    marginBottom: 20,
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: "Kanit",
                    fontWeight: "bold",
                    paddingHorizontal: 20,
                    textAlign: "center",
                  }}
                >
                  Save new Details
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
};

export default EditDetailsScreen;

const styles = StyleSheet.create({});
