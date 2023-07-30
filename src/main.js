// Import the scenes
import Boot from "./scenes/boot.js";
import InGame from "./scenes/ingame.js";
import Load from "./scenes/load.js";
import Menu from "./scenes/menu.js";

// Function to run the game
function runGame() {
    // Phaser game configuration
    var config = {
        type: Phaser.AUTO, // Use the WebGL or Canvas renderer automatically based on device capabilities
        width: 648, // Width of the game canvas
        height: 1080, // Height of the game canvas
        parent: 'game', // The ID of the HTML element that will contain the game canvas
        backgroundColor: 0, // Background color of the game canvas (black in this case)
        scale: {
            mode: Phaser.Scale.FIT, // Scale the game to fit the screen
            autoCenter: Phaser.Scale.CENTER_BOTH // Center the game on the screen
        },
        roundPixels: true, // Round pixels to avoid pixel bleeding
        scene: [Boot, Load, Menu, InGame] // An array of scenes to be used in the game
    };

    // Create a new Phaser game instance with the provided configuration
    new Phaser.Game(config);
}

// Run the game when the window has finished loading
window.onload = function () {
    runGame();
};
