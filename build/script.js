//just initiial variables
var ECS = {};
ECS.Components = {};
ECS.systems = [];
ECS.assemblers = {};
ECS.game = null;
ECS.entities = [];
ECS.player = null;
ECS.removeEntity = function removeEntity(entity) {
  delete ECS.entities[entity.id];
}
//for accesing elements in document
var ready = false;



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
  ready = true;
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
      console.log('GAME');
      console.log('\t'+ECS.game);
      console.log('\t',ECS.player.components.collidable);
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

    //spawn or edge of screen randomly
    if(Math.random() < .5){
        x = Math.random() * spawnWidth;
        y = Math.round(Math.random()) * spawnHeight;
    }else{
        y = Math.random() * spawnHeight;
        x = Math.round(Math.random()) * spawnWidth;
    }

    cat.addComponent(new ECS.Components.Appearance($('#cat')[0]));
    cat.addComponent(new ECS.Components.Position({x:x,y:y}));
    cat.addComponent(new ECS.Components.Cat());
    cat.addComponent(new ECS.Components.Collidable());

    return cat;
}

/**
 * Assembler for player
 */

ECS.assemblers.player = function playerAssembler(entity, spawnWidth, spawnHeight){
  var player = entity;
  player.addComponent(new ECS.Components.Appearance($("#banana")[0]));
  player.addComponent(new ECS.Components.Position({ x: spawnWidth/2, y: spawnHeight/2 }));
  player.addComponent(new ECS.Components.PlayerControlled());
  player.addComponent(new ECS.Components.Collidable(true));
  player.addComponent(new ECS.Components.Health(100));

  return player;
}

/**
 * Components are just data. Should not do anything on their own.
 * That is for Systems to handle
 */


/**
 * Voice
 * something to output
 */
ECS.Components.Voice = function ComponentVoice(message) {
    this.message = message || "sound";
    this.deathMessage;
    return this;
}
ECS.Components.Voice.prototype.name = 'voice';

/**
 * Appearance
 */
