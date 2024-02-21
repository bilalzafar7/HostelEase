import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Linking  } from 'react-native';
import MapView, { Marker,Polyline } from 'react-native-maps';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUserContext } from "../UserContext";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  addDoc,
  serverTimestamp,
  updateDoc, arrayUnion, collection, query, where, getDocs,
  deleteDoc,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";


const MapScreen = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const [coordinates, setCoordinates] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 31.402864991620625, 
    longitude: 74.2125911800844, 
  });

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const placesRef = collection(db, 'places');
        const placesQuery = query(placesRef, where('place', '==', route.params.city));
        const placesSnapshot = await getDocs(placesQuery);
  
        if (!placesSnapshot.empty) {
          const placeDoc = placesSnapshot.docs[0];
          const propertiesArray = placeDoc.data().properties || [];
  
          const propertyCoordinates = propertiesArray.map(property => ({
            latitude: property.latitude || 0,
            longitude: property.longitude || 0,
          }));
  
          setCoordinates(propertyCoordinates);
        } else {
          console.log('No matching document found for the city:', route.params.city);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
  
    fetchProperties();
  }, [route.params.city]);

  const openMapsApp = () => {
    const { latitude, longitude } = selectedMarker;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Map</Text>
      </View>
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {coordinates.map((coord, index) => (
        <Marker
          key={index}
          coordinate={coord}
          title={`Hostel ${index + 1}`}
          description={`Latitude: ${coord.latitude}, Longitude: ${coord.longitude}`}
          onPress={() => handleMarkerPress(coord)}
        />
      ))}

         <Marker
          coordinate={userLocation}
          title="Your Location"
          description={`Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`}
          pinColor="blue"
        />

{selectedMarker && (
    <Marker
      coordinate={selectedMarker}
      title="Selected Hostel"
      description={`Latitude: ${selectedMarker.latitude}, Longitude: ${selectedMarker.longitude}`}
      pinColor="red"
    />
  )}

        {selectedMarker && (
          <TouchableOpacity style={styles.directionsButton} onPress={openMapsApp}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        )}
      </MapView>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    marginLeft: 10,
  },
  map: {
    flex: 1,
  },
  directionsButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  directionsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapScreen;
