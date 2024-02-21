import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUserContext } from "../UserContext";
import * as Font from "expo-font";

const HostelCard = ({
  rooms,
  rent,
  person,
  property,
  availableRooms,
  availability,
  hostelId,
  place,
}) => {
  const { height, width } = Dimensions.get("window");

  const navigation = useNavigation();
  const route = useRoute();
  const { userId, userDetails } = useUserContext();
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

  return (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate("Info", {
            name: property.name,
            rating: property.rating,
            newPrice: property.newPrice,
            photos: property.photos,
            availableRooms: property.rooms,
            person: person,
            hostelId: property.id,
            place: route.params.place,
            services: property.services,
            address: property.address,
            image: property.image
          })
        }
        style={{
          marginHorizontal: 20,
          flexDirection: "row",
          backgroundColor: "#c90644",
          borderRadius: 20,
          margin:10
        }}
      >
        <View>
          <Image
            style={{
              height: height / 4,
              width: width - 220,
              borderRadius: 15,
              margin: 7,
            }}
            source={{ uri: property.image }}
          ></Image>
        </View>
        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text
              style={{
                width: 200,
                fontSize: 19,
                fontWeight: "bold",
                color: "orange",
                fontFamily: "Kanit",
              }}
            >
              {property.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 7,
              gap: 6,
            }}
          >
            <View
              style={{
                backgroundColor: "orange",
                padding: 4,
                borderRadius: 5,
                width: 80,
                paddingVertical: 3,
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

            <Text
              style={{
                fontSize: 15,
                color: "white",
                fontFamily: "Kanit",
                marginLeft: 7,
              }}
            >
              {property.rating}
            </Text>
            <MaterialIcons name="stars" size={20} color="orange" />
          </View>
          <Text
            style={{
              width: 160,
              marginTop: 20,
              color: "white",
              fontFamily: "Kanit",
              fontSize: 12,
            }}
          >
            {property.address.length > 50
              ? property.address.substr(0, 50)
              : property.address}
          </Text>
          <Text
            style={{
              marginTop: 15,
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "Kdam",
              color: "orange",
            }}
          >
            Price per Month{"  "}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                fontFamily: "Kdam",
                color: "white",
              }}
            >
              Rs{property.newPrice}
            </Text>
          </Text>
          
        </View>
      </Pressable>
    </View>
  );
};

export default HostelCard;

const styles = StyleSheet.create({});
