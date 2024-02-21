import { SafeAreaView, StyleSheet, Text, TextInput, View, ImageBackground, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import SearchResult from "../components/SearchResult";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { LinearGradient } from 'expo-linear-gradient';


const SearchScreen = () => {

  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);
  
  

  useEffect(()=>{
    if(items.length>0) return;

    const fetchProducts = async () => {
      const colRef = collection(db, "places");

      const docsSnap = await getDocs(colRef);
      docsSnap.forEach((doc)=> {
        items.push(doc.data());
      })

    }
    fetchProducts();

  },[items]);



  return (
    <LinearGradient
    colors={['white','#f07022']}
    style={{ flex: 1,}}
  >
    <ScrollView>
    <SafeAreaView>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          margin: 10,
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 4,
          borderRadius: 10,
          borderColor: "orange",
        }}
      >
        <TextInput style={{width:420, padding:6}}
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="Enter your Destination"
        ></TextInput>
        <Feather name="search" size={21} color="black" />
      </View>

      <SearchResult data= {items} input = {input} setInput= {setInput}></SearchResult>
    </SafeAreaView>
    </ScrollView>
  </LinearGradient>
    
  );
};

export default SearchScreen;


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    width: '100%', 
    height: '100%', 
  },
});