import InGame from '../scenes/ingame.js';
import Load from '../scenes/load.js';
import { SHAPES, SHAPE_SPAWN } from './constants.js';
import { PIECE_TYPES } from './constants.js'
import WeatherAPI from './weatherAPI.js';
export default class Piece {
    constructor(scene, pieceType, tableArray, weather) {
        this.scene = scene;
        this.tableArray = tableArray;
        this.type = pieceType;
    
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.ySpawn = 0;
        this.shape = [];
        this.frame = [];
        this.color = 0;
        this.tint = 0xffffff;
        this.tiles = []; // Initialize this.tiles
        this.init();
    }
    

    init(type) {
        this.rotation = 0;
        this.initColor();
        if (type) {
            this.type = type;
        }
        this.initShape(this.type); 
        this.setSize();
        this.initPosition();
        this.setTintBasedOnTemp();
        
    }

    initColor() {
        this.color = 1;
    }

    initPosition() {
        let initialPos = SHAPE_SPAWN.get(this.type);
        this.ySpawn = initialPos.row;
        this.y = initialPos.row;
        this.x = initialPos.col;
    }

    initShape() {
        let shapeIndex = this.type;
        this.shape = SHAPES[shapeIndex];
        this.updateShape();
    }

    setSize() {
        this.width = this.shape[0].length;
        this.height = this.width;
    }



    spinRight() {
        this.rotation++;
        if (this.rotation > this.shape.length - 1) {
            this.rotation = 0;
        }
        this.updateShape();
    }

    spinLeft() {
        this.rotation--;
        if (this.rotation < 0) {
            this.rotation = this.shape.length - 1;
        }
        this.updateShape();
    }


    updateShape() {
        this.frame = this.shape[this.rotation];
        this.width = this.frame[0].length;
        this.height = this.frame.length;
    }
    

    async setTintBasedOnTemp() {
        try {
            // Fetch the temperature from the WeatherAPI
            const weatherData = await WeatherAPI.getCurrentWeather();
            console.log('Weather Data:', weatherData);
    
            const temp = weatherData.temp_c; // Use temp_c for temperature in Celsius, or temp_f for Fahrenheit
    
            // Define the RGB values for the cold and hot colors
            const coldColor = { r: 0, g: 0, b: 255 }; // Blue
            const hotColor = { r: 255, g: 0, b: 0 }; // Red
    
            // Define the temperature range
            const minTemp = -10;
            const maxTemp = 40;
    
            // Clamp the temperature to the defined range
            const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));
    
            // Normalize the temperature to a value between 0 and 1
            const normalizedTemp = (clampedTemp - minTemp) / (maxTemp - minTemp);
            console.log('Normalized Temperature:', normalizedTemp);
    
            // Interpolate between the cold and hot colors based on the normalized temperature
            const r = Math.round(Phaser.Math.Linear(coldColor.r, hotColor.r, normalizedTemp));
            const g = Math.round(Phaser.Math.Linear(coldColor.g, hotColor.g, normalizedTemp));
            const b = Math.round(Phaser.Math.Linear(coldColor.b, hotColor.b, normalizedTemp));
            console.log('r:', r, 'g:', g, 'b:', b);
    
            // Convert the RGB color to a Phaser color tint
            this.tint = Phaser.Display.Color.GetColor(r, g, b);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Checks piece frame on the table space for collisions.
     */
    checkCollision() {
        const table = this.tableArray;
        let collision = false;

        this.frame.forEach((row, rowIndex) => {
            row.forEach((v, columnIndex) => {
                if (!v) return;
                let position = this.localToTable(columnIndex, rowIndex);
                if (typeof table[position.y] == 'undefined' || typeof table[position.y][position.x] == 'undefined' || table[position.y][position.x]) {
                    collision = true;
                }
            });
        });

        return collision;
    }

    clear() {
        this.print(true)
    }

    print(isDelete = false) {
        const table = this.tableArray;
        this.frame.forEach((row, rowIndex) => {
            row.forEach((v, columnIndex) => {
                let position = this.localToTable(columnIndex, rowIndex);
                if (v && !isDelete && position.y <= this.scene.table.topVisibleRow) {
                    table[position.y][position.x] = this.tint;
                } else if (v && isDelete) {
                    table[position.y][position.x] = 0;
                }
            });
        });
    }
    
    

    localToTable(localX, localY) {
        let tableY = this.y - this.height + 1 + localY;
        let tableX = this.x + localX;

        return { x: tableX, y: tableY };
    }
}