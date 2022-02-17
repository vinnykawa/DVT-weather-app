import "react-native-gesture-handler";

import * as React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Import Custom Sidebar
import CustomSidebarMenu from "./CustomSidebarMenu";
import CurrentScreen from "./screens/currentWeather";
import LocationScreen from "./screens/locations";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png",
          }}
          style={{ width: 25, height: 25, marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

function CurrentWeatherScreenStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Current weather">
      <Stack.Screen
        name="Current weather"
        component={CurrentScreen}
        options={{
          headerShown: false, //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: "#f4511e", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

function LocationScreenStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Locations"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#f4511e", //Set Header color
        },
        headerTintColor: "#fff", //Set Header text color
        headerTitleStyle: {
          fontWeight: "bold", //Set Header text style
        },
      }}
    >
      <Stack.Screen
        name="SecondPage"
        component={LocationScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        // For setting Custom Sidebar Menu
        drawerContent={(props) => <CustomSidebarMenu {...props} />}
      >
        <Drawer.Screen
          name="Current Weather"
          options={{
            drawerLabel: "Current Weather",
            // Section/Group Name
            groupName: "My Location",
            activeTintColor: "#e91e63",
            headerShown: false,
          }}
          component={CurrentWeatherScreenStack}
        />
        <Drawer.Screen
          name="Locations"
          options={{
            drawerLabel: "Locations",
            // Section/Group Name
            groupName: "Other locations",
            activeTintColor: "#e91e63",
            headerShown: false,
          }}
          component={LocationScreenStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
