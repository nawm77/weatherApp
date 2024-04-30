<template>
  <div>
    <h3>Weather Information</h3>
    <form @submit.prevent="handleSubmit">
      <input v-model="city" placeholder="Enter city name" />
      <button type="submit">Search</button>
    </form>
    <div v-if="weather">
      <h3>Погода в {{ weather.name }}</h3>
      <p>Температура {{ weather.main.temp }}°C</p>
      <p>Состояние: {{ weather.weather[0].description }}</p>
      <p>Видимость {{ weather.visibility }} метров</p>
    </div>
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { weatherObservable, searchWeather } from '@/services/weatherService';

export default defineComponent({
  setup() {
    const city = ref('');
    const weather = ref(null);
    const error = ref(null);
    const handleSubmit = () => {
      if (city.value.trim()) {
        searchWeather(city.value.trim());
      }
    };
    watchEffect(() => {
      const subscription = weatherObservable.subscribe({
        next: (data) => {
          console.log("Sent request")
          if (data.error) {
            error.value = data.message;
          } else {
            weather.value = data;
            error.value = null;
          }
        },
        error: (err) => {
          error.value = err.message;
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });

    return {
      city,
      weather,
      error,
      handleSubmit,
    };
  },
});
</script>
