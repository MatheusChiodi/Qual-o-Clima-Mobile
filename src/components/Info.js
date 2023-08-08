import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from 'expo-location';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const API_KEY = '0c95d4848d68a7a010913606d5195afe';
const CITY_NAME = 'ARARAQUARA';

import Sun from '../assets/01d.svg';
import Sun02d from '../assets/01n.svg';

export function Info() {
  const [weatherData, setWeatherData] = useState(0);
  const [weatherDataMax, setWeatherDataMax] = useState(0);
  const [weatherDataMin, setWeatherDataMin] = useState(0);
  const [forecastData, setForecastData] = useState([]);

  const [lat, setLatitude] = useState(-21.7946);
  const [log, setLongitude] = useState(-48.1758);

  useEffect(() => {
    const fetchData = async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status === 'granted') {
        try {
          const location = await getCurrentPositionAsync();
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);

          fetchWeatherData(); // Agora que temos as coordenadas, buscamos os dados climáticos
        } catch (error) {
          console.error('Erro ao obter a localização:', error);
        }
      }
    };

    fetchData();

    const fetchForecastData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${log}&appid=${API_KEY}`
        );

        const forecastList = response.data.list;

        // Agrupar os dados da previsão por dia
        const groupedForecastData = forecastList.reduce((result, item) => {
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleDateString();

          if (!result[day]) {
            result[day] = {
              dateTime: date,
              temperatures: [],
            };
          }

          result[day].temperatures.push(item.main.temp - 273.15);
          return result;
        }, {});

        // Calcular a temperatura máxima e mínima para cada dia
        const processedForecastData = Object.values(groupedForecastData).map(
          (dayData) => {
            const maxTemp = Math.max(...dayData.temperatures);
            const minTemp = Math.min(...dayData.temperatures);

            return {
              dateTime: dayData.dateTime,
              temperatureMax: maxTemp,
              temperatureMin: minTemp,
            };
          }
        );

        setForecastData(processedForecastData);
      } catch (error) {
        console.error('Erro ao buscar dados de previsão:', error);
      }
    };

    fetchForecastData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${API_KEY}`
      );
      const temperatureCelsius = response.data.main.temp - 273.15;
      setWeatherData(temperatureCelsius);

      const temperatureCelsiusMax = response.data.main.temp_max - 273.15;
      setWeatherDataMax(temperatureCelsiusMax);

      const temperatureCelsiusMin = response.data.main.temp_min - 273.15;
      setWeatherDataMin(temperatureCelsiusMin);
    } catch (error) {
      console.error('Erro ao buscar dados de clima:', error);
    }
  };

  function renderSunIcon() {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 6 && hours < 18) {
      return <Sun width={200} height={200} />;
    } else {
      return <Sun02d width={200} height={200} />;
    }
  }

  return (
    <View style={styles.info}>
      {weatherData !== 0 && (
        <>
          {renderSunIcon()}
          <Text style={styles.infoText}>{weatherData.toFixed()}°C</Text>
        </>
      )}
      <View style={styles.containerForecast}>
        {forecastData.length > 0 && (
          <View>
            <Text style={styles.forecastTitle}>
              Previsão para os próximos dias:
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 16 }}
              showsHorizontalScrollIndicator={false}
              style={styles.scrollForest}
            >
              {forecastData.map((item, index) => {
                const day = item.dateTime.getDate();
                const month = item.dateTime.getMonth() + 1; // Os meses em JavaScript começam em 0
                const year = item.dateTime.getFullYear();

                // pega a data atual
                const date = new Date();
                const dayNow = date.getDate();

                if (day > dayNow) {
                  return (
                    <View key={index} style={styles.forecastCard}>
                      <Text
                        style={styles.cardDate}
                      >{`${day}/${month}/${year}`}</Text>
                      <Text style={styles.cardTemp}>
                        Max: {item.temperatureMax.toFixed()}ºC
                      </Text>
                      <Text style={styles.cardTemp}>
                        Min: {item.temperatureMin.toFixed()}ºC
                      </Text>
                    </View>
                  );
                }
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    paddingVertical: 70,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoImg: {
    width: 230,
    height: 230,
  },
  infoText: {
    fontSize: 100,
    fontWeight: '300',
    color: '#FFF',
  },
  infoTextMaxMin: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  containerForecast: {
    marginTop: 10,
    height: 320,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 20,
    width: '100%',
    textAlign: 'center',
  },
  forecastText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFF',
    marginTop: 5,
  },
  scrollForest: {
    width: 390,
    marginRight: 15,
  },
  forecastCard: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  cardDate: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFF',
  },
  cardTemp: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFF',
  },
});

export default Info;
