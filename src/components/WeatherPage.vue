<!--<template>-->
<!--  <div>-->
<!--    <h1>Weather Information</h1>-->

<!--    <select v-model="selectedCity" @change="fetchWeather">-->
<!--      <option disabled value="">Select a recent city</option>-->
<!--      <option v-for="city in recentCities" :key="city">{{ city }}</option>-->
<!--    </select>-->

<!--    <input-->
<!--        v-model="newCity"-->
<!--        placeholder="Enter a city name"-->
<!--    />-->
<!--    <button @click="fetchWeather(newCity)">Fetch Weather</button>-->

<!--    <div v-if="weather">-->
<!--      <h2>Weather in {{ weather.name }}</h2>-->
<!--      <p>Temperature: {{ weather.main.temp }}°C</p>-->
<!--    </div>-->

<!--    <div v-if="weatherError">-->
<!--      <p>Error: {{ weatherError.message }}</p>-->
<!--    </div>-->

<!--    <div v-if="loading">-->
<!--      <p>Loading...</p>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import { defineComponent, ref, watchEffect } from 'vue';-->
<!--import {getWeather, weatherSearchResults$} from '@/services/weatherService';-->
<!--import {useWeatherStore} from '@/stores/WeatherStore';-->

<!--export default defineComponent({-->
<!--  setup() {-->
<!--    const weatherStore = useWeatherStore();-->
<!--    const newCity = ref('');-->
<!--    const selectedCity = ref('');-->
<!--    const weather = ref(null);-->
<!--    const weatherError = ref(null);-->
<!--    const loading = ref(false);-->

<!--    const fetchWeather = (city: string) => {-->
<!--      if (city) {-->
<!--        getWeather(city);-->
<!--        weatherStore.addCity(city);-->
<!--      }-->
<!--    };-->

<!--    watchEffect(() => {-->
<!--      const subscription = weatherSearchResults$.subscribe((result) => {-->
<!--        if (result?.error) {-->
<!--          weatherError.value = result;-->
<!--          weather.value = null;-->
<!--        } else {-->
<!--          weather.value = result;-->
<!--          weatherError.value = null;-->
<!--        }-->
<!--        loading.value = false;-->
<!--      });-->

<!--      return () => {-->
<!--        subscription.unsubscribe();-->
<!--      };-->
<!--    });-->

<!--    return {-->
<!--      newCity,-->
<!--      selectedCity,-->
<!--      weather,-->
<!--      weatherError,-->
<!--      loading,-->
<!--      recentCities: weatherStore.cities,-->
<!--      fetchWeather,-->
<!--    };-->
<!--  },-->
<!--});-->
<!--</script>-->



<template>
  <div>
    <h1>Weather Information</h1>
    <button @click="refreshAll" class="btn btn-primary">Refresh All Data</button>
    <input
        v-model="newCity"
        placeholder="Enter a new city name"
    />
    <button @click="addCity">Add City</button>
    <table class="table">
      <thead>
      <tr>
        <th>City</th>
        <th>Temperature</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="city in recentCities" :key="city">
        <td>{{ city }}</td>
        <td>{{ weatherData[city]?.main.temp }}°C</td>
        <td>
          <button @click="removeCity(city)" class="btn btn-danger">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="weatherError">
      <p>Error: {{ weatherError.message }}</p>
    </div>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div class="toast" v-if="showToast">
      <div class="toast-header">
        <strong class="mr-auto">Notification</strong>
        <button type="button" class="ml-2 mb-1 close" @click="hideToast">&times;</button>
      </div>
      <div class="toast-body">
        Data has been updated successfully.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { useWeatherStore } from '@/stores/WeatherStore';
import { getWeather, weatherSearchResults$ } from '@/services/weatherService';

export default defineComponent({
  setup() {
    const weatherStore = useWeatherStore();
    const newCity = ref('');
    const weatherData = ref(weatherStore.weatherData);
    const weatherError = ref(null);
    const loading = ref(false);
    const showToast = ref(false);

    const addCity = () => {
      try {
        weatherStore.addCity(newCity.value.trim());
        newCity.value = '';
      } catch (error) {
        weatherError.value = error;
      }
    };

    const removeCity = (city: string) => {
      weatherStore.removeCity(city);
    };

    const refreshAll = () => {
      weatherStore.cities.forEach((city) => {
        getWeather(city);
      });
      showToast.value = true;
    };

    const hideToast = () => {
      showToast.value = false;
    };

    watchEffect(() => {
      const subscription = weatherSearchResults$.subscribe((result) => {
        console.log('result', result);
        if (result?.error) {
          weatherError.value = result;
        } else {
          weatherStore.updateWeather(result.name, result);
          weatherError.value = null;
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    });

    return {
      newCity,
      weatherData,
      addCity,
      removeCity,
      refreshAll,
      weatherError,
      showToast,
      hideToast,
      recentCities: weatherStore.cities,
    };
  },
  created() {
    this.weatherStore.cities.forEach((city) => {
      getWeather(city);
    });
  },
  data() {
    return {
      weatherStore: useWeatherStore(),
    };
  }
});
</script>

