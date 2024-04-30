<template>
  <div>
    <h3>Weather Information for Selected City</h3>
    <select v-model="selectedCity" @change="fetchWeather" class="form-select" style="margin-top: 20px; margin-bottom: 20px">
      <option v-for="city in cities" :key="city" :value="city">
        {{ city }}
      </option>
    </select>
    <input
        v-model="newCity"
        placeholder="Enter new city name"
        class="form-control"
    />
    <button @click="addCity" class="btn btn-outline-primary" style="margin-top: 20px; margin-bottom: 20px">Add City</button>

    <div v-if="weatherData[selectedCity]">
      <h4>{{ selectedCity }}</h4>
      <p>Температура: {{ weatherData[selectedCity].main.temp }}°C</p>
      <p>Ощущается как: {{ weatherData[selectedCity].main.feels_like }}°C</p>
      <p>Минимальная: {{ weatherData[selectedCity].main.temp_min }}°C</p>
      <p>Максимальная: {{ weatherData[selectedCity].main.temp_max }}°C</p>
      <p>Состояние: {{ weatherData[selectedCity].weather[0].description }}</p>
      <p>Видимость: {{ weatherData[selectedCity].visibility }} метров</p>
      <button @click="removeCity(selectedCity.toString())" class="btn btn-outline-danger">Delete current city</button>
    </div>

    <div v-else>
      <p>Loading weather data...</p>
    </div>
    <div v-if="error" class="alert alert-danger">
      <p>Error: {{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useWeatherStore } from '@/stores/WeatherStore';
import { weatherObservable, searchWeather } from '@/services/weatherService';

export default defineComponent({
  setup() {
    const weatherStore = useWeatherStore();
    const newCity = ref('');
    const error = ref(null);
    const selectedCity = ref(weatherStore.cities[0]);
    const subscription = weatherObservable.subscribe({
      next: (data) => {
        if (data.error) {
          error.value = data.message;
        } else {
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

    const fetchWeather = () => {
      searchWeather(selectedCity.value);
    };

    onMounted(() => {
      fetchWeather();
    });

    onUnmounted(() => {
      subscription.unsubscribe();
    });

    return {
      newCity,
      error,
      addCity,
      removeCity,
      cities: weatherStore.cities,
      selectedCity,
      fetchWeather,
      weatherData: weatherStore.weatherData,
    };
  },
});
</script>
