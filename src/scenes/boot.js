// Import the Phaser Scene class
export default class Boot extends Phaser.Scene {
    constructor() {
        // Call the constructor of the parent class (Phaser.Scene) and pass the scene key ('boot')
        super('boot');
    }

    // The preload method is called automatically by Phaser during the scene's loading phase
    preload() {
        // Get the center coordinates of the screen
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Set the center coordinates as properties of the global window object
        // This can be used globally throughout the game
        window.centerX = centerX;
        window.centerY = centerY;

        // Load the atlas image and corresponding JSON file that defines the frames
        // The atlas is used to create texture atlases, which are efficient for sprite rendering
        this.load.atlas('atlas-menu', 'assets/imgs/tetris1080menu.png', 'assets/imgs/tetrismenu.json');

        // Register an event listener for the 'complete' event, which is triggered when all assets are loaded
        this.load.on('complete', () => {
            // After all assets are loaded, transition to the 'load' scene
            this.scene.start('load');
        });
    }
}
