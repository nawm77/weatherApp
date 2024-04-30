import {Subject, interval, from, of} from 'rxjs';
import { debounceTime, switchMap, catchError, map, startWith, retry, distinctUntilChanged, filter } from 'rxjs/operators';
import axios from 'axios';

const API_KEY = '81592fd082211aafdeee651e9fc04176';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const searchSubject = new Subject<string>();

const autoRefresh$ = interval(2000);

export const weatherSearchResults$ = searchSubject.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    filter((city) => city.length >= 3),
    switchMap((city) => {
        console.log(`Sending request for weather in city ${city}`)
        return autoRefresh$.pipe(
            startWith(0),
            switchMap(() =>
                from(axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ru`)).pipe(
                    map((response) => response.data),
                    catchError((error) => {
                        return of({ error: true, message: error.response?.data?.message || "An unexpected error occurred" });
                    }),
                    retry(3)
                )
            )
        );
    })
);

export const getWeather = (city: string) => {
    searchSubject.next(city);
};
