//functions and variables
var UP = 38,
    DOWN = 40,
    RIGHT = 39,
    LEFT = 37,
    SPACE = 32,
    SHIFT = 16,
    ENTER = 13;

//used for checking whether key is held or not
//boolean values..
var keys = [];

//keys that are used by the game
//also used to prevent document from scrolling
var usedKeys = [UP, DOWN, RIGHT, LEFT, SPACE, SHIFT, ENTER];

//attach key input to html
function setupInput() {
    $(ECS.canvas).focus(function() {
        //add listeners for canvas
        //prevent functioning
        $(this).css('outline', 'none');
        console.log('focussed');
        $('html').keydown(keydown);
        $('html').keyup(keyup);
        $('html').keydown(prevent);

    }).blur(function() {
        //remove listeners for canvas
        //return normal functioning for webpage
        console.log('blurred');
        $('html').off('keydown', keydown);
        $('html').off('keyup', keyup);
        $('html').off('keydown', prevent);
    });
    $(ECS.canvas).focus();
}
function keydown(key) {
    keys[key.keyCode] = true;
}
function keyup(key) {
    keys[key.keyCode] = false;
}

//preventing the document from scrolling
function prevent(e) {
    var key = e.which;
    if ($.inArray(key, usedKeys) > -1) {
        //this is what stops page frome scrolling
        e.preventDefault();
        return false;
    }
    return true;
}
var inputStarted = false;
/**
 * input
 * player inputs
 */
ECS.systems.input = function systemInput(entities) {
    if (!inputStarted) {
        setupInput();
        inputStarted = true;
    }

    for (var entityId in entities) {
        curEntity = entities[entityId];

        if (curEntity.components.playerControlled) {
            if (keys[RIGHT]) {
                moveX(curEntity, 1);
            } else if (keys[LEFT]) {
                moveX(curEntity, -1);
            }

            if (keys[UP]) {
                moveY(curEntity, -1);
            } else if (keys[DOWN]) {
                moveY(curEntity, 1);
            }
        }
    }
}
