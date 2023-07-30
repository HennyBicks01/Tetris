import WeatherAPI from '../prefabs/weatherAPI.js'; // import WeatherAPI

export default class Load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    preload() {

        let logo = this.add.image(centerX, centerY, 'atlas-menu', 'logowhite');
        this.text_loading = this.add.text(logo.x, logo.y + 150, 'Loading...', 30)
            .setOrigin(0.5);

        this.load.on('complete', function () {
            // Pass the current weather to the next scene
            this.scene.start('menu', { currentWeather: this.currentWeather });
        }, this);

        // Images
        this.load.atlas('atlas', 'assets/imgs/tetris1080.png', 'assets/imgs/jtetris.json');
        this.load.image('mask', 'assets/imgs/mask.png');
        this.load.image('highscore', 'assets/imgs/highscore.png');

        this.load.on('progress', this.updateText, this);

        this.loadWeatherData();
    }

    async loadWeatherData() {
        try {
            const weatherData = await WeatherAPI.getCurrentWeather();
            const temp = weatherData.temp_c; // Use temp_c for temperature in Celsius, or temp_f for Fahrenheit
            // Store the temperature in the game's global data store
            this.registry.set('currentTemp', temp);
        } catch (error) {
            console.error(error);
        }
    }

    updateText(progress) {
        this.text_loading.setText(`Loading ... ${Math.round(progress * 100)}%`);
    }
}