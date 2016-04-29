
/**
 * game with a loop
 */
ECS.Game = function Game(width, height) {
    //for reference to this object in other functions
    var self = this;

    this.width = width | 200;
    this.height = height | 200;

    //setup main canvas and its variables
    var $canvas = $("<canvas width=" + this.width +
                           " height=" + this.height + 
                           " tabindex='1'></canvas>");
    $('body').append($canvas);
    $canvas.focus();
    ECS.canvas = $canvas[0];
    ECS.context = ECS.canvas.getContext("2d");
    ECS.context.imageSmoothingEnabled = false;
    
    //entities that will be created
    var entities = {};

    for (var i = 0; i < 1; i++) {
        var entity = new ECS.Entity();
        entity.addComponent(new ECS.Components.Appearance($("#ball")[0]));
        entity.addComponent(new ECS.Components.Position());

        entities[entity.id] = entity;
    }

    //add player
    var player = new ECS.Entity();
    player.addComponent(new ECS.Components.Appearance(null, { radius: 40 }));
    player.addComponent(new ECS.Components.Position());
    player.addComponent(new ECS.Components.PlayerControlled());

    entities[player.id] = player;

    //set the ECS' entities to the game's entities
    ECS.entities = entities;

    //sytems to be put in array to iterate over
    var systems = [
        ECS.systems.input,
        ECS.systems.render
    ];

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

    //this is how the gameLoop starts...
    //this function is part of the browser and calls the given function
    //in the parameter
    requestAnimationFrame(gameLoop);

    //these can be used publicly...
    this._running = true;
    this.endGame = function endGame() {
        self._running = false;
    };

    //for returning purposes
    return this;
}

//wait for document to be ready to do these things
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


            ECS.game = new ECS.Game();
        }
    }



});