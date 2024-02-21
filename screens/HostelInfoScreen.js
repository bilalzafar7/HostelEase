import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Pressable,
  Modal,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import React, { useLayoutEffect, useEffect, useState} from "react";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { pixelNormalize } from "../components/PicNormalize";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { addFavorite, removeFavorite } from "../FavouriteReducer";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../Firebase";
import { signOut } from "firebase/auth";
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
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';

const HostelInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const person = `${route.params.person}`;
  const { userId } = useUserContext();
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  

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

  useEffect(() => {
    checkIfFavorite();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Check favorites when the screen is focused
      checkIfFavorite();
    }, [])
  );

  const checkIfFavorite = async () => {
    try {
      const favoritesRef = collection(db, "favoritehostels");
      const favoritesQuery = query(
        favoritesRef,
        where("userId", "==", userId),
        where("hostelId", "==", route.params.hostelId),
        where("city", "==", route.params.place)
      );

      const favoritesSnapshot = await getDocs(favoritesQuery);

      setIsFavorite(!favoritesSnapshot.empty);
    } catch (error) {
      alert("Error checking favorites:", error);
    }
  };

  

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

  const addToFavorites = async () => {
    try {
      if (!userId) {
        alert("User ID not available");
        return;
      }
  
      const favoritesRef = collection(db, "favoritehostels");
  
      const existingFavoritesQuery = query(
        favoritesRef,
        where("userId", "==", userId),
        where("hostelId", "==", route.params.hostelId),
        where("city", "==", route.params.place)
      );
  
      const existingFavoritesSnapshot = await getDocs(existingFavoritesQuery);
  
      if (existingFavoritesSnapshot.empty) {
        const newFavoriteDocRef = await addDoc(favoritesRef, {
          userId,
          name: route.params.name,
          rating: route.params.rating,
          hostelId: route.params.hostelId,
          city: route.params.place,
          rent: route.params.newPrice,
          image: route.params.image,
          address: route.params.address
        });
  
        setIsFavorite(true); // Hostel is added to favorites
        alert("Added to Favorite Hostels", newFavoriteDocRef.id);
      } else {
        const favoriteId = existingFavoritesSnapshot.docs[0].id;
        const favoriteDocRef = doc(favoritesRef, favoriteId);
        await deleteDoc(favoriteDocRef);
  
        setIsFavorite(false); // Hostel is removed from favorites
        alert("Removed from Favorite Hostels");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };
  

  const handleImagePress = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const handleNextImage = () => {
    const nextIndex = (currentIndex + 1) % route.params.photos.length;
    setSelectedImage(route.params.photos[nextIndex].imageUrl);
    setCurrentIndex(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex =
      (currentIndex - 1 + route.params.photos.length) %
      route.params.photos.length;
    setSelectedImage(route.params.photos[prevIndex].imageUrl);
    setCurrentIndex(prevIndex);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `${route.params.name}`,
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily:'Kanit',
        color: "white",
      },
      headerStyle: {
        backgroundColor: "orange",
        height: 80,
        borderBottomColor: "transparent",
        shadowColor: "transparent",
      },
    });
  }, []);

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <Pressable
            style={{ flexDirection: "row", flexWrap: "wrap", margin: 12 }}
          >
            {route.params.photos.slice(0, 6).map((photo, index) => (
              <View style={{ margin: 3 }} key={index}>
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() => handleImagePress(photo.imageUrl, index)}
                  key={index}
                >
                  <Image
                    style={{
                      width: 103,
                      height: pixelNormalize(130),
                      borderRadius: pixelNormalize(4),
                    }}
                    source={{ uri: photo.imageUrl }}
                  ></Image>
                </TouchableOpacity>
              </View>
            ))}
            
          </Pressable>

          <Modal
            transparent={true}
            visible={selectedImage !== null}
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalContainer}>
            <TouchableOpacity
                onPress={handleNextImage}
                style={{position: "absolute",
                top: "50%",
                right:1,
                paddingHorizontal: 20,}}
              >
                <AntDesign name="rightcircleo" size={30} color="red" />
              </TouchableOpacity>
              
              <Image style={styles.fullImage} source={{ uri: selectedImage }} />
              <TouchableOpacity
                onPress={handlePrevImage}
                style={{position: "absolute",
                top: "50%",
                left: 1,
                paddingHorizontal: 20,}}
              >
                <AntDesign name="leftcircleo" size={30} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Entypo name="squared-cross" size={30} color="red" />
              </TouchableOpacity>
            </View>
          </Modal>
          <View style={{ marginHorizontal: 12, marginTop: 10 }}>
            <View>
              <Text
                style={{
                  width: 200,
                  fontSize: 24,
                  color: "orange",
                  fontFamily: "Kanit",
                }}
              >
                {route.params.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 7,
                }}
              >
                <MaterialIcons name="stars" size={24} color="orange" />
                <Text
                  style={{
                    fontSize: 18,
                    color: "#c90644",
                    fontFamily: "Kanit",
                    marginLeft: 7,
                  }}
                >
                  {route.params.rating}
                </Text>
                <View
                  style={{
                    backgroundColor: "#c90644",
                    padding: 5,
                    borderRadius: 5,
                    width: 100,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 7,
                      textAlign: "center",
                      color: "white",
                      fontSize: 15,
                      fontFamily: "Kdam",
                    }}
                  >
                    {route.params.place}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 30 }}>
                  <Pressable onPress={addToFavorites}>
                    <Ionicons
                      name={isFavorite ? "heart" : "heart-outline"}
                      size={30}
                      color={isFavorite ? "red" : "red"}
                    />
                  </Pressable>
                </View>
                
              </View>
            </View>
          </View>

          <Text
            style={{
              borderColor: "#E0E0E0",
              borderWidth: 3,
              height: 1,
              marginTop: 10,
            }}
          ></Text>

          <Text
            style={{
              marginTop: 15,
              fontSize: 15,
              marginLeft: 10,
              fontWeight: "500",
              fontFamily: "Kdam",
              color: "orange",
            }}
          >
            Price per Month{"      "}
            <Text
              style={{
                fontSize: 17,
                fontWeight: "500",
                fontFamily: "Kdam",
                color: "black",
              }}
            >
              Rs{route.params.newPrice}
            </Text>
          </Text>

          <Text
            style={{
              borderColor: "#E0E0E0",
              borderWidth: 3,
              height: 1,
              marginTop: 10,
            }}
          ></Text>

          <View
            style={{
              margin: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "300",
                  color: "gray",
                  fontFamily: "Kanit",
                }}
              >
                {route.params.address}
              </Text>
            </View>
          </View>

          <Text
            style={{
              borderColor: "#E0E0E0",
              borderWidth: 3,
              height: 1,
              marginTop: 10,
            }}
          ></Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              margin: 10,
              color: "red",
            }}
          >
            Most Popular Facilities
          </Text>
          <View style={{ margin: 10, flexDirection: "row", flexWrap: "wrap" }}>
            {route.params.services.map((service, index) => (
              <Text
                key={index}
                style={{
                  textAlign: "center",
                  color: "white",
                  backgroundColor: "#c90644",
                  marginHorizontal: 10,
                  marginVertical: 6,
                  borderRadius: 10,
                  padding: 8,
                  fontSize: 16,
                  fontFamily: "Kanit",
                }}
              >
                {service}
              </Text>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Pressable
        onPress={() =>
          navigation.navigate("Rooms", {
            name: route.params.name,
            rating: route.params.rating,
            newPrice: route.params.newPrice,
            rooms: route.params.availableRooms,
            hostelId: route.params.hostelId,
            place: route.params.place,
            person: route.params.person,
            services: route.params.services,
            availability:route.params.availability
          })
        }
        style={{
          backgroundColor: "orange",
          bottom: 20,
          padding: 15,
          marginHorizontal: 10,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 18,
            fontFamily: "Kanit",
          }}
        >
          Select Availability
        </Text>
      </Pressable>
    </>
  );
};

export default HostelInfoScreen;

const styles = StyleSheet.create({
  imageContainer: {
    margin: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "70%",
    height: "100%",
    resizeMode: "contain",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    right: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});
