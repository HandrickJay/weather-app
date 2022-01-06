
import { View, Dimensions, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Location from 'expo-location';
import {Fontisto} from "@expo/vector-icons";


const {width:SCREEN_WEDTH} = Dimensions.get("window");
const API_KEY = "";
const icons = {
  Clouds : "cloudy",
  Clear  : "day-sunny",
  Atmosphere : "cloudy-gusts",
  Snow   : "snows",
  Rain   : "rains",
  Drizzle: "rain",
  Thunderstorm : "lightnings", 
}
export default function App() {
   const [city, setCity] = useState("Loading..."); 
   const [days, setDays] = useState([]);
   const [ok, setOk] = useState(true);
   const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {coords:{latitude,longitude}} = await Location.getLastKnownPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      { useGoogleMaps: false}
    );
    setCity(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);  
  };
   useEffect(() => {
     getWeather();
   }, [])
  return (
    <View style={ styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
        <View style={{...styles.day, alignItems: "center"}}>
          <ActivityIndicator color="white" size="large" style={{marginTop:10}} />
        </View>
        ) : (
          days.map((day, index) =>
          <View key={index} style={styles.day}>
            <Text style={styles.tinyText}>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
            <View style = {{ 
              flexDirection : "row",
              alignItems : "center",
              width :"100%",
              justifyContent : "space-between",
              
              }}>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
            <Fontisto name={icons[day.weather[0].main]} size={65} color="black" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create ({
  container:{
    backgroundColor: "lemonchiffon" ,
    flex : 1,
  },
  city : {
    flex : 1.2,
    
    justifyContent : "center",
    alignItems : "center",
  },
  cityName : {
    fontSize : 70,
    fontWeight : "500",  
  },
  weather: {
    
    
    },
    tinyText : {
      fontSize : 20,
    },
  day : {
    width : SCREEN_WEDTH,
    flex : 1,
    alignItems : "left",
  },
  temp: {
    marginTop : 50,
    fontSize : 158,
    alignItems : "left",
  },
  description : {
    alignItems : "left",
    marginTop : -40,
    fontSize : 60,
  }
});