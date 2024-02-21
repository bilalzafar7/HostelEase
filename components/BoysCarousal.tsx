import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native'; 
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import * as Font from 'expo-font';


const { width } = Dimensions.get('window');
const cardWidth = width - 110; // Adjust the width as needed


const Card = ({ addres,property, navigation, rating,rent,person, gender }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Info', { 
        name: property.name,
        rating: property.rating,
          newPrice: property.newPrice,
          photos: property.photos,
          availableRooms: property.rooms,
          person: person,
          availability: property.availability,
          hostelId: property.id,
          place: addres.place,
          services: property.services,
          address: property.address

       })}
    >
      <View style={styles.card}>
   
        <Image source={{ uri: property.image }} style={styles.cardImage} ></Image>
          <View style={{marginLeft:11,position:'absolute',marginVertical:50}}>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'black',backgroundColor:'white',paddingHorizontal:10,fontFamily:'Kanit'}}>
          {property.name}
          </Text>
            
          <Text style={{ color: 'white', fontSize: 11,marginTop:4,backgroundColor:'orange',paddingHorizontal:10,fontFamily:'Kanit' }}>
                {addres.place}, Pakistan
          </Text>
          </View>
      </View>
    </TouchableOpacity>
  );
};





    
export default function Carousal({rating,rent,person,gender}) {
  const navigation = useNavigation(); 
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Kanit': require('../assets/fonts/Kanit-Regular.ttf'),

        
      });
    };

    loadFont();
  }, []);


    const scrollX = React.useRef(new Animated.Value(0)).current;
    useEffect(() => {
      if (hostels.length > 0) return;
    
      const fetchProducts = async () => {
        try {
          const colRef = collection(db, "places");
          const docsSnap = await getDocs(colRef);
    
          docsSnap.forEach((doc) => {
            hostels.push(doc.data());
          });
        } catch (error) {
          alert("Error fetching places data:");
        }
      };
    
      fetchProducts();
    }, [hostels]);


  return (
    <View style={{ marginTop: 5,marginHorizontal:20 }}>
      <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          scrollEventThrottle={16}
          snapToInterval={cardWidth}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}>
          {hostels.map((hotel, hotelIndex) =>
            hotel.properties
            .filter((property) => property.rating > 3.7 && property.type === gender)
              .map((property, propertyIndex) => (
    <Card
      key={property.id}
      property={property}
      navigation={navigation}
      addres={hotel}
      rating={rating}
    rent={rent}
    person={person}
    gender={gender}
    />
  ))
)}
      </ScrollView>
    </View>
  );
}

  
const styles = StyleSheet.create({
  card: {
    height: 280,
    width: cardWidth,
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    
  },
  
  cardImage: {
    height: '70%', // Adjust the height as needed
    width: '95%',
    borderRadius:17,
    margin:10,
  },

});
