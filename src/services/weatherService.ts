import {Subject, of, interval, from} from "rxjs";
import {debounceTime, switchMap, catchError, map, startWith, retry, filter} from "rxjs";
import axios from 'axios';

const searchSubject = new Subject<string>();
const autoRefresh$ = interval(2000);

export const weatherObservable = searchSubject.pipe(
    debounceTime(500),
    filter((city) => city.length >= 3),
    switchMap((city) => {
        console.log('Sending request for city ' + city);
        return autoRefresh$.pipe(
            startWith(0),
            switchMap(() =>
                from(
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=81592fd082211aafdeee651e9fc04176&units=metric&lang=ru`)
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