export default class WeatherAPI {
    static apiKey = 'd78383fe2a464ec38e68e5e0712d2a42';

    static async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                }, (error) => {
                    reject(error);
                });
            } else {
                reject(new Error('Geolocation not available'));
            }
        });
    }

    static async getCurrentWeather() {
        try {
            const location = await WeatherAPI.getCurrentLocation();
            const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${location.lat}&lon=${location.lon}&key=${WeatherAPI.apiKey}`);
            const data = await response.json();
            return data.data[0];
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
