export default class WeatherAPI {
    static apiKey = 'fdfc8bfc5ffd429d8a6140022233007'; // Update with your WeatherAPI.com API key

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
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WeatherAPI.apiKey}&q=${location.lat},${location.lon}`);
            const data = await response.json();
            return data.current;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
