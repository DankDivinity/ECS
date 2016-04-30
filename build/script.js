//just initiial variables
var ECS = {
  Components: {},
  systems: [],
  assemblers: {},
  game: null,
  entities: [],
  player: null
};


function moveX(entity, x) {
    entity.components.position.x += x;
}
function moveY(entity, y) {
    entity.components.position.y += y;
}
function move(entity, x, y) {
    entity.components.position.x += x;
    entity.components.position.y += y;
}

//wait for document to be ready to do theseS things
$(document).ready(function() {
    //sometimes the image tags are ready but the image themselves are not
    //so I got the amount of image tags that have the class 'sprite'
    //and when they load, increment a counter
    var spritesloaded = 0;
    var spriteAmt = $('.sprite').length;
    $('.sprite').on('load', function() {
        spritesloaded++;
        //try to start game
        startGame();
    });

    //this only starts the game when the counter equals the amount of 'sprite' classes
    function startGame() {

        if (spritesloaded >= spriteAmt) {
            //there is game field now
            ECS.game = new ECS.Game();
            ECS.game.start();
            console.log('GAME\n', ECS.game, '\n', ECS.game.width);
        }
    }



});
/**
 * Assembler for cats..
 * assmebler just nicer way to 
 * organize and make entities that
 * are the same
 */

ECS.assemblers.cat = function catAssembler(entity, spawnWidth, spawnHeight){
    var cat = entity;
      
    var x = 0, y = 0;
 
    if(Math.random() < .5){
        x = Math.random() * spawnWidth;
        y = Math.round(Math.random()) * spawnHeight;
    }else{
        y = Math.random() * spawnHeight;
        x = Math.round(Math.random()) * spawnWidth;
    }
    console.log('CAT| X',x,' Y',y);
    
    cat.addComponent(new ECS.Components.Appearance($('#cat')[0]));
    cat.addComponent(new ECS.Components.Position({x:x,y:y}));
    cat.addComponent(new ECS.Components.Cat());
    
    return cat;
}
/** 
 * Components are just data. Should not do anything on their own.
 * That is for Systems to handle
 */


/**
 * Voice
 * something to output
 */
ECS.Components.Voice = function ComponentVoice( message ){
    this.message = message || "sound";
    this.deathMessage;
    return this;
}
ECS.Components.Voice.prototype.name = 'voice';

/**
 * Appearance
 */
ECS.Components.Appearance = function ComponentAppearance( image, params ){
    //params for whatever appearance related data
    this.params = params || {};
    
    this.image = null;
    this.width = this.params.width || 0;
    this.height = this.params.height || 0;
    
    //if paramter image is given
    if(image){
        console.log('w:'+ image.width , 'h:'+image.height);
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }
    return this;
}
ECS.Components.Appearance.prototype.name = 'appearance';

/**
 * Position
 */
ECS.Components.Position = function ComponentPosition (params){
    params = params || {};
    
    this.x = params.x || 0;
    this.y = params.y || 0;
    
    return this;
}
ECS.Components.Position.prototype.name = 'position';

/**
 * if entity is player controlled
 * provide array of functions to do for keys
 */
ECS.Components.PlayerControlled = function ComponentPlayerControlled(keyFunctions){
    this.keyFunctions = keyFunctions || [];
    
    //keyFunctions is an array that is indexed by keyCodes
    //ex: keyFunctions[23] is a function tied to a key with the keyCode 23
};
ECS.Components.PlayerControlled.prototype.name = 'playerControlled';

/**
 * Component to identify entity as Cat
 * also has a speed that increases
 * for each cat, and spx and spy that is for direction
 */
ECS.Components.Cat = function ComponentCat() {
    this.speed = 3 + ECS.Components.Cat.prototype.amount * 0.5;
    //speedx, speedy
    //set zero..will use this as an example for
    //assembler
    this.spx = 0;
    this.spy = 0;
    this.started = true;
}
ECS.Components.Cat.prototype.name = 'cat';
ECS.Components.Cat.prototype.amount = 0;

/**
 * The entity class
 */
ECS.Entity = function(){
    /** date in hex and random number in hex plus a counter */
    this.id = (new Date()).toString(16)
                + (Math.random()*10000).toString(16)
                + ECS.Entity.prototype._count;
    
    //add to counter
    ECS.Entity.prototype._count++;
    
    /** this is where the components for each entity go  */
    this.components = {};
    
    //just returning it so it can
    return this;
};

/**
 * these are using to prototype so its easier to see
 * what is class based and not object based
 */
ECS.Entity.prototype._count = 0;

/** add component and get entity returned for chaining */
ECS.Entity.prototype.addComponent = function addComponent( component ){
    this.components[component.name] = component;
    console.log(component.name);
    return this
};

/** 
 * delete component from entity. pass string in, if it is actually
 * class/function then use prototype to get name
 */
ECS.Entity.prototype.removeComponent = function removeComponent( componentName ){
    var name = componentName;
    
    if(typeof componentName === 'function'){ 
        // get the name from the prototype of the passed component function
        name = componentName.prototype.name;
    }

    delete this.components[name];
    return this;
}

/**
 * game with a loop
 */
