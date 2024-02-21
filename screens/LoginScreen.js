import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, db  } from "../Firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { doc, getDoc } from 'firebase/firestore';
import { StackActions } from "@react-navigation/native";
import { useUserContext } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';




const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const { setUserContext } = useUserContext();

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


  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        setUserContext(userCredential.user.uid, {
          email: userCredential.user.email,
          gender: userData.gender,
          // Add other user details as needed
        });

        // Navigate to Welcome screen
        navigation.dispatch(StackActions.replace('Welcome'));
      }
    } catch (error) {
      alert("Wrong Email or Password:", error);
    }
  };
  


  

  const passvisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  
  function ForgetPass() {
    if (!isEmailValid(email)) {
      alert("Please enter a valid email address.");
    }
    else{
      sendPasswordResetEmail(auth, email)
  .then(() => {
    alert("Password reset email sent!");
  })
  .catch(() => {
    alert("Authentication error");
  });
    }
  }

  return (

    <ImageBackground
    source={require('../components/images/7a.jpg')} 
    style={styles.backgroundImage}
  >
    <SafeAreaView
      style={{
        flex: 1,
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 100,
          }}
        >
          <Text style={{ color: "orange", fontSize: 37,fontFamily:'Vivan' }}>
            Sign In
          </Text>

          <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "500", fontFamily:'Kdam' }}>
            Sign In to Your Account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "orange",fontFamily:'Kanit' }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your Email"
              placeholderTextColor={"black"}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                paddingVertical: 8,
                width: 300,
              }}
            ></TextInput>
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 17, fontWeight: "600", color: "orange",fontFamily:'Kanit' }}>
              Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                borderBottomColor: "gray",
                borderBottomWidth: 1,
              }}
            >
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!isPasswordVisible}  
                placeholder="Password"
                placeholderTextColor={"black"}
                style={{
                  fontSize: password ? 18 : 18,
                  paddingVertical: 8,
                  width: 270,
                }}
              ></TextInput>
              <Pressable style={{ marginTop: 9 }} onPress={passvisible}>
                {password ? (
                  <Entypo
                    name={isPasswordVisible ? "eye" : "eye-with-line"}
                    size={24}
                    color="black"
                  />
                ) : null}
              </Pressable>
            </View>
            <Pressable onPress={ForgetPass} style={{ marginVertical: 15 }}>
              <Text style={{ color: "orange", fontWeight: "600" ,fontFamily:'Kanit'}}>
                Forgot Password?
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={login}
          style={{
            width: 200,
            backgroundColor: "orange",
            padding: 15,
            borderRadius: 7,
            marginTop: 15,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 17,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Sign")}
          style={{ marginTop: 20 }}
        >
          <Text style={{ textAlign: "center", color: "grey", fontSize: 17 }}>
            Don't have an account?{" "}
            <Text style={{ color: "orange", fontWeight: "600" }}>Sign Up</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
