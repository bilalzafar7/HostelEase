import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./StackNavigator";
import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import store from "./store";
import { UserProvider } from "./UserContext";
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    <>
    <StripeProvider publishableKey="pk_test_51OFjaQA2cWQHKq0dEEvIY2WmQE9502bPCIgOqzjBUAIzBxEIjCqaHI8B2dgkBdkKUK1f29wpftRCWR7RyFhPPXzk00JibjM8IS">
    <UserProvider>
        <Provider store={store}>
        <StackNavigator />
        <ModalPortal />
      </Provider>
      </UserProvider>
    </StripeProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
