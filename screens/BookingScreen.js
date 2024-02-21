import React, { useLayoutEffect,useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Pressable,TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native"; 
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useUserContext } from "../UserContext";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, } from 'firebase/firestore';
import * as Font from 'expo-font';


const BookingScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { userId, userDetails } = useUserContext();
  const [bookings, setBookings] = useState([]);  
  const navigation = useNavigation();
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

  useLayoutEffect(() => {
   navigation.setOptions({
      headerShown: true,
      title: "Applied for Reservations",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        fontFamily:'Kanit'
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
    fetchBookings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [userId])
  );

  const fetchBookings = async () => {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", userId)
      );
  
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsData = [];
  
      bookingsSnapshot.forEach((doc) => {
        const booking = doc.data();
        const dateObject = booking.date.toDate();
        const formattedDate = dateObject.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
  
        bookingsData.push({
          id: doc.id,
          ...booking,
          formattedDate,
        });
      });
  
      setBookings(bookingsData);
    } catch (error) {
      Alert.alert("Error fetching bookings:", error.message);
    }
  };
  

  const removeBooking = async (bookingId) => {
    try {
      const bookingDocRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingDocRef);
  
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
  
      alert('Booking removed successfully:', bookingId);
    } catch (error) {
      alert('Error removing booking:', error);
    }
  };
  

 
  
  return ( 
    <SafeAreaView style={{ flex: 1 }}> 
      <ScrollView>
      {bookings.map((item) => (
          <View key={item.id}>
            <Pressable
            style={{
              backgroundColor: "#d3ddeb",
              marginVertical: 10,
              marginHorizontal: 20,
              borderColor: "#0b1b32",
              borderWidth: 4,
              padding: 14,
              borderRadius: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 24, fontWeight: "bold",fontFamily:'Kanit',color:'#0b1b32' }}>
               {item.name}<Text style={{fontSize: 15, fontWeight: "100", color:'grey',marginLeft:6,fontFamily:'Kanit' }}>{item.city}</Text>
              </Text>
  
              
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <MaterialIcons name="stars" size={30} color="orange" />
                <Text style={{  fontSize: 16, fontWeight: "bold",marginLeft:6,fontFamily:'Kanit' }}>
                  {item.rating}
                </Text>
              </View>
  
              <View style={{flexDirection:'row'}}>
              <Text style={{ fontSize: 18,fontFamily:'Kanit',color:'orange',marginTop:4,fontWeight:'bold' }}>
               {item.roomName}<Text style={{ fontSize: 14,fontFamily:'Kanit',color:'red',marginTop:4, marginLeft:5 }}>
               ({item.roomCapacity} person )
              </Text>
              </Text>
              
              </View>
              <Text style={{ fontSize: 18,fontWeight:'bold',fontFamily:'Kanit',color:'orange',marginTop:4 }}>
               {item.price} Rs
              </Text>
              
              
              <View
              style={{
                marginTop:4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 18, color:'green',fontFamily:'Kanit' }}
                >
                  Applied Date: {"  "}
                </Text>
              </View>
              <View>
                <Text
                  style={{ fontSize: 17,fontFamily:'Kanit',color:'gray' }}
                >
                   {item.formattedDate}
                </Text>
              </View>
              
            </View>
            
            <View style={{
                marginTop:4,
                flexDirection: "row",
                alignItems: "center",
              }}>
                <View>
                <Text
                  style={{ fontSize: 18, marginBottom: 3, color:'green',fontFamily:'Kanit' }}
                >
                  Request Status:
                </Text>
              </View>
              <View>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", marginBottom: 3, color:'red',marginLeft:6 }}
                >
                  Waiting for Approval
                </Text>
              </View>
              </View>
            
            </View>
            <View style={styles.userBtnWrapper}>
              
              <TouchableOpacity style={styles.userBtn} onPress={() => removeBooking(item.id)} >
                <Text style={styles.userBtnTxt}>Remove</Text>
              </TouchableOpacity>
          </View>
          </Pressable>
          </View>
        ))}
      </ScrollView>
      
    </SafeAreaView>
  );
  };
  
  export default BookingScreen;
  
  const styles = StyleSheet.create({
    userBtnWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginTop:10,
    },
    userBtn: {
      borderColor: '#0b1b32',
      backgroundColor:'#0b1b32',
      borderWidth: 3,
      borderRadius: 9,
      paddingVertical: 8,
      paddingHorizontal: 15,
      marginHorizontal: 5,
    },
    userBtnTxt: {
      color: 'white',
      fontSize:15,
      fontWeight:'bold',
      fontFamily:'Kdam'
    },
   
  });
  