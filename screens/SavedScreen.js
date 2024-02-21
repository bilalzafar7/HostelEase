import React, { useLayoutEffect, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../Firebase";
import { useUserContext } from "../UserContext";
import { doc, getDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import * as Font from "expo-font";

const SavedScreen = () => {
  const navigation = useNavigation();
  const { userId } = useUserContext();
  const [favoriteHostels, setFavoriteHostels] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        Vivan: require("../assets/fonts/VinaSans-Regular.ttf"),
        Kdam: require("../assets/fonts/KdamThmorPro-Regular.ttf"),
        Bunge: require("../assets/fonts/BungeeShade-Regular.ttf"),
        Kanit: require("../assets/fonts/Kanit-Regular.ttf"),
      });
    };

    loadFont();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Favorites",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        fontFamily: "Kanit",
      },
      headerStyle: {
        backgroundColor: "#c90644",
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
    fetchFavoriteHostels();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoriteHostels();
    }, [userId])
  );

  const fetchFavoriteHostels = async () => {
    try {
      const favoritesRef = collection(db, "favoritehostels");
      const favoritesQuery = query(favoritesRef, where("userId", "==", userId));

      const favoritesSnapshot = await getDocs(favoritesQuery);
      const favoritesData = [];

      favoritesSnapshot.forEach((doc) => {
        favoritesData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setFavoriteHostels(favoritesData);

      console.log("Favorite Hostels:", favoritesData);
    } catch (error) {
      console.error("Error fetching favorite hostels:", error);
    }
  };

  const removeFromFavorites = async (favoriteId) => {
    try {
      const favoriteDocRef = doc(db, "favoritehostels", favoriteId);
      await deleteDoc(favoriteDocRef);

      setFavoriteHostels((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== favoriteId)
      );

      alert("Removed from favorites:", favoriteId);
    } catch (error) {
      alert("Error removing from favorites:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {favoriteHostels.map((item) => (
          <View key={item.id} style={styles.container}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.leftSection}
            >
              <View style={styles.hostelInfo}>
                <Text style={styles.hostelName}>{"  "}{item.name}</Text>
                <Text style={styles.city}>{"  "}{item.city}</Text>
              </View>
            </ImageBackground>

            <View style={styles.rightSection}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Price per Month: </Text>
                <Text style={styles.priceValue}>
                  {"  "}
                  {item.rent}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.priceLabel}>Rating: </Text>
                <Text style={styles.priceValue}>
                  {"  "}
                  {item.rating}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
              <Text style={styles.priceLabel}>Address: </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Kanit",
                    marginHorizontal:4,
                    color: "white",
                    marginTop: 5,
                  }}
                >
                  {item.address.substring(0, 15)}
                </Text>
              </View>

              <View style={styles.userBtnWrapper}>
                <TouchableOpacity
                  style={styles.userBtn}
                  onPress={() => removeFromFavorites(item.id)}
                >
                  <Text style={styles.userBtnTxt}>Unfavourite</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "#f095b1",
    borderRadius: 13,
    borderWidth:4,
    borderColor:'#c90644',
    height: 200,
  },
  leftSection: {
    flex: 0.7,
    borderRadius: 20,
    paddingVertical: 14,
    margin: 8,
  },
  hostelInfo: {
    flex: 1,
  },
  hostelName: {
    fontSize: 17,
    fontFamily: "Kanit",
    color: "white",
    marginTop: 4,
    backgroundColor: "orange",
    width: 90,
    marginLeft: 2,
  },
  city: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    fontFamily: "Kanit",
    backgroundColor: "#c90644",
    width: 60,
    marginTop: 10,
    marginLeft: 2,
  },
  rightSection: {
    marginLeft: 2,
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Kanit",
    color: "#c90644",
    marginTop: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Kanit",
    color: "white",
    marginTop: 4,
  },
  userBtnWrapper: {
    position: "absolute",
    bottom: 10,
    right: 40,
  },
  userBtn: {
    backgroundColor: "#c90644",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  userBtnTxt: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontFamily: "Kanit",
  },
});
