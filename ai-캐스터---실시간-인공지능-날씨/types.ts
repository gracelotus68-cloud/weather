
export interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  forecast: string;
  recommendations: {
    clothing: string;
    activities: string;
    precautions: string;
  };
  sources: Array<{
    title: string;
    uri: string;
  }>;
}

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  isLoading: boolean;
}
