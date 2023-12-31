// Define the Table class as the default export
export default class Table {
    constructor(scene) {
        // Store a reference to the scene where the table is present
        this.scene = scene;
        
        // Table properties related to size, position, and appearance
        this.cellWidth = 38;
        this.cellHeight = 38;
        this.width = 10; 
        this.height = 23; 
        this.topVisibleRow = 19;
        this.x = 135;
        this.y = 88;

        // Properties related to game mechanics and scoring
        this.stepDelay = 400;
        this.linesPerLevel = 10;
        this.lines = 0;
        this.level = 0;
        this.emitter = this.scene.customEmitter;
        this.completeRows = [];

        // Call the initialization function
        this.init();

        // Return the instance of the Table class
        return this;
    }

    // Initialize the table
    init() {
        // Create and initialize arrays to store cell colors and cell images
        this.initAlphaArray();
        this.initCellsArray();
        
        // Set up particle emitter for explosion effects
        this.particlesEmitter = this.scene.add.particles('atlas', 'particle').createEmitter({
            // Particle properties
        });

        // Set the emission zone for particles
        this.particlesEmitter.setEmitZone({
            source: new Phaser.Geom.Line(0, 0, 380, 0),
            type: 'edge',
            quantity: 80
        });
    }

    // Initialize the colorsArray to store cell colors for each row
    initAlphaArray() {
        this.colorsArray = [];
        for (let i = 0; i < this.height; i++) {
            this.colorsArray[i] = new Array(this.width).fill(0);
        }
    }

    // Initialize the cellsArray to store cell images and their visibility
    initCellsArray() {
        this.cellsArray = [];
        this.colorsArray.forEach((row, idxRow, arr) => {
            let imgsRow = [];

            row.forEach((v, idxColumn) => {
                let posX = this.x + this.cellWidth * idxColumn;
                let posY = this.y + this.cellHeight * (this.height - 1) - idxRow * this.cellHeight;
                let cellImg = this.scene.add.image(posX, posY, 'atlas', 'p5')
                    .setOrigin(0)
                    .setVisible(false);
                if (v) {
                    cellImg.setVisible(true);
                }
                imgsRow.push(cellImg);
            });

            this.cellsArray.push(imgsRow);
        });
    }

    // Update the table by applying the cell colors and visibility
    update() {
        const updateCell = (x, y, tint) => {
            if (tint) {
                this.cellsArray[y][x]
                    .setTexture('atlas', 'p1')  
                    .setTint(tint)  
                    .setVisible(true);
            } else {
                this.cellsArray[y][x]
                    .setVisible(false);
            }
        } 

        this.colorsArray.forEach((row, idxRow) => {
            row.forEach((v, idxColumn) => {
                updateCell(idxColumn, idxRow, v);
            });
        });
    }

    // Check for completed lines and update scoring
    checkLines() {
        let completeRows = [];

        for (let i = this.colorsArray.length - 1; i >= 0; i--) {
            let row = this.colorsArray[i];
            let completed = false;
            for (let j = 0; j < row.length; j++) {
                if (!row[j]) {
                    completed = false;
                    break;
                }
                completed = true;
            }
            if (completed) completeRows.push(i);
        }

        this.completeRows = completeRows;

        let score = this.getScore();

        if (score) {
            this.updateLines();
            if (this.isLevelUp()) {
                this.level++;
                this.emitter.emit('levelup', this.level);
            }
        }

        return score;
    }

    // Update the number of lines cleared
    updateLines() {
        this.lines += this.completeRows.length;
    }

    // Check if a level up occurred
    isLevelUp() {
        return Math.floor(this.lines / this.linesPerLevel) > this.level;
    }

    // Calculate the score based on the number of completed lines
    getScore() {
        let linesCompleted = this.completeRows.length;
        if (linesCompleted == 0) return 0;

        let score = 0;
        
        switch (linesCompleted) {
            case 1:
                return (this.level + 1) * 40;

            case 2:
                return (this.level + 1) * 100;

            case 3:
                return (this.level + 1) * 300;

            case 4:                
                this.scene.customEmitter.emit('x4Lines');
                return (this.level + 1) * 1200;

            default:
                return 0;
        }
    }

    // Explode a specific row during line clearing
    explodeLine(rowIndex) {
        let y = this.y + this.height * 38 - ((rowIndex + 1) - 0.5) * this.cellHeight;
        this.particlesEmitter.setPosition(this.x, y);
        this.particlesEmitter.explode();
    }

    // Explode all cells during game over effect
    explodeAll() {
        // Set up particle emitter for exploding all cells
        this.particlesEmitter.emitZone = null;
        const activeCells = [];
        this.cellsArray.forEach((row) => {
            for(let i = 0; i < row.length; i++) {
                if (row[i].visible) {
                    activeCells.push(row[i]);
                }
            }
        });
        let cellsToExplode = activeCells.length;
        activeCells.forEach((cell) => {
            const delay = Math.random() * 2000;
            setTimeout(() => {
                cell.setVisible(false);
                this.particlesEmitter.setPosition(cell.x, cell.y);
                this.particlesEmitter.explode();
                this.scene.cameras.main.shake(50, 0.005);
                cellsToExplode--;
                if (cellsToExplode < 1) {
                    this.initAlphaArray();
                    this.update();
                    this.scene.customEmitter.emit('explodeall');
                }
            }, delay);
        });
    }

    // Delete completed rows from the table after line clearing
    deleteCompletes() {
        this.completeRows.forEach((rowIndex) => {
            this.explodeLine(rowIndex);
            this.colorsArray.splice(rowIndex, 1);
        });

        for (let i = this.height - this.completeRows.length; i < this.height; i++) {
            this.colorsArray[i] = new Array(this.width).fill(0);
        }

        this.completeRows = [];
    }

    // Get the screen position (x, y) of a cell on the table
    getPosition(column, row) {
        let position = {};
        position.x = this.x + this.cellWidth * column + this.cellWidth / 2;
        position.y = this.y + (this.cellHeight * this.height) - this.cellHeight * row + this.cellHeight / 2;

        return position;
    }
}
