// WeatherAPI class to interact with the Weather API
export default class WeatherAPI {
    // API key for accessing the weather API
    static apiKey = 'fdfc8bfc5ffd429d8a6140022233007'; 

    // Asynchronously gets the current location of the user using geolocation
    static async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            // Check if geolocation is available in the browser
            if ('geolocation' in navigator) {
                // If available, fetch the user's current position
                navigator.geolocation.getCurrentPosition((position) => {
                    // Resolve with latitude and longitude
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                }, (error) => {
                    // Reject with error if unable to fetch the user's position
                    reject(error);
                });
            } else {
                // If geolocation is not available, reject with an error
                reject(new Error('Geolocation not available'));
            }
        });
    }

    // Asynchronously fetches the current weather data for the user's location
    static async getCurrentWeather() {
        try {
            // Get the current location using the getCurrentLocation method
            const location = await WeatherAPI.getCurrentLocation();
            
            // Fetch weather data from the weather API using the API key and the user's location
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WeatherAPI.apiKey}&q=${location.lat},${location.lon}`);
            
            // Convert the response to JSON format
            const data = await response.json();
            
            // Return the current weather information from the API response
            return data.current;
        } catch (error) {
            // If any error occurs during the process, log the error and return null
            console.error(error);
            return null;
        }
    }
}
