<template>
  <div>
    <h3>Weather Information for Selected City</h3>
    <SelectComponent
        v-model="selectedCity"
        :options="cities"
        :selected-city="selectedCity"
        @change="fetchWeather"
    />
    <InputWithButton
        :placeholder="'Enter new city name'"
        :buttonText="'Add City'"
        @click="handleAddCity"
    />

    <div v-if="weatherData[selectedCity]">
      <WeatherComponent :city="selectedCity" :weather="weatherData[selectedCity]"/>
    </div>

    <div v-else>
      <LoadingComponent :message="'Loading weather data...'"/>
    </div>
    <button @click="removeCity(selectedCity.toString())" class="btn btn-outline-danger">Delete current city</button>
    <ErrorComponent v-if="error" :message="error" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useWeatherStore } from '@/stores/WeatherStore';
import { weatherObservable, searchWeather } from '@/services/weatherService';
import ErrorComponent from "@/components/ErrorComponent.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import WeatherComponent from "@/components/WeatherComponent.vue";
import SelectComponent from "@/components/SelectComponent.vue";

export default defineComponent({
  components: {SelectComponent, WeatherComponent, LoadingComponent, ErrorComponent},
  setup() {
    const weatherStore = useWeatherStore();
    const newCity = ref('');
    const error = ref(null);
    const selectedCity = ref(weatherStore.cities[0]);
    const subscription = weatherObservable.subscribe({
      next: (data) => {
        if (data.error) {
          error.value = data.message;
          this.showMessage(error.value)
        } else {
          weatherStore.updateWeatherData(data.name, data);
          error.value = null;
        }
      },
      error: (err) => {
        this.showMessage(error.value)
        error.value = err.message;
      },
    });
    const handleAddCity = (cityName: string) => {
      try {
        const trimmedCity = cityName.trim();
        weatherStore.addCity(trimmedCity);
        searchWeather(trimmedCity);
        selectedCity.value = trimmedCity;
      } catch (e) {
        error.value = e.message
        this.showMessage(error.value)
      }
    }
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
      handleAddCity,
      removeCity,
      cities: weatherStore.cities,
      selectedCity,
      fetchWeather,
      weatherData: weatherStore.weatherData,
    };
  },
  methods: {
    showMessage(message: string) {
      this.$flashMessage.show({
        type: 'error',
        title: 'Error',
        text: message
      });
    }
  }
});
</script>