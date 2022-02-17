import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ImageBackground,
  StatusBar,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import { NavigationDrawerStructure } from "../App";

const openWeatherKey = `8e62b436f4aee9bbb341843a666409ba`;

export default function CurrentScreen({ navigation }) {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const loadForecast = async () => {
    //check permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    //get current location
    let location = await Location.getCurrentPositionAsync({});
    //console.log(location);
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;

    //fetch current weather data
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherKey}`
      );
      const data = await response.json();

      if (!response.ok) {
        Alert.alert(`Error retrieving weather data: ${data.message}`);
      } else {
        setCurrentWeather(data);
      }
    } catch (error) {
      console.error(error);
    }

    //fetch next 5 days forecast
    try {
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherKey}`
      );
      const forecastData = await forecastResponse.json();

      if (!forecastResponse.ok) {
        Alert.alert(`Error retrieving weather data: ${forecastData.message}`);
      } else {
        setForecast(forecastData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  //console.log(currentWeather);
  console.log(forecast);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  } else {
    const currentTemp = Math.round(currentWeather.main.temp);
    const maxTemp = Math.round(currentWeather.main.temp_max);
    const minTemp = Math.round(currentWeather.main.temp_min);
    const description = currentWeather.weather[0].main;

    const listData = [];

    //get days
    const forecastList = forecast.list.map((d) => {
      var dt = new Date(d.dt * 1000);
      var dayMaxTemp = Math.round(d.main.temp_max);

      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      //get current day
      var t = new Date();
      var today = days[t.getDay()];

      var dayName = days[dt.getDay()];
      // console.log(dayName);

      const item = { day: dayName, temp: dayMaxTemp };

      //check if item already exists
      function containsObject(obj) {
        var i;
        for (i = 0; i < listData.length; i++) {
          if (listData[i].day === obj.day) {
            listData[i] = obj;
            return true;
          }
        }

        return false;
      }

      if (!containsObject(item) && item.day != today) {
        listData.push(item);
      }

      console.log(listData);
      console.log(dayMaxTemp);
    });

    //Set current Weather background image and description
    let weatherImage = require("../assets/forest_sunny.png");
    let weatherBgColor = "#47AB2F";
    let weatherDescription = "SUNNY";
    let barColor = "#ffd5a0";

    if (description === "Clear") {
      weatherImage = require("../assets/forest_sunny.png");
      weatherBgColor = "#47AB2F";
      weatherDescription = "SUNNY";
      barColor = "#ffd5a0";
    } else if (description === "Clouds") {
      weatherImage = require("../assets/forest_cloudy.png");
      weatherBgColor = "#54717A";
      weatherDescription = "CLOUDY";
      barColor = "#5f8498";
    } else if (description === "Rain") {
      weatherImage = require("../assets/forest_rainy.png");
      weatherBgColor = "#57575DF";
      weatherDescription = "RAINY";
      barColor = "#757575";
    }

    const renderItem = ({ item }) => {
      let listWeatherIcon = require("../assets/clear.png");

      const dailyCondition = forecast.list.map((c) => {
        var conditionDesc = c.weather[0].main;
        console.log(conditionDesc);

        //set list item icons
        if (conditionDesc === "Clear") {
          listWeatherIcon = require("../assets/clear.png");
        } else if (conditionDesc === "Clouds") {
          listWeatherIcon = require("../assets/partlysunny.png");
        } else if (conditionDesc === "Rain") {
          listWeatherIcon = require("../assets/rain.png");
        }
      });

      return (
        <View style={styles.renderitemStyle}>
          <View style={{ flex: 1 }}>
            <Text style={{ flex: 0, color: "white", fontSize: 18 }}>
              {item.day}
            </Text>
          </View>
          <Image
            resizeMode="contain"
            source={listWeatherIcon}
            style={{ height: 40, width: 40 }}
          />
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
              }}
            >
              {item.temp}°
            </Text>
          </View>
        </View>
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor={barColor} />

        <ImageBackground
          resizeMode="stretch"
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: weatherBgColor,
          }}
          source={weatherImage}
        >
          <View style={{ alignSelf: "flex-start", marginTop: -40 }}>
            <NavigationDrawerStructure navigationProps={navigation} />
          </View>
          <View style={{ marginBottom: 50 }}>
            <Text style={{ fontSize: 60, fontWeight: "bold", color: "white" }}>
              {currentTemp}°
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              {weatherDescription}
            </Text>
          </View>
        </ImageBackground>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: weatherBgColor,
            padding: 5,
            paddingHorizontal: 20,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "column", alignContent: "center" }}>
            <Text style={styles.currentTemps}>{minTemp}°</Text>
            <Text style={styles.currentTempsTxt}>min</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.currentTemps}>{currentTemp}°</Text>
            <Text style={styles.currentTempsTxt}>Current</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.currentTemps}>{maxTemp}°</Text>
            <Text style={styles.currentTempsTxt}>max</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: "white" }}></View>

        <View style={{ flex: 1, backgroundColor: weatherBgColor }}>
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  loading: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  renderitemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    alignItems: "center",
  },
  currentTemps: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  currentTempsTxt: {
    color: "white",
    fontSize: 18,
  },
});
