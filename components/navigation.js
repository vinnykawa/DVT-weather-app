import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CurrentScreen from "../screens/currentWeather";
import LocationScreen from "../screens/locations";

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Current">
        <Stack.Screen name="Home" component={MyDrawer} />
        <Stack.Screen name="Current" component={CurrentScreen} />
        <Stack.Screen name="Locations" component={LocationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Current Weather" component={CurrentScreen} />
      <Drawer.Screen name="Locations" component={LocationScreen} />
    </Drawer.Navigator>
  );
}
