import {catchError, debounceTime, filter, from, interval, map, of, retry, startWith, Subject, switchMap} from "rxjs";
import axios from 'axios';

const searchSubject = new Subject<string>();
const autoRefresh$ = interval(1000);

export const weatherObservable = searchSubject.pipe(
    debounceTime(500),
    filter((city) => city.length >= 3),
    switchMap((city) => {
        console.log('Sending request for city ' + city);
        return autoRefresh$.pipe(
            startWith(0),
            switchMap(() =>
                from(
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6a894d1090603dd16941ed17f1d98b5a&units=metric&lang=ru`)
                ).pipe(
                    map((response) => response.data),
                    catchError((error) => of({ error: true, message: error.response?.data?.message || 'An unexpected error occurred' })),
                    retry(3)
                )
            )
        );
    })
);
export const searchWeather = (city: string) => {
    searchSubject.next(city)
}