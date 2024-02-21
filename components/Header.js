import { View, Text, Pressable } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  return (
    <View
      style={{
        backgroundColor: "#27AE61",
        flexDirection: "row",
        height: 65,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "white",
          borderRadius: 25,
          borderWidth: 2,
          padding: 8,
        }}
      >
        <MaterialCommunityIcons
          name="bunk-bed-outline"
          size={24}
          color="white"
        />
        <Text style={{ marginLeft: 8, fontWeight: "bold", color: "white" }}>
          Hostel
        </Text>
      </Pressable>

      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="md-home-outline" size={24} color="white" />
        <Text style={{ marginLeft: 8, fontWeight: "bold", color: "white" }}>
          House
        </Text>
      </Pressable>

      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="bed-outline" size={24} color="white" />
        <Text style={{ marginLeft: 8, fontWeight: "bold", color: "white" }}>
          Flat
        </Text>
      </Pressable>

    </View>
  );
};

export default Header;
