import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect,useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { savedPlaces } from "../SavedReducer";
import { auth, db } from "../Firebase";
import { signOut } from "firebase/auth";
import { useUserContext } from "../UserContext";
import { doc, getDoc } from "firebase/firestore";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as Font from 'expo-font';


const ConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { userId } = useUserContext();
  const [userData, setUserData] = useState(null);
  
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


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDateWithDay = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Confirmation",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily:'Kanit',
        color: "white",
      },
      headerStyle: {
        backgroundColor: "#27AE61",
        height: 110,
        borderBottomColor: "transparent",
        shadowColor: "transparent",
      },
    });
  }, [navigation]);

  const confirmBooking = async () => {
    try {
      if (!userId) {
        alert('User ID not available');
        return;
      }

      const bookingsRef = collection(db, 'bookings');

      const newBookingDocRef = await addDoc(bookingsRef, {
      userId,
      name: route.params.name,
      rating: route.params.rating,
      hostelId: route.params.hostelId,
      roomId: route.params.roomId,
      city: route.params.place,
      roomName:route.params.roomname,
      roomCapacity:route.params.roomcapacity,
      price:route.params.newPrice,
      date: serverTimestamp(),
      });

      alert('Applied', newBookingDocRef.id);

      navigation.replace('Main');
    } catch (error) {
      alert('Error confirming booking:', error);
    }
  };
  

  return (
    <View>
      <Pressable  style={{
            backgroundColor: "white",
            marginVertical: 10,
            marginHorizontal: 20,
            borderColor: "#27AE61",
            borderWidth: 3,
            padding: 14,
            borderRadius: 6,
          }}>
        <View style={{ marginHorizontal: 12, marginTop: 10 }}>
          <View>
            <Text style={{ color: "orange", fontSize: 21,fontWeight:'bold', fontFamily:'Kanit'  }}>
              {route.params.name}
            </Text>
            <View
              style={{
                flexDirection: "column",
                marginTop: 7,
                gap: 6,
              }}
            >
              <Text style={{fontSize:15, fontWeight:'500', color:'#c90644',fontFamily:'Kanit'}}>City: {"  "}<Text style={{fontSize:15, fontWeight:'500', color:'#27AE61'}}>{route.params.place}</Text></Text>
              
              <Text style={{fontSize:15, fontWeight:'500', color:'#c90644',fontFamily:'Kanit'}}>Price: {"  "}
              <Text style={{fontSize:15, fontWeight:'500', color:'#27AE61'}}>{route.params.newPrice}</Text></Text>

              <Text style={{fontSize:15, fontWeight:'500', color:'#c90644',fontFamily:'Kanit'}}>Room Name: {"  "}
              <Text style={{fontSize:15, fontWeight:'500', color:'#27AE61'}}>{route.params.roomname}</Text></Text>

              <Text style={{fontSize:15, fontWeight:'500', color:'#c90644',fontFamily:'Kanit'}}>Room Capacity: {"  "}
              <Text style={{fontSize:15, fontWeight:'500', color:'#27AE61'}}>{route.params.roomcapacity}</Text></Text>

              <Text style={{fontSize:15, fontWeight:'500', color:'#c90644',fontFamily:'Kanit'}}>Room Bed Type: {"  "}
              <Text style={{fontSize:15, fontWeight:'500', color:'#27AE61'}}>{route.params.roombed}</Text></Text>

              <Text style={{fontSize:15, fontWeight:'500', color:'#c90644',fontFamily:'Kanit'}}>Apply Date: {"  "}
              <Text style={{fontSize:15, fontWeight:'500', color:'#27AE61'}}>{formatDateWithDay(currentDate)}</Text></Text>
            </View>
          </View>
        </View>

        <Pressable onPress={confirmBooking}
          style={{
            backgroundColor: "#27AE61",
            width: 150,
            padding: 6,
            marginHorizontal: 12,
            marginBottom: 20,
            borderRadius: 4,
            marginTop:20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            Apply Now
          </Text>
        </Pressable>
      </Pressable>
    </View>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({});
