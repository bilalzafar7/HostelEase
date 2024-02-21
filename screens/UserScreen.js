import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

const UserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "User Details",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
      },
      headerStyle: {
        backgroundColor: "#27AE61",
        height: 110,
        borderBottomColor: "transparent",
        shadowColor: "transparent",
      },
    });
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "column", gap: 10 }}>
          <Text>First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            style={{ padding: 10, borderColor: "gray", borderWidth: 1 }}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "column", gap: 10, marginTop: 10 }}>
          <Text>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            style={{ padding: 10, borderColor: "gray", borderWidth: 1 }}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "column", gap: 10, marginTop: 10 }}>
          <Text>Email</Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={{ padding: 10, borderColor: "gray", borderWidth: 1 }}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "column", gap: 10, marginTop: 10 }}>
          <Text>Phone no.</Text>
          <TextInput
            value={phone}
            onChangeText={(text) => setPhone(text)}
            style={{ padding: 10, borderColor: "gray", borderWidth: 1 }}
          ></TextInput>
        </View>
      </View>
      <Pressable
        onPress={() =>
          navigation.navigate("Confirmation", {
            name: route.params.name,
            rating: route.params.rating,
            newPrice: route.params.newPrice,
            rooms: route.params.availableRooms,
          })
        }
        style={{
          backgroundColor: "#27AE61",
          bottom: 20,
          padding: 15,
          marginHorizontal: 10,
          marginTop: 20,
          position: "absolute",
          width: "95%",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 17,
          }}
        >
          FINAL STEP
        </Text>
      </Pressable>
    </>
  );
};

export default UserScreen;

const styles = StyleSheet.create({});
