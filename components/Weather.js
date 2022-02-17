import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  FlatList,
  ToastAndroid,
} from "react-native";
import Search from "./Search";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Weather({ weatherData, fetchWeatherData }) {
  const {
    weather,
    name,
    main: { temp },
  } = weatherData;
  const [{ main }] = weather;

  const favItem = { location: name, temperature: Math.round(temp) };

  const [favorites, setFavorites] = useState([]);

  const getfavorites = async () => {
    //get from async
    await AsyncStorage.getItem("favs")
      .then(async (req) => {
        console.log("Found favs", req);

        if (req !== null) setFavorites(JSON.parse(req));
      })
      .catch((error) => console.log("error getting favs!", error));
  };

  const addFavorite = async () => {
    //check if item already exists
    function containsObject(obj) {
      var i;
      for (i = 0; i < favorites.length; i++) {
        if (favorites[i].location === obj.location) {
          favorites[i] = obj;
          return true;
        }
      }
      return false;
    }

    if (!containsObject(favItem)) {
      favorites.push(favItem);
      ToastAndroid.show(name + " added to favorites", ToastAndroid.SHORT);
    }

    await AsyncStorage.setItem("favs", JSON.stringify(favorites));
    getfavorites();
    //setfavs
    console.log(favorites);
  };

  const condition = weatherData.weather[0].description;
  console.log(condition);
  //Set Location's current Weather background image and description
  let weatherImage = require("../assets/forest_sunny.png");
  let weatherBgColor = "#47AB2F";
  let weatherDescription = "SUNNY";
  let barColor = "#ffd5a0";

  if (condition === "Clear") {
    weatherImage = require("../assets/forest_sunny.png");
    weatherBgColor = "#47AB2F";
    weatherDescription = "SUNNY";
    barColor = "#ffd5a0";
  } else if (condition === "Clouds") {
    weatherImage = require("../assets/forest_cloudy.png");
    weatherBgColor = "#54717A";
    weatherDescription = "CLOUDY";
    barColor = "#5f8498";
  } else if (condition === "Rain") {
    weatherImage = require("../assets/forest_rainy.png");
    weatherBgColor = "#57575DF";
    weatherDescription = "RAINY";
    barColor = "#757575";
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderItemStyle}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 18 }}>{item.location}</Text>
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            {item.temperature}°
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getfavorites();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor={barColor} />

      <View style={{ flex: 1 }}>
        <ImageBackground
          resizeMode="stretch"
          style={{
            flex: 1,
          }}
          source={weatherImage}
        >
          <View style={{ alignItems: "center" }}>
            <Search fetchWeatherData={fetchWeatherData} />
            <View style={styles.searchBarstyle}>
              <Text style={styles.title}>{name}</Text>
              <TouchableOpacity>
                <FontAwesome
                  name="heart"
                  size={28}
                  color="red"
                  backgroundColor="red"
                  onPress={addFavorite}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 50 }}>
              <Text
                style={{ fontSize: 60, fontWeight: "bold", color: "white" }}
              >
                {Math.round(temp)}°
              </Text>
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "white" }}
              >
                {weatherDescription}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          backgroundColor: weatherBgColor,
          color: "white",
        }}
      >
        Favorite Locations
      </Text>
      <View style={{ flex: 1, backgroundColor: weatherBgColor }}>
        <FlatList data={favorites} renderItem={renderItem} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#e96e50",
    marginRight: 15,
  },
  renderItemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    alignItems: "center",
  },
  searchBarstyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