ECS.Components.Appearance = function ComponentAppearance(image, params) {
    //params for whatever appearance related data
    this.params = params || {};

    this.image = null;
    this.width = this.params.width || 0;
    this.height = this.params.height || 0;

    //if paramter image is given
    if (image) {
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
ECS.Components.Position = function ComponentPosition(params) {
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
ECS.Components.PlayerControlled = function ComponentPlayerControlled(keyFunctions) {
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
    ECS.Components.Cat.prototype.amount++;
}
ECS.Components.Cat.prototype.name = 'cat';
ECS.Components.Cat.prototype.amount = 0;

/**
 * Component to say if entity is collidable or not
 */
ECS.Components.Collidable = function ComponentCollidable(watch) {
    //components itself says if the entity is collidable
    this.collided = false;
    //should the entity worry about its own collision into others
    if (!watch)
        this.watch = false;
    else {
        this.watch = true
    }

}
ECS.Components.Collidable.prototype.name = 'collidable';

/**
 * Component for text
 */
ECS.Components.Text = function ComponentText(text, params){
  this.text = text;
  this.params = params;
  if(!this.params)
    this.params = {};
  console.log(this.params);
}
ECS.Components.Text.prototype.name = 'text';

/**
 * Component for health
 */
ECS.Components.Health = function ComponentHealth(initialHealth){
  this.amount = initialHealth;
  if(!this.amount || this.amount == NaN)
    this.amount = 0;

  this.justHit = false;
}
ECS.Components.Health.prototype.name = 'health';

/**
 * The entity class
 */
ECS.Entity = function(){
    /**random number in hex plus a counter */
    this.id = ECS.Entity.prototype._count  + '' + (Math.random()*10000).toString(16);

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

    this.healthEntityId;
    this.score = 0;
    this.scoreEntityId;
    this.addPoints = function addPoints(type){
      var amt = 50;
      if(type == 'cat-missed')
        amt = 100;

      self.score += amt;
      entities[self.scoreEntityId].components.text = self.score;
    }
    this.updateHealth = function updateHealth(){
      entities[this.healthEntityId].components.text = ECS.player.components.health.amount;
    }
    //spawner
    var spawner = setInterval(spawn,2000);

    function spawn(){
      if(!self._running)
        return;
      var entity = ECS.assemblers.cat(new ECS.Entity(),
                                      self.width, self.height);
      entities[entity.id] = entity;
    }
    //this is how the gameLoop starts...
    //this function is part of the browser and calls the given function
    //in the parameter
    this.start = function startGame() {
        this._running = true;
        requestAnimationFrame(gameLoop);
    }
    this.pause = function pauseGame() {
        self._running = false;
        clearInterval(spawner);
    };
    this.end = function endGame(){
      this.pause();
      $('#game-over-screen').show();
    }

    function init() {
        var scale = ECS.systems.render.prototype.scale;
        console.log('WIDTH', self.width);
        console.log('HEIGHT', self.height);
        //setup main canvas and its variables
        var $canvas = $("<canvas width=" + self.width +
            " height=" + self.height +
            " tabindex='1'></canvas>");
        $('body').prepend($canvas);

        $('#game-over-screen').width(self.width * scale ).height(self.height * scale/3)
                              .css({top: self.height * scale/3 });
        $('#game-over-screen').hide();
        $canvas.focus();
        ECS.canvas = $canvas[0];
        ECS.context = ECS.canvas.getContext("2d");
        ECS.context.imageSmoothingEnabled = false;

        for (var i = 0; i < 1; i++) {
            spawn();
        }

        //add player
        var player = ECS.assemblers.player(new ECS.Entity(), self.width, self.height);
        entities[player.id] = player;

        ECS.player = player;

        var scoreEntity = new ECS.Entity();
        scoreEntity.addComponent(new ECS.Components.Appearance());
        scoreEntity.addComponent(new ECS.Components.Text(self.score));
        scoreEntity.addComponent(new ECS.Components.Position({ x: 0, y: 30 }));

        entities[scoreEntity.id] = scoreEntity;
        //for reference to the score entity
        self.scoreEntityId = scoreEntity.id;

        var healthEntity = new ECS.Entity();
        healthEntity.addComponent(new ECS.Components.Appearance());
        healthEntity.addComponent(new ECS.Components.Text(player.components.health.amount,{staticText: 'HEALTH:'}));
        healthEntity.addComponent(new ECS.Components.Position({ x: 0, y: 80 }));

        entities[healthEntity.id] = healthEntity;
        self.healthEntityId = healthEntity.id;
        //set the ECS' entities to the game's entities
        ECS.entities = entities;

        //sytems to be put in array to iterate over
        systems = [
            ECS.systems.input,
            ECS.systems.catAI,
            ECS.systems.collision,
            ECS.systems.render,
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
        var spx = Math.abs(Math.cos(toRadians(angle)) * sp) * dirx //* ((px - cx) / Math.abs(px - cx));
        var spy = Math.abs(Math.sin(toRadians(angle)) * sp) * diry//* ((py - cy) / Math.abs(py - cy));

        //certain combinations produce NaN
        if (spx === NaN)
          spx = 0;
        if (spy === NaN)
          spy = 0;

        curEntity.components.cat.spx = spx;
        curEntity.components.cat.spy = spy;

        //no longer started
        curEntity.components.cat.started = false;
        //console.log('CAT SPEED:', sp);
      }

      //move
      move(curEntity, curEntity.components.cat.spx,
           curEntity.components.cat.spy);

      //if the cat reaches outside the screen
      if(curEntity.components.position.x >= ECS.game.width ||
         curEntity.components.position.x < 0 ||
         curEntity.components.position.y >= ECS.game.height ||
         curEntity.components.position.y < 0){
           console.log('deleted');
           ECS.game.addPoints('cat-missed');
           ECS.removeEntity(curEntity);
         }


    }
  }
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

/**
 * collision
 * for collision among entities that can and allow for it
 */
var $collideInfo;
var collisionStarted = false;
ECS.systems.collision = function systemCollision(entities) {
    if (!collisionStarted) {
        $collideInfo = $('#collide-info');
        collisionStarted = true;
    }
    var curEntity;

    for (var entityId in entities) {

        curEntity = entities[entityId];

        if (curEntity.components.collidable && curEntity.components.collidable.watch) {
            if (curEntity.components.position) {
                var x = curEntity.components.position.x;
                var y = curEntity.components.position.y;
                var w = 0;
                var h = 0;
                if (curEntity.components.appearance) {
                    w = curEntity.components.appearance.width;
                    h = curEntity.components.appearance.height;
                }


                var checkX = false,
                    checkY = false;
                for (var otherId in entities) {
                    //console.log(entities);
                    var otherEntity = entities[otherId];

                    if (entityId === otherId) {
                        continue;
                    }
                    //console.log('different:', curEntity.id, '\t' + otherEntity.id);
                    var ox = otherEntity.components.position.x;
                    var oy = otherEntity.components.position.y;
                    var ow = 0;
                    var oh = 0;

                    if (otherEntity.components.appearance) {
                        ow = otherEntity.components.appearance.width;
                        oh = otherEntity.components.appearance.height;
                    }

                    //check if curEntityentity is in otherEntity on x axis
                    if ((x - w / 2 < ox + ow / 2 && x - w / 2 >= ox - ow / 2) ||
                        (x + w / 2 - 1 < ox + ow / 2 && x + w / 2 - 1 >= ox - ow / 2)) {
                        checkX = true;
                    }
                    //check if curEntityentity is in otherEntity on y axis
                    if ((y - h / 2 < oy + oh / 2 && y - h / 2 >= oy - oh / 2) ||
                        (y + h / 2 - 1 < oy + oh / 2 && y + h / 2 - 1 >= oy - oh / 2)) {
                        checkY = true;
                    }
                    //console.log('oX:', ox, 'oY:', oy, 'oW:', ow, 'oH:', oh);


                    if (checkX && checkY){
                        //console.log('collided');
                        if(curEntity.components.playerControlled && !ECS.player.components.health.justHit){
                          hitPlayer();
                        }
                    }

                }
                var collideText = '<b>X:</b>' + x + ', </b>Y:</b>' + y + '<br></b>W:</b>' + w + ', </b>H:</b>' + h + '<br><b>checkX</b>' + checkX + ', <b>checkY</b>' + checkY;
                $collideInfo.html(collideText);

            }
        }
    }
}

function hitPlayer(){
  var health = ECS.player.components.health.amount;
  console.log(ECS.player.components)
  health -= 10;
  ECS.player.components.health.amount = health;
  ECS.player.components.health.justHit = true;
  var invinciblePhase = setTimeout(function(){
    ECS.player.components.health.justHit = false;
  },300);
  ECS.game.updateHealth();
  console.log('HEALTH:',health);
  if(health <= 0){
    ECS.game.end();
  }
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

/**
 * render
 * note Systems are more like functions that do
 */

ECS.systems.render = function systemRender(entities) {
    var scale = ECS.systems.render.prototype.scale;
    var lastScale = ECS.systems.render.prototype.lastScale;
    if (lastScale != scale) {
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
            if (curEntity.components.appearance.image != null) {
                drawImage(curEntity.components.appearance.image,
                    curEntity.components.position.x,
                    curEntity.components.position.y,
                    curEntity.components.appearance.width,
                    curEntity.components.appearance.height);
            } else if (curEntity.components.text) {
                ECS.context.font = "30px Arial";
                if(curEntity.components.appearance.params.color)
                  ECS.context.fillStyle = curEntity.components.appearance.params.color;
                else {
                  ECS.context.fillStyle = 'black';
                }

                var staticText = ''/* curEntity.components.text.params.staticText;
                if(!staticText)
                  staticText = '';*/
                ECS.context.fillText(staticText + curEntity.components.text,
                    curEntity.components.position.x,
                    curEntity.components.position.y)
            }

        }
    }

}
ECS.systems.render.prototype.scale = 3;
ECS.systems.render.prototype.lastScale = 0;


function clearScreen() {
    ECS.context.clearRect(0, 0, ECS.canvas.width, ECS.canvas.height);
}

//to center drawing
function drawImage(image, x, y, w, h) {
    ECS.context.drawImage(image, x - w / 2, y - h / 2, w, h);
}
