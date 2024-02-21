import React, { useLayoutEffect, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
  Button,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native'
import { auth, db } from '../Firebase'
import { signOut, getAuth, updatePassword } from 'firebase/auth'
import {
  addDoc,
  serverTimestamp,
  updateDoc, arrayUnion, collection, query, where, getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useUserContext } from '../UserContext'
import { doc, getDoc } from 'firebase/firestore'
import * as Font from 'expo-font'
import { FontAwesome5 } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'


const ProfileScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { userId } = useUserContext()
  const [userData, setUserData] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        Vivan: require('../assets/fonts/VinaSans-Regular.ttf'),
        Kdam: require('../assets/fonts/KdamThmorPro-Regular.ttf'),
        Bunge: require('../assets/fonts/BungeeShade-Regular.ttf'),
        Kanit: require('../assets/fonts/Kanit-Regular.ttf'),
      })
    }

    loadFont()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'User Profile',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Kanit',
      },
      headerStyle: {
        backgroundColor: '#0b1b32',
        height: 90,
        borderBottomColor: 'transparent',
        shadowColor: 'transparent',
      },
      headerLeft: () => (
        <Pressable
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate('Home')}
        >
          <MaterialIcons name='arrow-back' size={24} color='white' />
        </Pressable>
      ),
    })
  }, [navigation])

  useEffect(() => {
    const fetchReservationData = async (userId) => {
      try {
        const reservationsQuery = query(
          collection(db, "reservations"),
          where("userId", "==", userId)
        );
        const reservationsSnapshot = await getDocs(reservationsQuery);

        if (!reservationsSnapshot.empty) {
          const reservationDoc = reservationsSnapshot.docs[0];
          const reservationData = reservationDoc.data();
          setPaymentStatus(reservationData.payment_intent);
          setPrice(reservationData.price);
        } else {
          console.error("No matching reservation found for userId:", userId);
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error.message);
      }
    };

    fetchReservationData(userId);
  }, [userId]);

  const handleChangePassword = async () => {
    try {
      await updatePassword(auth.currentUser, newPassword)
      alert('Password updated successfully!')
      setIsModalVisible(false)
    } catch (error) {
      alert('Error updating password:', error.message)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        setUserData(userData)
      } else {
        alert('User document not found')
      }
    } catch (error) {
      alert('Error fetching user data:', error)
    }
  }

  const LogoutFunc = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Onboarding')
      })

      .catch(() => {
        alert('Error signing out:')
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e6e6e3' }}>
      <ScrollView style={styles.container} showVerticalScrollIndicator={false}>
        {userData && (
          <>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#0b1b32',
                padding: 20,
              }}
            >
              <Image style={styles.userImg} source={{ uri: userData?.image }} />
              <View style={{ flexDirection: 'column' }}>
                <View>
                  <Text
                    style={{
                      color: 'gray',
                      marginLeft: 20,
                      fontFamily: 'Kanit',
                      fontSize: 17,
                      marginTop: 10,
                      fontWeight: '100',
                    }}
                  >
                    Hello 
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      marginLeft: 26,
                      fontFamily: 'Kanit',
                      fontSize: 23,
                      marginTop: 2,
                    }}
                  >
                    {`${userData.firstName} ${userData.lastName}`}
                  </Text>
                  <Text
                      style={{
                        color: 'gray',
                        marginLeft: 26,
                        fontFamily: 'Kanit',
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      ( {userData.email} )
                    </Text>
                </View>
              </View>
              <View style={{ position: 'absolute', right: 14, bottom: '30%' }}>
              
                <Pressable onPress={() => navigation.navigate('Details')}>
                <FontAwesome5 name='user-edit' size={24} color='white' />
                </Pressable>
              </View>
            </View>
          </>
        )}

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 5,
            }}
            onPress={() => navigation.navigate('Details')}
          >
            <Text style={styles.userBtnTxt}>View and Edit Details</Text>
          </TouchableOpacity>
          <View style={{ position: 'absolute', right: 18, top: '20%' }}>
            <AntDesign name='right' size={24} color='#c9c9c3' />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 5,
            }}
            onPress={() => navigation.navigate('Saved')}
          >
            <Text style={styles.userBtnTxt}>Check Your Favorites</Text>
          </TouchableOpacity>
          <View style={{ position: 'absolute', right: 18, top: '20%' }}>
            <AntDesign name='right' size={24} color='#c9c9c3' />
          </View>
        </View>

        <View
  style={{
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    backgroundColor: 'white',
  }}
