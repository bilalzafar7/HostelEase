import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as Font from 'expo-font';
import { useUserContext } from "../UserContext";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  addDoc,
  serverTimestamp,
  updateDoc, arrayUnion, collection, query, where, getDocs,
  deleteDoc,
} from "firebase/firestore";

const RoomsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedcapcaity, setselectedcapcaity] = useState("");
  const [selectedbed, setselectedbed] = useState("");
  const [selectedpayment, setselectedpayment] = useState("");
  const [userCounts, setUserCounts] = useState([]);
  const [userArrayLength, setUserArrayLength] = useState(0);


  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Vivan': require('../assets/fonts/VinaSans-Regular.ttf'),
        'Kdam' : require('../assets/fonts/KdamThmorPro-Regular.ttf'),
        'Bunge' : require('../assets/fonts/BungeeShade-Regular.ttf'),
        'Kanit': require('../assets/fonts/Kanit-Regular.ttf'),


        
      });
    };

    loadFont();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Available Rooms",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily:'Kanit',
        color: "white",
      },
      headerStyle: {
        backgroundColor: "#c90644",
        height: 90,
        borderBottomColor: "transparent",
        shadowColor: "transparent",
      },
    });
  }, []);

  const [selected, setSelected] = useState([]);
  const filteredRooms = route.params.rooms.filter(
    (item) => item.person >= route.params.person
  );


  const fetchAndPrintUserCount = async (city, hostelId, roomId) => {
    try {
      const reservationsRef = collection(db, "reservations");
      const reservationsQuery = query(
        reservationsRef,
        where("city", "==", city),
        where("hostelId", "==", hostelId),
        where("roomId", "==", roomId)
      );

      const reservationsSnapshot = await getDocs(reservationsQuery);
      const count = reservationsSnapshot.size;

      console.log(
        `Number of users in the same room for city ${city}, hostelId ${hostelId}, and roomId ${roomId}:`,
        count
      );

      return count;
    } catch (error) {
      console.error(`Error fetching users in the same room: ${error}`);
      return 0; 
    }
  };

  useEffect(() => {
    const roomIds = filteredRooms.map(item => item.id);

    Promise.all(roomIds.map(roomId =>
      fetchAndPrintUserCount(route.params.place, route.params.hostelId, roomId)
    )).then(counts => setUserCounts(counts));
  }, [route.params.place, route.params.hostelId, filteredRooms]);

  return (
    <>
      <ScrollView>
        <Text>
        </Text>
        {filteredRooms.map((item, index) => (
          <Pressable
            style={{ margin: 10,  backgroundColor: item.person - userCounts[index] === 0 ? "#b5b4b1" : "#f5e1e7", padding: 10 }}
            key={index}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#c90644", fontSize: 21,fontWeight:'bold', fontFamily:'Kanit' }}>
                {item.name}
              </Text>
              <AntDesign name="infocirlceo" size={24} color="#27AE61" />
            </View>
            <Text style={{ marginTop: 3, color: "green", fontSize: 18,fontFamily:'Kanit' }}>
            {item.bed}
            </Text>
            <Text style={{ color: "green", fontSize: 18, fontWeight: "500",fontFamily:'Kanit',marginTop:3 }}>
            Room Size: {item.size}square feet
            </Text>
            
            <Text style={{ color: "red", fontSize: 18, fontWeight: "bold",fontFamily:'Kanit',marginTop:3 }}>
              Capacity: {"  "}{item.person} person 
            </Text>
            <Text style={{ color: "red", fontSize: 18, fontWeight: "bold",fontFamily:'Kanit',marginTop:3 }}>
            Rs {route.params.newPrice}
            </Text>
            {item.person - userCounts[index] === 0 ? (
  <Text style={{ color: 'blue', fontSize: 18, fontWeight: 'bold', fontFamily: 'Kanit', marginTop: 3 }}>
    Fully Reserved
  </Text>
) : (
  <Text style={{ color: 'blue', fontSize: 18, fontWeight: 'bold', fontFamily: 'Kanit', marginTop: 3 }}>
    Seats Available: {"  "}{item.person - userCounts[index]}
  </Text>
)}

            {selected.includes(item.name) ? (
              <Pressable
              disabled={item.person - userCounts[index] === 0}
                style={{
                  borderColor: "#c90644",
                  backgroundColor: item.person - userCounts[index] === 0 ? "gray" : "#c90644",
                  borderWidth: 2,
                  width: "100%",
                  padding: 10,
                  marginTop:10,
                  borderRadius: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {item.person - userCounts[index] === 0 ? "Not Available" : "SELECTED"}
                </Text>
                <Entypo
                  onPress={() => setSelected([])}
                  name="circle-with-cross"
                  size={30}
                  color="red"
                />
              </Pressable>
            ) : (
              <Pressable
              disabled={item.person - userCounts[index] === 0}
                onPress={() => {
                  setSelected(item.name);
                  setSelectedItemId(item.id);
                  setselectedbed(item.bed);
                  setselectedcapcaity(item.person);
                  setselectedpayment(item.payment)
                }}
                style={{
                  borderColor: "orange",
                  backgroundColor: item.person - userCounts[index] === 0 ? "gray" : "white",
                  borderWidth: 3 ,
                  width: "100%",
                  padding: 12,
                  marginTop:10,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                    color: "orange",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {item.person - userCounts[index] === 0 ? "Not Available" : "SELECT"}
                </Text>
              </Pressable>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {selected.length > 0 ? (
        <Pressable
          onPress={() =>
            navigation.navigate("Confirmation", {
              name: route.params.name,
              rating: route.params.rating,
              newPrice: route.params.newPrice,
              rooms: route.params.availableRooms,
              hostelId: route.params.hostelId,
              roomId: selectedItemId,
              place: route.params.place,
              availability:route.params.availability,
              roomname: selected,
              roomcapacity: selectedcapcaity,
              roombed: selectedbed,
              paymenttype: selectedpayment
              
            })
          }
          style={{
            backgroundColor: "#27AE61",
            bottom: 20,
            padding: 15,
            marginHorizontal: 10,
            marginTop: 20,
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
            RESERVE
          </Text>
        </Pressable>
      ) : null}
    </>
  );
};

export default RoomsScreen;

const styles = StyleSheet.create({});
