// import { defineStore } from 'pinia';
// import { weatherSearchResults$, getWeather } from '../services/weatherService';
// import { ref, watchEffect } from 'vue';
// import { useStorage } from '@vueuse/core';
//
// export const useWeatherStore = defineStore('weather', {
//     state: () => ({
//         cities: useStorage<string[]>('recentCities', []),
//         weatherData: ref(null),
//         weatherError: ref(null),
//         loading: ref(false),
//     }),
//     actions: {
//         addCity(city: string) {
//             if (!this.cities.includes(city)) {
//                 this.cities.push(city);
//                 getWeather(city);
//             }
//         },
//
//         removeCity(city: string) {
//             const index = this.cities.indexOf(city);
//             if (index > -1) {
//                 this.cities.splice(index, 1);
//             }
//         },
//     },
// });


import { useStorage } from '@vueuse/core'; // Для персистентности данных
import { defineStore } from 'pinia';
import { weatherSearchResults$, getWeather } from '../services/weatherService';
import { ref } from 'vue';

export const useWeatherStore = defineStore('weather', {
    state: () => ({
        cities: useStorage<string[]>('recentCities', []), // Персистентный список городов
        weatherData: useStorage<Record<string, any>>('weatherData', {}), // Персистентное хранилище данных о погоде
        weatherError: ref(null),
        loading: ref(false),
    }),
    actions: {
        addCity(city: string) {
            if (!this.cities.includes(city)) {
                this.cities.push(city); // Добавляем новый город
                getWeather(city); // Запускаем запрос о погоде для нового города
            } else {
                throw new Error("City already exists"); // Валидация на уникальность
            }
        },
        removeCity(city: string) {
            const index = this.cities.indexOf(city);
            if (index > -1) {
                this.cities.splice(index, 1); // Удаляем город из списка
                delete this.weatherData[city]; // Удаляем данные о погоде для этого города
            }
        },
        updateWeather(city: string, data: any) {
            this.weatherData[city] = data; // Обновляем данные о погоде
        },
    },
});