<template>
  <h4>{{ city }}</h4>
  <p>Temperature: {{ weather.main.temp }}°C</p>
  <p>Feels like: {{ weather.main.feels_like }}°C</p>
  <p>Min: {{ weather.main.temp_min }}°C, Max: {{ weather.main.temp_max }}°C</p>
  <p>Condition: {{ weather.weather[0].description }}</p>
  <p>Visibility: {{ weather.visibility }} meters</p>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    city: {
      type: String,
      required: true,
    },
    weather: {
      type: Object,
      required: false,
    },
  },
});
</script>
