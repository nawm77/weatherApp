<template>
  <div>
    <h3>Weather Information for Cities</h3>
    <input
        v-model="newCity"
        placeholder="Enter city name"
    />
    <button @click="addCity">Add City</button>
    <ul>
      <li v-for="city in cities">
        <h4>{{ city }}</h4>
        <div v-if="weatherData[city]">
          <p>Температура: {{ weatherData[city].main.temp }}°C</p>
          <p>Ощущается как: {{ weatherData[city].main.feels_like }}°C</p>
          <p>Минимальная: {{ weatherData[city].main.temp_min }}°C</p>
          <p>Максимальная: {{ weatherData[city].main.temp_max }}°C</p>
          <p>Состояние: {{ weatherData[city].weather[0].description }}</p>
          <p>Видимость: {{ weatherData[city].visibility }} метров</p>
        </div>
        <div v-else>
          <p>Loading weather data...</p>
        </div>
        <button @click="removeCity(city)" class="btn-primary">Remove</button>
      </li>
    </ul>
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import { weatherObservable, searchWeather } from '@/services/weatherService';
import { useWeatherStore } from '@/stores/WeatherStore';

export default defineComponent({
  setup() {
    const weatherStore = useWeatherStore();
    const newCity = ref('');
    const error = ref(null);
    const subscription = weatherObservable.subscribe({
      next: (data) => {
        if (data.error) {
          error.value = data.message;
        } else {
          console.log("Update weather data for " + data.name)
          weatherStore.updateWeatherData(data.name, data);
          error.value = null;
        }
      },
      error: (err) => {
        error.value = err.message;
      },
    });
    const addCity = () => {
      try {
        weatherStore.addCity(newCity.value.trim());
        searchWeather(newCity.value.trim());
        newCity.value = '';
      } catch (e) {
        error.value = e.message;
      }
    };
    const removeCity = (city: string) => {
      weatherStore.removeCity(city);
    };
    const fetchData = () => {
      weatherStore.cities.forEach((c) => {
        searchWeather(c);
      });
    }

    onMounted(() => {
      weatherStore.cities.forEach((c) => {
        console.log("Subscribe " + c)
        searchWeather(c);
      });
    });
    onUnmounted(() => {
      subscription.unsubscribe();
    })

    return {
      weatherStore,
      newCity,
      weatherData: weatherStore.weatherData,
      error,
      addCity,
      removeCity,
      cities: weatherStore.cities,
    };
  },
});
</script>
