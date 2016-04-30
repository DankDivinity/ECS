
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