>
  <TouchableOpacity
  disabled={paymentStatus !== ''}
    style={{
      paddingVertical: 16,
      paddingHorizontal: 12,
      marginHorizontal: 5,
    }}
    onPress={() => navigation.navigate('Payment',{price})}
  >
    <Text style={{color: paymentStatus === '' ? 'black' : 'gray',
    fontFamily: 'Kanit',
    fontSize: 15,}}>Payment</Text>
    {paymentStatus === '' ? (
      <View
        style={{
          position: 'absolute',
          right: -10,
          top: 22
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: 'red',
          }}
        />
      </View>
    ): null}
  </TouchableOpacity>
  <View style={{ position: 'absolute', right: 18, top: '20%' }}>
    <AntDesign name='right' size={24} color='#c9c9c3' />
  </View>
</View>



        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 2,
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 5,
            }}
            onPress={() => navigation.navigate('Booking')}
          >
            <Text style={styles.userBtnTxt}>Check Your Bookings</Text>
          </TouchableOpacity>
          <View style={{ position: 'absolute', right: 18, top: '20%' }}>
            <AntDesign name='right' size={24} color='#c9c9c3' />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 5,
            }}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.userBtnTxt}>Change Password</Text>
          </TouchableOpacity>
          <View style={{ position: 'absolute', right: 18, top: '20%' }}>
            <AntDesign name='right' size={24} color='#c9c9c3' />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 5,
            }}
            onPress={() => navigation.navigate('Feedback')}
          >
            <Text style={styles.userBtnTxt}>Give us feedback</Text>
          </TouchableOpacity>
          <View style={{ position: 'absolute', right: 18, top: '20%' }}>
            <AntDesign name='right' size={24} color='#c9c9c3' />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 1,
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 5,
            }}
            onPress={() => navigation.navigate('Support')}
          >
            <Text style={styles.userBtnTxt}>Support</Text>
          </TouchableOpacity>
          <View style={{ position: 'absolute', right: 18, top: '20%' }}>
            <AntDesign name='right' size={24} color='#c9c9c3' />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 5,
            }}
            onPress={LogoutFunc}
          >
            <Text style={{ color: 'red', fontFamily: 'Kanit', fontSize: 17 }}>
              Sign Out
            </Text>
          </TouchableOpacity>
          <View style={{ position: 'absolute', right: 18, top: '20%' }}>
            <FontAwesome name='sign-out' size={25} color='red' />
          </View>
        </View>

        <Modal
          animationType='slide'
          transparent={true}
          visible={isModalVisible}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <View
              style={{
                backgroundColor: '#e6e4f5',
                padding: 20,
                borderRadius: 10,
                width: '80%',
              }}
            >
              <Text
                style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Kanit' }}
              >
                Enter New Password:
              </Text>
              <TextInput
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 10,
                  padding: 5,
                }}
                secureTextEntry
                onChangeText={(text) => setNewPassword(text)}
                value={newPassword}
              />
              <Pressable onPress={handleChangePassword}>
                <Text
                  style={{
                    color: 'white',
                    padding: 10,
                    backgroundColor: '#c90644',
                    marginBottom: 8,
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: 'Kanit',
                    fontWeight: 'bold',
                    paddingHorizontal: 20,
                    textAlign: 'center',
                  }}
                >
                  Change Password
                </Text>
              </Pressable>

              <Pressable onPress={() => setIsModalVisible(false)}>
                <Text
                  style={{
                    color: 'white',
                    padding: 10,
                    backgroundColor: '#c90644',
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: 'Kanit',
                    fontWeight: 'bold',
                    paddingHorizontal: 20,
                    textAlign: 'center',
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userImg: {
    height: 80,
    width: 80,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE61',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 14,
    fontWeight: '600',
    color: 'grey',
    textAlign: 'center',
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 30,
  },
  userBtn: {
    borderColor: 'red',
    borderWidth: 3,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    backgroundColor: 'red',
  },
  userBtnTxt: {
    color: 'black',
    fontFamily: 'Kanit',
    fontSize: 15,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
})