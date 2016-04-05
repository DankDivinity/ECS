
/**
 * game with a loop
 */
ECS.Game = function Game() {
    //fo reference to this object in other functions
    var self = this;
    
    //entities that will be created
    var entities = {};
  
    for (var i = 0; i < 1; i++) {
        var entity = new ECS.Entity();
        entity.addComponent(new ECS.Components.Appearance($("#ball")[0]));
        entity.addComponent(new ECS.Components.Position());

        entities[entity.id] = entity;
    }

    //set the ECS' entities to the game's entities
    ECS.entities = entities;

    //sytems to be put in array to iterate over
    var systems = [
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
$(document).ready(function () {
    //sometimes the image tags are ready but the image themselves are not
    //so I got the amount of image tags that have the class 'sprite'
    //and when they load, increment a counter
    var spritesloaded = 0;
    var spriteAmt = $('.sprite').length;
    $('.sprite').on('load', function () {
        spritesloaded++;
        //try to start game
        startGame();
    });

    //this only starts the game when the counter equals the amount of 'sprite' classes
    function startGame(){
        if (spritesloaded >= spriteAmt) {
            ECS.context = $("#main-canvas")[0].getContext("2d");
            ECS.context.imageSmoothingEnabled= false
            ECS.game = new ECS.Game();
        }
    }

});