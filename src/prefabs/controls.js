// Importing constants from the 'constants.js' file
import { AUTOREPEAT_INTERVAL, DAS_DELAY } from './constants.js';

// Define the Controls class as the default export
export default class Controls {
    constructor(scene) {
        // Store references to the scene, the current piece, and the game table
        this.scene = scene;
        this.piece = scene.piece;
        this.table = scene.table;
        
        // Initialize the counter used for auto-repeat delay and the flags for down action and soft drop
        this.counter = 0;
        this.downIsActive = false;
        this.softDrop = false;
        
        // Call the initialization function
        this.init();
    }

    // Initialize the Controls class
    init() {
        // Create cursor keys for arrow key input
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        // Create 'Z' and 'X' keys for rotation input
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyX = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        // When 'X' key is pressed, trigger clockwise rotation of the piece
        this.keyX.on('down', () => {
            this.spin(true);
        });

        // When 'Z' key is pressed, trigger counterclockwise rotation of the piece
        this.keyZ.on('down', () => {
            this.spin(false);
        });

        // When the left arrow key is released, reset the left movement counter
        this.cursors.left.on('up', () => {
            this.counter = 0;
        });

        // When the left arrow key is pressed, move the piece left and set the left movement counter to the DAS_DELAY
        this.cursors.left.on('down', () => {
            this.moveLeft();
            this.counter = DAS_DELAY;
        });

        // When the right arrow key is released, reset the right movement counter
        this.cursors.right.on('up', () => {
            this.counter = 0;
        });

        // When the right arrow key is pressed, move the piece right and set the right movement counter to the DAS_DELAY
        this.cursors.right.on('down', () => {
            this.moveRight();
            this.counter = DAS_DELAY;
        });

        // Initialize the down action
        this.initDown();
    }

    // Update function to be called in each game loop iteration
    update(delta) {
        // Update the softDrop flag based on whether the down arrow key is pressed
        if (this.downIsActive) {
            this.softDrop = this.cursors.down.isDown;
        }

        // Decrease the movement counters and ensure they don't go below zero
        this.counter -= delta;
        if (this.counter < 0) this.counter = 0;

        // If the movement counter reaches zero, trigger auto-repeat movement
        if (this.counter == 0) {
            if (this.cursors.right.isDown) {
                this.moveRight();
            } else if (this.cursors.left.isDown) {
                this.moveLeft();
            }
            this.counter += AUTOREPEAT_INTERVAL;
        }
    }

    // Function to move the piece left
    moveLeft() {
        this.piece.clear();
        this.piece.x--;
        if (this.piece.checkCollision()) {
            this.piece.x++;
        }
        this.piece.print();
        this.table.update();
    }

    // Function to move the piece right
    moveRight() {
        this.piece.clear();
        this.piece.x++;
        if (this.piece.checkCollision()) {
            this.piece.x--;
        }
        this.piece.print();
        this.table.update();
    }

    // Function to handle rotation of the piece
    spin(isClockwise) {
        // Define two functions for clockwise and counterclockwise rotation
        let spin1 = isClockwise ? this.piece.spinRight.bind(this.piece) : this.piece.spinLeft.bind(this.piece);
        let spin2 = isClockwise ? this.piece.spinLeft.bind(this.piece) : this.piece.spinRight.bind(this.piece);
        
        // Clear the piece, apply the rotation, and check for collision
        this.piece.clear();
        spin1();
        let collision = this.piece.checkCollision();
        
        // If there's a collision after rotation, revert the rotation
        if (collision) {
            spin2();
        }
        this.piece.print();
        this.table.update();
    }

    // Function to initialize the down action
    initDown() {
        // Reset softDrop and downIsActive flags
        this.softDrop = false;
        this.downIsActive = false;
        
        // Set a timeout to activate the down action after the DAS_DELAY time
        setTimeout(() => {
            this.downIsActive = true;
        }, DAS_DELAY);
    }
}
