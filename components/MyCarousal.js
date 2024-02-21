import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';

  
const MyCarousel = ({ data }) => {
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.placeImage }} style={styles.image} />
      <Text style={styles.hostelName}>{item.properties[0].name}</Text>
      <Text style={styles.cityName}>{item.place}</Text>
      <Text style={styles.price}>Price: ${item.properties[0].newPrice}</Text>
    </View>
  );

  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      sliderWidth={300}
      itemWidth={300}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  hostelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cityName: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
});

export default MyCarousel;
