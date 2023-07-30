// Constants for storing cookies
export const COOKIE_LAST = 'lastscore';
export const COOKIE_TOP = 'topscore';
// Constants related to time and game mechanics
export const MILLISECONDS_PER_FRAME = 1000 / 60;
export const DAS_DELAY = 16 * MILLISECONDS_PER_FRAME;
export const AUTOREPEAT_INTERVAL = 6 * MILLISECONDS_PER_FRAME;
export const SOFTDROP_DELAY = 1.5 * MILLISECONDS_PER_FRAME;
// Gravity levels for different stages of the game
export const GRAVITY_LEVELS = [
    48, 
    43,
    38,
    33,
    28,
    23,
    18,
    13,
    8,
    6,
    5,
    5,
    5, 
    4,
    4,
    4, 
    3,
    3,
    3, 
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2, 
    28 
]
// Map to store the piece types and their corresponding names
export const PIECE_TYPES = new Map();
PIECE_TYPES.set(1, 'O');
PIECE_TYPES.set(2, 'T');
PIECE_TYPES.set(3, 'Z');
PIECE_TYPES.set(4, 'S');
PIECE_TYPES.set(5, 'J');
PIECE_TYPES.set(6, 'L');
PIECE_TYPES.set(7, 'I');

// Map to store the spawn positions of different piece types
export const SHAPE_SPAWN = new Map();
SHAPE_SPAWN.set(1, { col: 4, row: 19 });
SHAPE_SPAWN.set(2, { col: 3, row: 20 });
SHAPE_SPAWN.set(3, { col: 3, row: 20 });
SHAPE_SPAWN.set(4, { col: 3, row: 20 });
SHAPE_SPAWN.set(5, { col: 3, row: 20 });
SHAPE_SPAWN.set(6, { col: 3, row: 20 });
SHAPE_SPAWN.set(7, { col: 3, row: 21 });

// Object containing the shapes of different piece types with their rotations
export const SHAPES = {
    
    1: [
        [
            [1, 1], [1, 1]
        ]
    ],
    
    2: [
        [
            [0, 1, 0], [1, 1, 1], [0, 0, 0] 
        ],
        [
            [0, 1, 0], [1, 1, 0], [0, 1, 0]
        ],
        [
            [0, 0, 0], [1, 1, 1], [0, 1, 0]
        ],
        [
            [0, 1, 0], [0, 1, 1], [0, 1, 0]
        ]
    ],
    
    3: [
        [
            [0, 1, 1], [1, 1, 0], [0, 0, 0] 
        ],
        [
            [0, 1, 0], [0, 1, 1], [0, 0, 1]
        ]
    ],
    
    4: [
        [
            [1, 1, 0], [0, 1, 1], [0, 0, 0] 
        ],
        [
            [0, 0, 1], [0, 1, 1], [0, 1, 0]
        ]
    ],
    
    5: [
        [
            [0, 0, 1], [1, 1, 1], [0, 0, 0] 
        ],
        [
            [1, 1, 0], [0, 1, 0], [0, 1, 0]
        ],
        [
            [0, 0, 0], [1, 1, 1], [1, 0, 0]
        ],
        [
            [0, 1, 0], [0, 1, 0], [0, 1, 1]
        ]
    ],
    
    6: [
        [
            [1, 0, 0], [1, 1, 1], [0, 0, 0] 
        ],
        [
            [0, 1, 0], [0, 1, 0], [1, 1, 0]
        ],
        [
            [0, 0, 0], [1, 1, 1], [0, 0, 1]
        ],
        [
            [0, 1, 1], [0, 1, 0], [0, 1, 0]
        ]
    ],
    
    7: [
        [
            [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0] 
        ],
        [
            [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]
        ]
    ]
} 