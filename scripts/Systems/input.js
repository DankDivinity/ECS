//functions and variables

var UP = 38,
    DOWN = 40,
    RIGHT = 39,
    LEFT = 37,
    SPACE = 32,
    SHIFT = 16,
    ENTER = 13;
    
var keys = [];

//attach key input to html 
function setupInput() {
    $('html').keydown(keydown);
    $('html').keyup(keyup);
}
function keydown(key) {
    console.log(key.keyCode);
    keys[key.keyCode] = true;
}
function keyup(key){
    keys[key.keyCode] = false;
}

var started = false;
/**
 * input
 * player inputs
 */
ECS.systems.input = function systemInput(entities) {
    if(!started){
        setupInput();
        started = true;
    }
    
    for (var entityId in entities) {
        curEntity = entities[entityId];
        
        if (curEntity.components.playerControlled) {
            
            if(keys[RIGHT]){
                
                moveX(curEntity, 1);
            }else if(keys[LEFT]){
                moveX(curEntity, -1);
            }
            
            if(keys[UP]){
                moveY(curEntity, -1);
            }else if(keys[DOWN]){
                moveY(curEntity, 1);
            }
        }
    }
}

function moveX(entity, x){
    curEntity.components.position.x+=x;
}
function moveY(entity, y){
    curEntity.components.position.y+=y;
}
function move(entity, x, y){
    curEntity.components.position.x+=x;
    curEntity.components.position.y+=y;
}