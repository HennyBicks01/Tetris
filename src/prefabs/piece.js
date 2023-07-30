// Import necessary modules and constants
import InGame from '../scenes/ingame.js';
import Load from '../scenes/load.js';
import { SHAPES, SHAPE_SPAWN } from './constants.js';
import { PIECE_TYPES } from './constants.js';
import WeatherAPI from './weatherAPI.js';

// Define the Piece class as the default export
export default class Piece {
    constructor(scene, pieceType, tableArray, weather) {
        // Store references to the scene, tableArray, and the type of the piece
        this.scene = scene;
        this.tableArray = tableArray;
        this.type = pieceType;
        
        // Initialize properties related to size and position of the piece
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.ySpawn = 0;
        
        // Arrays to store the shape, frame, and tile information of the piece
        this.shape = [];
        this.frame = [];
        this.color = 0;
        this.tint = 0xffffff;
        this.tiles = []; 
        
        // Call the initialization function
        this.init();
    }

    // Initialize the piece
    init(type) {
        // Reset the rotation and initialize the color of the piece
        this.rotation = 0;
        this.initColor();
        
        // Set the type of the piece if provided as an argument
        if (type) {
            this.type = type;
        }
        
        // Initialize the shape and size of the piece based on its type
        this.initShape(this.type); 
        this.setSize();
        
        // Set the initial position of the piece
        this.initPosition();
        
        // Set the tint of the piece based on the current weather temperature
        this.setTintBasedOnTemp();
    }

    // Initialize the color of the piece
    initColor() {
        this.color = 1;
    }

    // Initialize the position of the piece on the game table
    initPosition() {
        let initialPos = SHAPE_SPAWN.get(this.type);
        this.ySpawn = initialPos.row;
        this.y = initialPos.row;
        this.x = initialPos.col;
    }

    // Initialize the shape of the piece based on its type
    initShape() {
        let shapeIndex = this.type;
        this.shape = SHAPES[shapeIndex];
        this.updateShape();
    }

    // Set the size (width and height) of the piece based on its current frame
    setSize() {
        this.width = this.shape[0].length;
        this.height = this.width;
    }

    // Rotate the piece to the right
    spinRight() {
        this.rotation++;
        if (this.rotation > this.shape.length - 1) {
            this.rotation = 0;
        }
        this.updateShape();
    }

    // Rotate the piece to the left
    spinLeft() {
        this.rotation--;
        if (this.rotation < 0) {
            this.rotation = this.shape.length - 1;
        }
        this.updateShape();
    }

    // Update the shape based on the current rotation
    updateShape() {
        this.frame = this.shape[this.rotation];
        this.width = this.frame[0].length;
        this.height = this.frame.length;
    }

    // Set the tint of the piece based on the current weather temperature
    async setTintBasedOnTemp() {
        try {
            // Get the current weather data using WeatherAPI
            const weatherData = await WeatherAPI.getCurrentWeather();
            console.log('Weather Data:', weatherData);
    
            // Extract the temperature from the weather data
            const temp = weatherData.temp_c;
            // Define RGB colors for cold, moderate, and hot temperatures
            const coldColor = { r: 0, g: 0, b: 255 }; 
            const moderateColor = { r: 0, g: 255, b: 0 }; 
            const hotColor = { r: 255, g: 0, b: 0 }; 
            // Define minimum and maximum temperatures for normalization
            const minTemp = -10;
            const maxTemp = 40;
            // Clamp the temperature to the range [minTemp, maxTemp]
            const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));
            // Normalize the temperature to the range [0, 1]
            const normalizedTemp = (clampedTemp - minTemp) / (maxTemp - minTemp);
            console.log('Normalized Temperature:', normalizedTemp);
    
            // Initialize variables to store the RGB values
            let r, g, b;
    
            // Determine the color based on the normalized temperature
            if (normalizedTemp <= 0.4) {
                const adjustedTemp = normalizedTemp * 2;
                r = Math.round(Phaser.Math.Linear(coldColor.r, moderateColor.r, adjustedTemp));
                g = Math.round(Phaser.Math.Linear(coldColor.g, moderateColor.g, adjustedTemp));
                b = Math.round(Phaser.Math.Linear(coldColor.b, moderateColor.b, adjustedTemp));
            } 
            else {
                const adjustedTemp = (normalizedTemp - 0.4) * 2;
                r = Math.round(Phaser.Math.Linear(moderateColor.r, hotColor.r, adjustedTemp));
                g = Math.round(Phaser.Math.Linear(moderateColor.g, hotColor.g, adjustedTemp));
                b = Math.round(Phaser.Math.Linear(moderateColor.b, hotColor.b, adjustedTemp));
            }
    
            console.log('r:', r, 'g:', g, 'b:', b);
    
            // Set the tint of the piece based on the RGB values
            this.tint = Phaser.Display.Color.GetColor(r, g, b);
        } catch (error) {
            console.error(error);
        }
    }
    
    // Check if the current position of the piece collides with any occupied cells on the game table
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

    // Clear the cells occupied by the piece on the game table
    clear() {
        this.print(true);
    }

    // Print (draw) the piece on the game table or delete it from the table if isDelete is true
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

    // Convert local coordinates (piece-relative) to game table coordinates
    localToTable(localX, localY) {
        let tableY = this.y - this.height + 1 + localY;
        let tableX = this.x + localX;

        return { x: tableX, y: tableY };
    }
}
