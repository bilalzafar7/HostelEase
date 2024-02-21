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
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';


const { width } = Dimensions.get('window');
const cardWidth = width - 120; // Adjust the width as needed





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
   
        <Image source={{ uri: property.image }} style={styles.cardImage} />
          <View style={{marginLeft:20}}>
          <Text style={{ fontSize: 20, color: 'black', fontFamily:'Kdam'}}>
          {property.name} {"  "}<Text style={{ color: 'orange', fontSize: 14, fontWeight: '500' }}>
            Rs {property.newPrice}
          </Text>
          </Text>
          
          <View style={{ flexDirection: 'row',marginTop:4 }}>
              <Ionicons name="star" size={15} color={'orange'} />
              
              <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold', marginLeft: 10}}>{property.rating}</Text>
            </View>
            
          <Text style={{ color: 'gray', fontSize: 11,marginTop:4, fontFamily:'Kdam' }}>
                {addres.place}, Pakistan
          </Text>
          </View>
      </View>
    </TouchableOpacity>
  );
};




    
export default function BoysCarousal({rating,rent,person,gender}) {
  const navigation = useNavigation(); 
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Vivan': require('../assets/fonts/VinaSans-Regular.ttf'),
        'Kdam' : require('../assets/fonts/KdamThmorPro-Regular.ttf'),
        'Bunge' : require('../assets/fonts/BungeeShade-Regular.ttf')

        
      });
    };

    loadFont();
  }, []);

    const scrollX = React.useRef(new Animated.Value(0)).current;
    useEffect(()=>{
      if(hostels.length>0) return;
    
      setLoading(true);
    
      const fetchProducts = async () => {
        const colRef = collection(db, "places");
    
        const docsSnap = await getDocs(colRef);
        docsSnap.forEach((doc)=> {
          hostels.push(doc.data());
        });
        setLoading(false);
      };
      fetchProducts();
    
    },[hostels]);


  return (
    <LinearGradient
      colors={['#820303', 'black']}
      style={{ margin: 20, borderRadius: 25, height: 510 }}
    >
      <View style={{alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
      <Text style={{fontFamily:'Bunge', fontSize:33, color:'orange',marginTop:7}}>Hostel Ease</Text>
      <Text style={{fontFamily:'Kdam', fontSize:18, color:'white',marginTop:14,marginHorizontal:5}}>You can get the best hostel deals here!</Text>
      <Text style={{textAlign:'center',fontFamily:'Kdam', fontSize:17, color:'orange',marginTop:7,marginHorizontal:5}}>Our goal to provide you comfort in finding and reserving accommodations.</Text>



      </View>
      <View style={{ borderRadius:20,marginTop:10}}>
      <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          scrollEventThrottle={16}
          snapToInterval={cardWidth}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          style={{ margin:20, borderRadius:20}}>
       {hostels.map((hotel, hotelIndex) =>
            hotel.properties
            .filter((property) => property.type === gender)
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
    </LinearGradient>  );
}

  
const styles = StyleSheet.create({
  card: {
    height: 260,
    width: cardWidth,
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    
  },
  
  cardImage: {
    height: '60%', // Adjust the height as needed
    width: '92%',
    borderRadius:10,
    margin:10,
  },
 

});