ECS.Game = function Game(width, height) {
    //for reference to this object in other functions
    var self = this;

    this.width = width | 200;
    this.height = height | 200;
    this._running = false;

    //entities that will be created
    var entities = {};
    var systems = [];

    //this is how the gameLoop starts...
    //this function is part of the browser and calls the given function
    //in the parameter
    this.start = function startGame() {
        this._running = true;
        requestAnimationFrame(gameLoop);
    }
    this.endGame = function endGame() {
        self._running = false;
    };

    function init() {
        console.log('WIDTH', self.width);
        console.log('HEIGHT', self.height);
        //setup main canvas and its variables
        var $canvas = $("<canvas width=" + self.width +
            " height=" + self.height +
            " tabindex='1'></canvas>");
        $('body').append($canvas);
        $canvas.focus();
        ECS.canvas = $canvas[0];
        ECS.context = ECS.canvas.getContext("2d");
        ECS.context.imageSmoothingEnabled = false;
        
        for (var i = 0; i < 1; i++) {
            var entity = new ECS.Entity();
            entity.addComponent(new ECS.Components.Appearance($("#ball")[0]));
            entity.addComponent(new ECS.Components.Position());

            entities[entity.id] = entity;
        }
        for (var i = 0; i < 1; i++) {
            var entity = ECS.assemblers.cat(new ECS.Entity(),
                                            self.width, self.height);
            entities[entity.id] = entity;
        }

        //add player
        var player = new ECS.Entity();
        player.addComponent(new ECS.Components.Appearance(null, { radius: 40 }));
        player.addComponent(new ECS.Components.Position({ x: 0, y: 70 }));
        player.addComponent(new ECS.Components.PlayerControlled());

        entities[player.id] = player;

        ECS.player = player;

        //set the ECS' entities to the game's entities
        ECS.entities = entities;

        //sytems to be put in array to iterate over
        systems = [
            ECS.systems.input,
            ECS.systems.catAI,
            ECS.systems.render
        ];
    };
    
    //the game loop
    function gameLoop() {
        //go through systems
        for (var i = 0; i < systems.length; i++) {
            systems[i](ECS.entities);
        }

        //check if game should repeat loop
        if (self._running !== false) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    init();
    //for returning purposes
    return this;
}


/**
 * the ai for the cat enemies
 */

ECS.systems.catAI = function systemCatAI(entities) {
  for (var entityId in entities) {
    curEntity = entities[entityId];

    if (curEntity.components.cat) {
      //set initial direction
      if (curEntity.components.cat.started) {
        //cat variables
        var cx = curEntity.components.position.x;
        var cy = curEntity.components.position.y;
        var sp = curEntity.components.cat.speed;

        //player variables
        var px = ECS.player.components.position.x;
        var py = ECS.player.components.position.y;


        //math to make cat travel its speed in direction to player
        var angle = toDegrees(Math.atan((py - cy) / (px - cx)));
        
        //boy i hate these functions..
        var dirx = Math.sign(px - cx);
        var diry = Math.sign(py - cy);
        console.log('DIRRR', dirx, diry);
        var spx = Math.abs(Math.cos(toRadians(angle)) * sp) * dirx //* ((px - cx) / Math.abs(px - cx));
        var spy = Math.abs(Math.sin(toRadians(angle)) * sp) * diry//* ((py - cy) / Math.abs(py - cy));
        

        if (spx === NaN)
          spx = 0;
        if (spy === NaN)
          spy = 0;
        console.log('ANGLE:' + angle, 'SPx:' + spx, 'SPy:' + spy);
        curEntity.components.cat.spx = spx;
        curEntity.components.cat.spy = spy;

        //no longer started
        curEntity.components.cat.started = false;
      }

      //move
      move(curEntity, curEntity.components.cat.spx,
        curEntity.components.cat.spy);

    }
  }
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}
function toRadians(angle) {
  return angle * (Math.PI / 180);
}
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
    console.log(key.keyCode);
    keys[key.keyCode] = true;
}
function keyup(key) {
    keys[key.keyCode] = false;
}

//preventing the document from scrolling
function prevent(e) {
    console.log('checking to prevent..');
    var key = e.which;
    if ($.inArray(key, usedKeys) > -1) {
        console.log('preventing..');
        //this is what stops page frome scrolling
        e.preventDefault();
        return false;
    }
    return true;
}
var started = false;
/**
 * input
 * player inputs
 */
ECS.systems.input = function systemInput(entities) {
    if (!started) {
        setupInput();
        started = true;
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


/**
 * render
 * note Systems are more like functions that do
 */

ECS.systems.render = function systemRender(entities) {
    var scale = ECS.systems.render.prototype.scale;
    var lastScale = ECS.systems.render.prototype.lastScale;
    if(lastScale != scale){
        ECS.systems.render.prototype.lastScale = scale;      
        $(ECS.canvas).width(ECS.game.width * scale);
        console.log('SCALED by', scale, 'RESIZED to', ECS.game.width, ECS.Game);
    }
    clearScreen();
    //just a variable to be used
    var curEntity;

    //iterate through entities
    for (var entityId in entities) {
        curEntity = entities[entityId];

        //entity needs an appearance and position
        if (curEntity.components.appearance && curEntity.components.position) {
            if (curEntity.components.appearance.image) {
                ECS.context.drawImage(curEntity.components.appearance.image,
                    curEntity.components.position.x,
                    curEntity.components.position.y,
                    curEntity.components.appearance.width,
                    curEntity.components.appearance.height);
            } else {
                ECS.context.beginPath();
                ECS.context.arc(curEntity.components.position.x,
                    curEntity.components.position.y,
                    curEntity.components.appearance.params.radius,
                    0, 2 * Math.PI);
                ECS.context.stroke();
            }

        }
    }
    
}
ECS.systems.render.prototype.scale = 3;
ECS.systems.render.prototype.lastScale = 0;


function clearScreen() {
    ECS.context.clearRect(0, 0, ECS.canvas.width, ECS.canvas.height);
}
