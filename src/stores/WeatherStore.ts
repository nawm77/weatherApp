import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
import { searchWeather } from '../services/weatherService';

export const useWeatherStore = defineStore('weather', {
    state: () => ({
        cities: useStorage<string[]>('cities', []),
        weatherData: ref<Record<string, any>>({})
    }),
    actions: {
        addCity(city: string) {
            if (!this.cities.includes(city)) {
                this.cities.push(city);
                console.log("Add city: " + city);
                console.log("All cities " + this.cities)
                console.log("All data " + this.weatherData)
                searchWeather(city);
            } else {
                throw new Error("City already exists");
            }
        },
        removeCity(city: string) {
            const index = this.cities.indexOf(city);
            if (index > -1) {
                this.cities.splice(index, 1);
                delete this.weatherData[city];
            }
        },
        updateWeatherData(city: string, data: any) {
            console.log("Data " + data + " for city " + city);
            this.weatherData[city] = data;
        },
    },
});
