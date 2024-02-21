import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import HostelCard from "../components/HostelCard";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from "@expo/vector-icons";
import {
  BottomModal,
  ModalButton,
  ModalContent,
  ModalFooter,
  ModalTitle,
  SlideAnimation,
} from "react-native-modals";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useUserContext } from "../UserContext";
import * as Font from 'expo-font';


const PlacesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const { userId, userDetails } = useUserContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const userGender = userDetails.gender;
  const [selectedServices, setSelectedServices] = useState([]);
  const services = ['Wifi', 'Geyser', 'Cleaning', 'Parking', 'Kitchen','Oven','Fridge','Neat and Clean Environment','Rooftop','Security Guard'];

  const toggleService = (selectedService) => {
    if (selectedServices.includes(selectedService)) {
      setSelectedServices((prevSelected) =>
        prevSelected.filter((service) => service !== selectedService)
      );
    } else {
      setSelectedServices((prevSelected) => {
        const newSelected = [...prevSelected, selectedService];
        return newSelected.filter((service) => allServices.includes(service));
      });
    }
  };
  
 

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


  useEffect(()=>{
    if(items.length>0) return;

    setLoading(true);

    const fetchProducts = async () => {
      const colRef = collection(db, "places");

      const docsSnap = await getDocs(colRef);
      docsSnap.forEach((doc)=> {
        items.push(doc.data());
      });
      setLoading(false);
    };
    fetchProducts();

  },[items]);


  
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Hostels ",
      headerTitleStyle: {
        fontSize: 24,
        fontWeight:'bold',
        color: "white",
        fontFamily:'Kanit'
      },
      headerStyle: {
        backgroundColor: "#c90644",
        height: 110,
      },
    });
  }, []);

  const filters = [
    {
      id: "0",
      filter: " Cost:  Low to High",
    },
    {
      id: "1",
      filter: " Cost:  High to Low",
    },
  ];

  const searchPlaces = items?.filter(
    (item) => item.place === route.params.place
  );
  const [sortedData, setSortedData] = useState(items);

  const compare = (a, b) => {
    if (a.newPrice > b.newPrice) {
      return -1;
    }
    if (a.newPrice < b.newPrice) {
      return 1;
    }
    return 0;
  };

  const compare2 = (a, b) => {
    if (a.newPrice < b.newPrice) {
      return -1;
    }
    if (a.newPrice > b.newPrice) {
      return 1;
    }
    return 0;
  };

  const applyFilter = (filter) => {
    setModalVisible(false);
    switch (filter) {
      case "cost:High to Low":
        searchPlaces.map((val) => val.properties.sort(compare));
        setSortedData(searchPlaces);
        break;

      case "cost:Low to High":
        searchPlaces.map((val) => val.properties.sort(compare2));
        setSortedData(searchPlaces);
        break;
    }
  };
  const allServices = [];

items.forEach((item) => {
  if (item.properties && Array.isArray(item.properties)) {
    item.properties.forEach((property) => {
      if (property.services && Array.isArray(property.services)) {
        property.services.forEach((service) => {
          if (!allServices.includes(service)) {
            allServices.push(service);
          }
        });
      }
    });
  }
});


  return (
    <View>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          padding: 12,
        }}
      >
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Octicons name="arrow-switch" size={22} color="#c90644" />
          <Text style={{ fontSize: 15, fontWeight: "500", marginLeft: 9,fontFamily:'Kanit', color:'#c90644' }}>
            Sort
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilterModal(!filterModal)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <MaterialIcons name="room-service" size={22} color="#c90644" />
          <Text style={{ fontSize: 15, fontWeight: "500", marginLeft: 9,fontFamily:'Kanit', color:'#c90644' }}>
            Facilities
          </Text>
        </Pressable>


        <Pressable
          onPress={() =>
            navigation.navigate("Map", { city: route.params.place })
          }
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <FontAwesome5 name="map-marker-alt" size={22} color="#c90644" />
          <Text style={{ fontSize: 15, fontWeight: "500", marginLeft: 9,fontFamily:'Kanit',color:'#c90644' }}>
            Map
          </Text>
        </Pressable>
      </Pressable>

      {
  loading ? (
    <Text>Fetching Hostels....</Text>
  ) : (
    <ScrollView>
     
      {sortedData
  ?.filter((item) => item.place === route.params.place)
  .map((item) =>
    item.properties
      .filter(
        (property) =>
        (selectedServices.length === 0 ||selectedServices.every((selectedService) => property.services.includes(selectedService))) &&
          property.newPrice <= route.params.rent &&
          property.rating <= route.params.rating &&
          property.type === userGender
      )
      .map((property, index) => (
        <HostelCard
          key={index}
          rooms={route.params.rooms}
          rent={route.params.rent}
          person={route.params.person}
          property={property}
          availableRooms={property.rooms}
          availability={property.availability}
          hostelId={property.id}
          place={route.params.place}
        />
      ))
  )}


    </ScrollView>
  )
}

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        footer={
          <ModalFooter>
            <Pressable
              onPress={() => applyFilter(selectedFilter)}
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
        modalTitle={<ModalTitle style={{backgroundColor:'orange'}} title="Sort and Filter"></ModalTitle>}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 170 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                marginVertical: 10,
                flex: 2,
                height: 170,
                borderRightWidth: 1,
                borderColor: "#E0E0E0",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 18, fontFamily:'Kanit',color:'#c90644',marginVertical:10 }}>Sort</Text>
            </View>
            <View style={{ flex: 3, margin: 10 }}>
              {filters.map((item, index) => (
                <Pressable
                  onPress={() => setSelectedFilter(item.filter)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                  key={index}
                >
                  {selectedFilter.includes(item.filter) ? (
                    <FontAwesome name="circle" size={18} color="#c90644" />
                  ) : (
                    <Entypo name="circle" size={18} color="black" />
                  )}

                  <Text
                    style={{ fontSize: 16, fontWeight: "500", marginLeft: 6, fontFamily:'Kanit' }}
                  >
                    {item.filter}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ModalContent>
      </BottomModal>



      <BottomModal
        onBackdropPress={() => setFilterModal(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalTitle={<ModalTitle style={{backgroundColor:'orange'}} title="Select Facilities"></ModalTitle>}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setFilterModal(!filterModal)}
        visible={filterModal}
        onTouchOutside={() => setFilterModal(!filterModal)}
      >
        <ModalContent style={{ width: "100%", height: 260 }}>
        <View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap',marginTop:10 }}>
        {allServices.map((service, index) => (
          <Pressable
            key={index}
            onPress={() => toggleService(service)}
            style={{
              backgroundColor: selectedServices.includes(service) ? '#c90644' : 'white',
              borderColor:'#c90644',
              borderWidth:3,
              borderRadius: 12,
              padding: 9,
              marginHorizontal: 12,
              marginVertical: 5,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '500',
                color: selectedServices.includes(service) ? 'white' : '#c90644',
                fontFamily: 'Kanit',
              }}
            >
              {service}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

export default PlacesScreen;

const styles = StyleSheet.create({});
