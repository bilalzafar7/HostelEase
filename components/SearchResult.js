import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    Image,
  } from "react-native";
  import { useNavigation } from "@react-navigation/native";
  import React, { useLayoutEffect,useState, useEffect } from "react";
  import { useUserContext } from "../UserContext";
  import * as Font from 'expo-font';

  const SearchResult = ({ data, input, setInput }) => {
    const navigation = useNavigation();
    const { userId, userDetails } = useUserContext();
    const userGender = userDetails.gender;

    useEffect(() => {
      const loadFont = async () => {
        await Font.loadAsync({
          'Kanit': require('../assets/fonts/Kanit-Regular.ttf'),
  
          
        });
      };
  
      loadFont();
    }, []);

    return (
      <View style={{ padding: 10 }}>
        <FlatList
  data={data}
  renderItem={({ item }) => {
    const filteredHostels = item.properties.filter(
      (property) => property.type === userGender
    );

    if (
      item.place.toLowerCase().includes(input.toLowerCase()) &&
      (input !== "" || filteredHostels.length > 0)
    ) {
      return (
        <View style={{ backgroundColor: 'white', borderRadius: 20, margin: 10 }}>
          <Pressable
            onPress={() => {
              setInput(item.place);
              navigation.navigate("Home", {
                input: item.place,
              });
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor:'white',
              borderRadius:20,
            }}
          >
            <View style={{borderRadius:10,}}>
              <Image
                style={{ width: 486, height: 180,borderRadius:15,margin:5 }}
                source={{ uri: item.placeImage }}
              ></Image>
            </View>
            <View style={{marginLeft:8,position:'absolute',marginVertical:20}}>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white',backgroundColor:'orange',paddingHorizontal:10,fontFamily:'Kanit',width:120}}>
          {item.place}
          </Text>
              
              <View>
              <Text style={{ color: 'white', fontSize: 13,marginTop:4,backgroundColor:'#c90644',paddingHorizontal:3,fontFamily:'Kanit',width:150 }}>
                {item.shortDescription}
          </Text>
          <View>
          <Text style={{ color: 'orange', fontSize: 18,fontWeight:'bold',marginTop:15,backgroundColor:'white',paddingHorizontal:3,fontFamily:'Kanit',width:90,marginLeft:391,textAlign:'right' }}>
                {filteredHostels.length} Hostel
              </Text>
          </View>
            </View>
            </View>
          </Pressable>
        </View>
      );
    } else {
      return null;
    }
  }}
></FlatList>

      </View>
    );
  };
  
  export default SearchResult;
  
  const styles = StyleSheet.create({});
  