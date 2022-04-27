import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Coordinates {
    name: string,
    lat: number,
    lon: number,
    country: string
}

export interface DailyWeatherData {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    daily: (DailyEntity)[];
  }
  export interface DailyEntity {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: Temp;
    feels_like: FeelsLike;
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: (WeatherEntity)[];
    clouds: number;
    pop: number;
    rain?: number | null;
    uvi: number;
  }
  export interface Temp {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  }
  export interface FeelsLike {
    day: number;
    night: number;
    eve: number;
    morn: number;
  }
  export interface WeatherEntity {
    id: number;
    main: string;
    description: string;
    icon: string;
  }

export interface HourlyWeatherData {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    hourly: (HourlyEntity)[];
  }
  export interface HourlyEntity {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: (WeatherEntity)[];
    pop: number;
    rain?: Rain | null;
  }
  export interface Rain {
    '1h': number;
  }


@Injectable({ providedIn: 'root' })
export class APIservice {
    constructor(private httpClient: HttpClient) { }

    public getCoordinates(query: string, limit: number = 5): Observable<Coordinates[]> {
        return this.httpClient.get<Coordinates[]>(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${environment.openWeather_API_key}`);
    }

    public getCurrentWeather(location: string = 'Hegyesd'): Observable<Object> {
        return this.httpClient.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${environment.openWeather_API_key}`);
    }

    public getWeather(lat: number, lon: number, exclude: string): Observable<Object> {
        return this.httpClient.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${environment.openWeather_API_key}`);
    }

    public getHourlyWeatherData(lat: number, lon: number): Observable<HourlyWeatherData> {
        return this.httpClient.get<HourlyWeatherData>(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${environment.openWeather_API_key}`);
    }

    public getDailyWeatherData(lat: number, lon: number): Observable<DailyWeatherData> {
        return this.httpClient.get<DailyWeatherData>(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${environment.openWeather_API_key}`);
    }
}
