import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { auth, db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import * as Font from "expo-font";
import { useUserContext } from "../UserContext";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordValidationMessage, setPasswordValidationMessage] =useState("");
  const [phoneValidationMessage, setPhoneValidationMessage] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isCpasswordVisible, setIsCpasswordVisible] = useState(false);
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();
  const { setUserContext } = useUserContext();

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

  const register = () => {
    if (!isEmailValid(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!validateForm()) {
      return;
    }

    if (!isPasswordValid(password)) {
      setPasswordValidationMessage(
        "Password must contain a upper,lower case and a number"
      );
      return;
    } else {
      setPasswordValidationMessage("");
    }

    if (!isPhoneNumberValid(phone)) {
      setPhoneValidationMessage(
        "Please enter a valid phone number e.g '03xxxxxxxxx'."
      );
      return;
    } else {
      setPhoneValidationMessage("");
    }

    if (confirmPassword === password) {
      setConfirmPasswordError("");
    } else {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    if (
      email === "" ||
      password === "" ||
      phone === "" ||
      firstName === "" ||
      lastName === "" ||
      gender === ""
    ) {
      Alert.alert(
        "Invalid Details",
        "Please enter all Credentials",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          const uid = user.uid;

          setUserContext(uid, {
            email: email,
            gender: gender,
          });

          const userDocRef = doc(db, "users", uid);
          setDoc(userDocRef, {
            userId: uid,
            email: user.email,
            phone,
            firstName,
            lastName,
            gender,
          });

          sendEmailVerification(user)
        .then(() => {
          // Email sent successfully
          alert("Account created successfully. Please check your email for verification.");
          navigation.navigate("Welcome");
        })
        .catch((error) => {
          // Handle email verification error
          alert("Error sending email verification:", error);
        });
        })
        .catch((error) => {
          alert("Error registering:", error);
        });
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!gender) {
      setGenderError("Please select your gender");
      isValid = false;
    } else {
      setGenderError("");
    }
    return isValid;
  };

  const passvisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const Cpassvisible = () => {
    setIsCpasswordVisible((prev) => !prev);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    if (password.length < 6) {
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if (!/[a-z]/.test(password)) {
      return false;
    }
    if (!/\d/.test(password)) {
      return false;
    }
    return true;
  };

  const isPhoneNumberValid = (phone) => {
    const phoneRegex = /^03\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleLastNameChange = (text) => {
    if (/^[A-Za-z]+$/.test(text)) {
      setLastName(text);
      setLastNameError("");
    } else {
      setLastNameError("Name should contain only letters.");
    }
  };

  const handleFirstNameChange = (text) => {
    if (/^[A-Za-z]+$/.test(text)) {
      setFirstName(text);
      setFirstNameError("");
    } else {
      setFirstNameError("Name should contain only letters.");
    }
  };

  return (
    <ImageBackground
      source={require("../components/images/7a.jpg")}
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
              marginTop: 3,
            }}
          >
            <Text
              style={{
                color: "orange",
                fontSize: 17,
                fontSize: 37,
                fontFamily: "Vivan",
              }}
            >
              Register Yourself
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 18,
                fontWeight: "500",
                fontFamily: "Kdam",
              }}
            >
              Create a New Account
            </Text>
          </View>
          <View style={{ marginTop: 7 }}>
            <View style={{ flexDirection: "column" }}>
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: "orange",
                    fontFamily: "Kanit",
                  }}
                >
                  First Name
                </Text>
                <TextInput
                  value={firstName}
                  onChangeText={handleFirstNameChange}
                  placeholder="Enter First Name"
                  placeholderTextColor={"gray"}
                  style={{
                    fontSize: 14,
                    borderBottomColor: "gray",
                    borderBottomWidth: 1,
                    paddingVertical: 8,
                    width: 300,
                  }}
                ></TextInput>
                {firstNameError ? (
                  <Text style={{ color: "red", fontSize: 10 }}>
                    {firstNameError}
                  </Text>
                ) : null}
              </View>

              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: "orange",
                    fontFamily: "Kanit",
                  }}
                >
                  Last Name
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={handleLastNameChange}
                  placeholder="Enter Last Name"
                  placeholderTextColor={"gray"}
                  style={{
                    fontSize: 14,
                    borderBottomColor: "gray",
                    borderBottomWidth: 1,
                    paddingVertical: 8,
                    width: 300,
                  }}
                ></TextInput>
                {lastNameError ? (
                  <Text style={{ color: "red", fontSize: 10 }}>
                    {lastNameError}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "orange",
                  fontFamily: "Kanit",
                }}
              >
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Enter your Email"
                placeholderTextColor={"gray"}
                style={{
                  fontSize: email ? 14 : 14,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  paddingVertical: 8,
                  width: 300,
                }}
              ></TextInput>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "orange",
                  fontFamily: "Kanit",
                }}
              >
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
                  placeholderTextColor={"gray"}
                  style={{
                    fontSize: password ? 14 : 14,
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
              {passwordValidationMessage ? (
                <Text style={{ color: "red", fontSize: 10 }}>
                  {passwordValidationMessage}
                </Text>
              ) : null}
            </View>

            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "orange",
                  fontFamily: "Kanit",
                }}
              >
                Confirm Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                }}
              >
                <TextInput
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  secureTextEntry={!isCpasswordVisible}
                  placeholder="Password"
                  placeholderTextColor={"gray"}
                  style={{
                    fontSize: password ? 14 : 14,
                    paddingVertical: 8,
                    width: 270,
                  }}
                ></TextInput>
                <Pressable style={{ marginTop: 9 }} onPress={Cpassvisible}>
                  {confirmPassword ? (
                    <Entypo
                      name={isCpasswordVisible ? "eye" : "eye-with-line"}
                      size={24}
                      color="black"
                    />
                  ) : null}
                </Pressable>
              </View>
              {confirmPasswordError ? (
                <Text style={{ color: "red", fontSize: 10 }}>
                  {confirmPasswordError}
                </Text>
              ) : null}
            </View>

            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "orange",
                  fontFamily: "Kanit",
                }}
              >
                Phone No
              </Text>
              <TextInput
                value={phone}
                onChangeText={(text) => setPhone(text)}
                placeholder="Enter your Phone Number"
                placeholderTextColor={"gray"}
                style={{
                  fontSize: phone ? 14 : 14,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  paddingVertical: 8,
                  width: 300,
                }}
              ></TextInput>
            </View>
            {phoneValidationMessage ? (
              <Text style={{ color: "red", fontSize: 10 }}>
                {phoneValidationMessage}
              </Text>
            ) : null}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: "orange",
                marginBottom: 6,
                fontFamily: "Kanit",
              }}
            >
              Gender
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton
                  value="male"
                  status={gender === "male" ? "checked" : "unchecked"}
                  onPress={() => {
                    setGender("male");
                    setGenderError("");
                  }}
                  uncheckedColor="orange"
                  color="orange"
                />
                <Text style={{ marginRight: 20, fontFamily: "Kanit" }}>
                  Male
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton
                  value="female"
                  status={gender === "female" ? "checked" : "unchecked"}
                  onPress={() => {
                    setGender("female");
                    setGenderError("");
                  }}
                  uncheckedColor="orange"
                  color="orange"
                />
                <Text style={{ fontFamily: "Kanit" }}>Female</Text>
              </View>
            </View>
            {genderError ? (
              <Text style={{ color: "red", fontSize: 12 }}>{genderError}</Text>
            ) : null}
          </View>
          <Pressable
            onPress={register}
            style={{
              width: 200,
              backgroundColor: "orange",
              padding: 15,
              borderRadius: 7,
              marginTop: 13,
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
              Register
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "grey", fontSize: 17 }}>
              Already Have an Account?{" "}
              <Text style={{ color: "orange", fontWeight: "600" }}>
                Sign In
              </Text>
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
