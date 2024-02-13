import { StyleSheet } from "react-native";
import {  Provider } from "react-native-paper";
import Decrypt from "./Decrypt";
import Encrypt from "./Encrypt";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Provider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Encrypt"
          labelStyle={{ fontSize: 12 }}
          activeColor="#FFFFFF"
          // barStyle={{ backgroundColor: '#FFFFFF' }}
        >
          <Tab.Screen
            name="Encrypt"
            component={Encrypt}
            options={{
              tabBarLabel: "Encrypt",
              title: "Encrypt Tab",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="zip-box"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Decrypt"
            component={Decrypt}
            options={{
              tabBarLabel: "Decrypt",
              title: "Decrypt Tab",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="eye-circle"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
