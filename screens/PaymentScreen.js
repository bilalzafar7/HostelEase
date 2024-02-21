import React, { useState, useRef,useEffect } from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Button,
} from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import { useUserContext } from "../UserContext";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  addDoc,
  serverTimestamp,
  updateDoc, arrayUnion, collection, query, where, getDocs,
  deleteDoc,
} from "firebase/firestore";

const PaymentScreen = () => {
    const navigation = useNavigation();
    const route = useRoute()
  const { userId } = useUserContext();
  const [name, setName] = useState('');
  const [cardDetails, setCardDetails] = useState();
  const [loading, setLoading] = useState(false);
  const alertRefs = useRef([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const { confirmPayment } = useConfirmPayment();

  

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.103:3000/payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: route.params.price * 100,
          }),
        },
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const { clientSecret } = await response.json();
  
      console.log('Client Secret:', clientSecret); // Print only the client secret
  
      return clientSecret;
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      return null;
    }
  };
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
        } else {
          console.error("No matching reservation found for userId:", userId);
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error.message);
      }
    };

    fetchReservationData(userId);
  }, [userId]);
  
  const handlePaymentSuccess = async (paymentIntent, userId) => {
    try {
      // Fetch reservation data
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('userId', '==', userId)
      );
      const reservationsSnapshot = await getDocs(reservationsQuery);
  
      if (!reservationsSnapshot.empty) {
        // Update the payment_intent in the Firebase document
        const reservationDoc = reservationsSnapshot.docs[0];
        const reservationRef = doc(db, 'reservations', reservationDoc.id);
  
        await updateDoc(reservationRef, {
          payment_intent: paymentIntent.id,
          price: route.params.price
        });
  
        // Handle any other post-payment success logic
        setIsConfirmed(true);
      } else {
        console.error('No matching reservation found for userId:', userId);
        alert('Error: No matching reservation found.');
      }
    } catch (error) {
      console.error('Error updating payment intent in Firebase:', error.message);
      alert('Payment succeeded, but there was an issue updating the reservation.');
    }
  };


  const handlePayment = async () => {
    try {
      setLoading(true);
  
      // Fetch client secret
      const clientSecret = await fetchPaymentIntentClientSecret();
  
      // Confirm the payment with the card details
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          card: {
            number: cardDetails?.complete && cardDetails?.number,
            expMonth: cardDetails?.complete && cardDetails?.expMonth,
            expYear: cardDetails?.complete && cardDetails?.expYear,
            cvc: cardDetails?.complete && cardDetails?.cvc,
          },
          billingDetails: {
            name: name,
            email: 'test@example.com', // Replace with the user's email
          },
        },
      });
  
      if (error) {
        // Handle payment error
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
      } else if (paymentIntent) {
        // Handle successful payment
        console.log('Payment intent details:', paymentIntent.id);
        handlePaymentSuccess(paymentIntent, userId);
        setIsConfirmed(true);
      }
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isConfirmed ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.cardDetailsView}>
            <Text style={styles.title}>Payment</Text>
            <Text style={styles.title1}>Hostel Price: {route.params.price}</Text>

            <CardField
              style={styles.cardForm}
              postalCodeEnabled={false}
              onCardChange={(cardDetails) => {
                if (cardDetails?.complete) {
                  setCardDetails(cardDetails);
                }
              }}
            />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text.trim())}
              placeholder="Enter cardholder name"
            />
            <Button
              title="Pay Now"
              onPress={handlePayment}
              disabled={!cardDetails?.complete || !name.trim() || loading}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.confirmationView}>
          <Text style={styles.confirmationText}>Payment Confirmed! </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetailsView: {
    width: '80%',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: 'darkblue',
    marginTop: 20,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  title1: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 5,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  cardForm: {
    height: 50,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  confirmationView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationText: {
    fontSize: 20,
    color: 'darkgreen',
    fontWeight: '600',
  },
});

export default PaymentScreen;
