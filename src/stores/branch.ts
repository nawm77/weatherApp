import { defineStore } from 'pinia';
import { BehaviorSubject, Subject, catchError, switchMap, of } from 'rxjs';
import axios from 'axios';

export const useWeatherStore = defineStore('weather', {
    state: () => ({
        weatherData$: new BehaviorSubject<Record<string, any> | null>(null),
        error$: new Subject<{ code: string; message: string } | null>(),
    }),
    actions: {
        fetchWeather(city: string) {
            const apiKey = '3ab8b52a616d15824669aebf7e25cdf0';
            const weatherRequest$ = new Subject<string>();
            weatherRequest$
                .pipe(
                    switchMap((city) =>
                        axios
                            .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
                            .then((response) => response.data)
                            .catch((error) => {
                                this.error$.next({ code: 'ERROR', message: error.message });
                                return of(null);
                            })
                    )
                )
                .subscribe((data) => {
                    this.weatherData$.next(data);
                });
            weatherRequest$.next(city);
        },
    },
});
