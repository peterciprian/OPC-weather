import { Component } from '@angular/core';
import { BehaviorSubject, catchError, merge, of, switchMap, tap, throwError } from 'rxjs';
import { APIservice, DailyEntity, DailyWeatherData, HourlyEntity, HourlyWeatherData } from './services/APIservice';
import { findLastIndex } from './services/util';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'OPC-weather';

    public isHourlyData$ = new BehaviorSubject(false);
    public location$ = new BehaviorSubject('');
    public latLon$ = new BehaviorSubject({ lat: 0, lon: 0, name : '' });
    public dailyWeatherData: DailyEntity[] = [];
    public hourlyWeatherData: HourlyEntity[] = [];
    public locations: Array<any> = [];

    constructor(public _api: APIservice) {
        this.location$.subscribe(val => this.handle(this.location$.value));

    }

    public handle(location: string) {
        if (location) {
            this._api.getCoordinates(location).pipe(
                catchError(error => {
                    return throwError(new Error(error));
                }),
                tap(coordinates => this.latLon$.next({ lat: coordinates[0].lat, lon: coordinates[0].lon, name: coordinates[0].name })),
                switchMap(coordinates => {
                    return merge(this._api.getHourlyWeatherData(coordinates[0].lat, coordinates[0].lon), this._api.getDailyWeatherData(coordinates[0].lat, coordinates[0].lon))
                }),
                catchError(errorToken => {
                    return throwError(new Error(errorToken));
                }),
            ).subscribe(
                weatherData => {
                    if (weatherData == null) return
                    if (weatherData!.hasOwnProperty('daily')) {
                        this.dailyWeatherData = (weatherData as DailyWeatherData).daily.filter((day, index) => { if (index < 7) { return day } });
                    } else if (weatherData!.hasOwnProperty('hourly')) {
                        this.hourlyWeatherData = (weatherData as HourlyWeatherData).hourly.filter((hour, index) => { if (index % 3 == 0 && index < 24) { return hour } });
                    }
                },
                anyError => {
                    console.error(anyError);
                },
                () => {
                    this.locations.push({location: this.latLon$.value.name, daily: this.dailyWeatherData, hourly: this.hourlyWeatherData})
                    this.locations = this.locations.filter((v,i,a)=>findLastIndex(a, v2=>(v2.location===v.location))===i)
                }
            )
        }
    }

    public handleToggle(event: any) {
        this.isHourlyData$.next(event.value)
    }
}
