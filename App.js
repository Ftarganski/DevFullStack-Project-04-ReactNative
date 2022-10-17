import { StyleSheet } from 'react-native';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  IconButton,
} from "@react-native-material/core";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useState, useEffect } from "react";
import { userIsLoggedIn, authLogout, reautenticate } from "./util/auth";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyDPPMgQ00pDc9C4GCSgdhOZBS7EoQse8NI",
  authDomain: "bike-clock.firebaseapp.com",
  projectId: "bike-clock",
  storageBucket: "bike-clock.appspot.com",
  messagingSenderId: "123734604851",
  appId: "1:123734604851:web:448e3f8bb6e042a07af746",
  measurementId: "G-MH2JEGYHSF"
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const verifyLogin = async () => {
    if (await userIsLoggedIn() !== null) {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    reautenticate(); 
    verifyLogin();
  }, [])

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let icon = "";
              switch (route.name) {
                case "Home":
                  icon = "home";
                  break;
                  s;
                case "Profile":
                  icon = "account";
                  break;
              }

              return <Icon name={icon} size={size} color={color} />;
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray",
          })}
          initialRouteName="Profile"
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              title: "Home",
              headerRight: () => (
                <IconButton
                  icon={(props) => <Icon name="logout" {...props} />}
                  color="primary"
                  onPress={() => {
                    authLogout();
                    setIsLoggedIn(false);
                  }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            initialParams={{
              firebaseApp,
            }}
            options={{
              title: "Perfil",
              headerRight: () => (
                <IconButton
                  icon={(props) => <Icon name="logout" {...props} />}
                  color="primary"
                  onPress={() => {
                    authLogout();
                    setIsLoggedIn(false);
                  }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
            initialParams={{
              setIsLoggedIn,
              firebaseApp,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
            initialParams={{
              setIsLoggedIn,
              firebaseApp,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});