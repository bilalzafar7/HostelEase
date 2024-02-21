import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SavedScreen from "./screens/SavedScreen";
import BookingScreen from "./screens/BookingScreen";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import SearchScreen from "./screens/SearchScreen";
import PlacesScreen from "./screens/PlacesScreen";
import MapScreen from "./screens/MapScreen";
import HostelInfoScreen from "./screens/HostelInfoScreen";
import RoomsScreen from "./screens/RoomsScreen";
import UserScreen from "./screens/UserScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/Welcome";
import Splash from "./screens/Welcome";
import Onboarding from "./screens/OnBoarding";
import Test1 from "./screens/Test1";
import { savedPlaces } from "./SavedReducer";
import ComplainScreen from "./screens/ComplainScreen";
import { LinearGradient } from 'expo-linear-gradient';
import Living from "./screens/Living";
import ReservationScreen from "./screens/ReservationScreen";
import Feedback from "./screens/Feedback";
import ChatScreen from "./screens/ChatScreen";
import EditDetailsScreen from "./screens/EditDetailsScreen";
import SupportScreen from "./screens/SupportScreen";
import PaymentScreen from "./screens/PaymentScreen";


const StackNavigator = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

function BottomTabs() { 
    return (
      <Tab.Navigator
            screenOptions={{

          tabBarStyle: {
              
              elevation: 10,
              backgroundColor: 'white',
              borderRadius: 15,
              borderTopWidth:3,
              borderTopColor: "orange",
              borderColor: "orange",
              height: 60,
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={['#e1dff7', '#f7e9df']} 
              style={{ flex: 1, borderRadius: 15 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
      }}>

  <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: {color:'orange',fontSize:11,fontWeight:'bold'},
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={28} color="orange" />
              ) : (
                <AntDesign name="home" size={28} color="orange" />
              ),
          }}
        ></Tab.Screen>

<Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarLabel: "Saved",
            tabBarLabelStyle: {color:'orange',fontSize:11,fontWeight:'bold'},
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="heart" size={28} color="orange" />
              ) : (
                <AntDesign name="hearto" size={28} color="orange" />
              ),
          }}
        ></Tab.Screen>
<Tab.Screen
          name="Living"
          component={ReservationScreen}
          options={{
            tabBarLabel: "Hostel",
            tabBarLabelStyle: {color:'orange',fontSize:11,fontWeight:'bold'},
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="pushpin" size={28} color="orange" />
              ) : (
                <AntDesign name="pushpino" size={28} color="orange" />
              ),
          }}
        ></Tab.Screen>
<Tab.Screen
          name="Bookings"
          component={BookingScreen}
          options={{
            tabBarLabel: "Bookings",
            tabBarLabelStyle: {color:'orange',fontSize:11,fontWeight:'bold'},
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="notifications" size={28} color="orange" />
              ) : (
                <Ionicons name="notifications-outline" size={28} color="orange" />
              ),
          }}
        ></Tab.Screen>

<Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: {color:'orange',fontSize:11,fontWeight:'bold'},
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={28} color="orange" />
              ) : (
                <Ionicons name="person-outline" size={28} color="orange" />
              ),
          }}
        ></Tab.Screen>
      </Tab.Navigator>
    );
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
      
      <Stack.Screen name="Onboarding" component={Onboarding} options={{headerShown: false}} />
<Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
<Stack.Screen name="Sign" component={SignupScreen} options={{headerShown: false}} />
      <Stack.Screen name="Welcome" component={Splash} options={{headerShown: false}} />
        <Stack.Screen name="Main" component={BottomTabs} options={{headerShown: false}} />
        <Stack.Screen name="Booking" component={BookingScreen}/>
        <Stack.Screen name="Saved" component={SavedScreen}/>
        <Stack.Screen name="Reserve" component={ReservationScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Search" component={SearchScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Places" component={PlacesScreen} />
        <Stack.Screen name="Map" component={MapScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Info" component={HostelInfoScreen}/>
        <Stack.Screen name="Rooms" component={RoomsScreen}/>
        <Stack.Screen name="User" component={UserScreen}/>
        <Stack.Screen name="Confirmation" component={ConfirmationScreen}/>
        <Stack.Screen name="Complains" component={ComplainScreen}/>
        <Stack.Screen name="Feedback" component={Feedback}/>
        <Stack.Screen name="Chat" component={ChatScreen}/>
        <Stack.Screen name="Details" component={EditDetailsScreen}/>
        <Stack.Screen name="Support" component={SupportScreen}/>
        <Stack.Screen name="Payment" component={PaymentScreen}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
