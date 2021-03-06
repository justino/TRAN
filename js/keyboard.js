// Keyboard State Object
// Manages the state of keyboard key presses
var KeyboardState = {
    pressed: {},

    movement: {
        UP: [87],
        DOWN: [83],
        LEFT: [65],
        RIGHT: [68]
    },

    BLOCK: [101, 53],

    disc: {
        UP: [104, 56],
        UPRIGHT: [105, 57],
        RIGHT: [102, 54],
        DOWNRIGHT: [99, 51],
        DOWN: [98, 50],
        DOWNLEFT: [97, 49],
        LEFT: [100, 52],
        UPLEFT: [103, 55]
    },

    isDown: function(keyList) {
        for (var key of keyList) {
            if (this.pressed[key]) {
                return true;
            }
        }
        return false;
    },
    keyDown: function(code) { this.pressed[code] = true; },
    keyUp: function(code) { delete this.pressed[code]; },

    discKeyPressed: function() {
        for (var direction in this.disc) {
            if (this.isDown(KeyboardState.disc[direction])) {
                return this.disc[direction];
            }
        }

        return false;
    }
}

addEventListener('keyup',   e => { KeyboardState.keyUp(e.keyCode); });
addEventListener('keydown', e => { KeyboardState.keyDown(e.keyCode); });
