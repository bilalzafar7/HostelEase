import { Pressable, StyleSheet, Text, TextInput, View, Alert, ImageBackground, Slider } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { ScrollView } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Octicons } from '@expo/vector-icons';
import { BottomModal, ModalButton, ModalContent, ModalFooter, ModalTitle, SlideAnimation } from "react-native-modals";
import Carousal from "../components/Carousal";
import BookingScreen from "./BookingScreen";
import { FontAwesome } from '@expo/vector-icons';
import BoysCarousal from "../components/BoysCarousal";
import GirlsCarousal from "../components/GirlsCarousal";
import * as Font from 'expo-font';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserContext } from "../UserContext";


const HomeScreen = () => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(5);
  const [rent, setRent] = useState(8000);
  const [person, setPerson] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const route = useRoute();
  const { userId, userDetails } = useUserContext();
  const userGender = userDetails.gender;

  
  useEffect(() => {
    if (route?.params?.input) {
      setModalVisible(true);
    }
  }, [route?.params?.input]);

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
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Been trying to find hostel?",
      headerTitleStyle: {
        fontSize: 24,
        fontWeight:'bold',
        color: "white",
        fontFamily:'Kanit'
      },
      headerStyle: {
        backgroundColor: "orange",
        height: 110,
      },
      headerRight: () => (
        <Ionicons
          onPress={()=> navigation.navigate("Reserve")}
          name="notifications-outline"
          size={24}
          color="white"
          style={{ marginRight: 12 }}
        />
      ),
    });
  }, []);

  const searchPlaces = (place) => {
    if(!route.params){
      Alert.alert('Invalid Details', 'Please select the City', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
        {cancelable:false}
      );
    }

    if(route.params){
      navigation.navigate("Places",{
        rating: rating,
        rent: rent,
        person: person,
        place: place,

      })
    }
  };

  

  return (

        <>
        <ScrollView style={{backgroundColor:'white'}}>
          <View>
            <View style={{backgroundColor: "white",marginTop:'10',justifyContent:'center', alignItems:'center'}}>
            <Pressable
              onPress={()=> navigation.navigate("Search")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 10,
                paddingVertical: 11,
                borderRadius: 10,
                borderWidth:4,
                borderColor:'orange',
                width:'75%',
                marginTop:20
              }}
            >
              <Entypo name="location-pin" size={24} color="orange" />
              <TextInput
                placeholder={route?.params ? route.params.input : "Click to search for the City"}
                placeholderTextColor={"orange"}
                style={{ padding: 4, width: 600, fontFamily:'Kanit' }}
              ></TextInput>
              <Pressable onPress={()=>setModalVisible(!modalVisible)}>
              <Octicons name="three-bars" size={24} color="orange" />
              </Pressable>
            </Pressable>

            <View style={{ alignItems: "center" }}>
              <Pressable
                onPress={() => {
                  searchPlaces(route?.params.input);
                }}

                style={{
                  paddingHorizontal: 10,
                  borderColor: "orange",
                  borderWidth: 2,
                  paddingVertical: 10,
                  backgroundColor: "orange",
                  borderRadius: 12,
                  marginTop: 20,
                  marginBottom:30,
                  width: 160,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    fontWeight: "bold",
                    color: "white",
                    fontFamily:'Kdam'
                  }}
                >
                  Search
                </Text>
              </Pressable>
            </View>
            </View>
            
            <Carousal rating={rating} rent={rent} person={person} gender={userGender}></Carousal>
            
            <LinearGradient
      colors={['blue', 'black']} style={{margin:14, backgroundColor:'black', borderRadius:20,marginTop:25}}>
              <Text style={{fontSize:24,color:'white',fontWeight:'bold', marginTop:16,marginLeft:18,fontFamily:'Kanit'}}>Your feedback matters!</Text>
              <Text style={{fontSize:18,color:'white', marginLeft:18, fontFamily:'Kanit' }}>Share your ideas to improve the app.</Text>
              <Pressable
                style={{
                  paddingHorizontal: 10,
                  borderColor: "white",
                  borderWidth: 3,
                  paddingVertical: 10,
                  borderRadius: 12,
                  marginTop: 17,
                  marginBottom:30,
                  marginLeft:18,
                  width: 290,
                }}
                onPress={() => navigation.navigate("Feedback")}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    fontWeight: "bold",
                    color: "white",
                    fontFamily:'Kdam'
                  }}
                >
                  Vote for improvement   <AntDesign name="arrowright" size={24} color="white" />
                </Text>
              </Pressable>
              </LinearGradient>

            <Text style={{fontSize:19, fontWeight:'bold', marginTop:30, marginLeft:10, color:'black',fontFamily:'Kanit'}}>Our top rated {""} 
            <Text style={{fontSize:19, fontWeight:'bold', marginTop:30, marginLeft:10, color:'orange',fontFamily:'Kanit'}}>hostels</Text></Text>

          <BoysCarousal rating={rating} rent={rent} person={person} gender={userGender}></BoysCarousal>

          <Text style={{fontSize:19, fontWeight:'bold', marginLeft:10, color:'black',fontFamily:'Kanit'}}>Explore by {""}
            <Text style={{fontSize:19, fontWeight:'bold',  marginLeft:10, color:'orange',fontFamily:'Kanit'}}>Cities</Text></Text>

          <GirlsCarousal rating={rating} rent={rent} person={person} gender={userGender}></GirlsCarousal>

          </View>
        </ScrollView>

        
      <BottomModal
        swipeThreshold={200}
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        footer={
          <ModalFooter>
            <Pressable
              onPress={()=>setModalVisible(!modalVisible)}
              style={{
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: '#c90644',
    width: '100%', 
    borderRadius: 10,
  paddingVertical:10}}
            >
              <Text
              style={{
                textAlign: "center",
                fontSize: 21,
                fontWeight: "bold",
                color: "white",
                fontFamily:'Kanit'
              }}
              >Apply</Text>
            </Pressable>
          </ModalFooter>
        }
        modalTitle={<ModalTitle style={{backgroundColor:'orange'}}  title="Filter your search"></ModalTitle>}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={()=>setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={()=>setModalVisible(!modalVisible)}
      >
        
      <ModalContent style={{width:"100%", height:300}}>

<View style={{flexDirection:'row', alignItems:'center', justifyContent:"space-between", marginVertical:15}}>
      <Text style={{color:'orange', fontWeight:'bold', fontSize:16}}>Rating</Text>
      <Pressable style={{flexDirection:'row', gap:1, alignItems:'center',marginLeft:105}}>
          <Pressable onPress={()=>setRating(Math.max(0,rating-0.5))} style={{width:35, height:35, borderRadius:17,borderWidth:4, borderColor:'orange',marginHorizontal:35}}><Text style={{textAlign:"center", fontSize:22, fontWeight:'bold', paddingHorizontal:6,color:'orange',fontFamily:'Kdam'}}>-</Text></Pressable>
          <Pressable>
            <Text style={{fontSize:17, color:'#c90644',fontFamily:'Kanit'}}>{rating}</Text>
          </Pressable>
          <Pressable onPress={()=>setRating(Math.min(5,rating+0.5))} style={{width:35, height:35, borderRadius:17,borderWidth:4, borderColor:'orange',marginHorizontal:25}}><Text style={{textAlign:"center", fontSize:22, fontWeight:'bold', paddingHorizontal:6,color:'orange',fontFamily:'Kdam'}}>+</Text></Pressable>


      </Pressable>
    </View>

    <View style={{flexDirection:'row', alignItems:'center', justifyContent:"space-between", marginVertical:15}}>
      <Text style={{color:'orange', fontWeight:'bold', fontSize:16}}>No. of Person in a room</Text>
      <Pressable style={{flexDirection:'row', gap:1, alignItems:'center'}}>
          <Pressable onPress={()=>setPerson(Math.max(0,person-1))} style={{width:35, height:35, borderRadius:17,borderWidth:4, borderColor:'orange',marginHorizontal:35}}><Text style={{textAlign:"center", fontSize:22, fontWeight:'bold', paddingHorizontal:6,color:'orange',fontFamily:'Kdam'}}>-</Text></Pressable>
          <Pressable>
            <Text style={{fontSize:17, color:'#c90644',fontFamily:'Kanit'}}>{person}</Text>
          </Pressable>
          <Pressable onPress={()=>setPerson(person+1)} style={{width:35, height:35, borderRadius:17,borderWidth:4, borderColor:'orange',marginHorizontal:25}}><Text style={{textAlign:"center", fontSize:22, fontWeight:'bold', paddingHorizontal:6,color:'orange',fontFamily:'Kdam'}}>+</Text></Pressable>


      </Pressable>
    </View>
    <View style={{flexDirection:'row', alignItems:'center', justifyContent:"space-between", marginVertical:15}}>
      <Text style={{color:'orange', fontWeight:'bold', fontSize:16}}>Price per Month</Text>
      <Pressable style={{flexDirection:'row', gap:1, alignItems:'center',marginLeft:70}}>
          <Pressable onPress={()=>setRent(Math.max(2000,rent-500))} style={{width:35, height:35, borderRadius:17,borderWidth:4, borderColor:'orange',marginHorizontal:15}}><Text style={{textAlign:"center", fontSize:22, fontWeight:'bold', paddingHorizontal:6,color:'orange',fontFamily:'Kdam'}}>-</Text></Pressable>
          <Pressable>
            <Text style={{fontSize:17, color:'#c90644',fontFamily:'Kanit'}}>{rent}</Text>
          </Pressable>
          <Pressable onPress={()=>setRent(rent+500)} style={{width:35, height:35, borderRadius:17,borderWidth:4, borderColor:'orange',marginRight:25,marginLeft:9}}><Text style={{textAlign:"center", fontSize:22, fontWeight:'bold', paddingHorizontal:6,color:'orange',fontFamily:'Kdam'}}>+</Text></Pressable>


      </Pressable>
    </View>
  </ModalContent>
      

      </BottomModal>
        </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    width: '100%', 
    height: '100%', 
  },
});
