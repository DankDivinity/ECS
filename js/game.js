
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
      entities[self.scoreEntityId].components.text.value = self.score;
    }
    this.updateHealth = function updateHealth(){
      entities[this.healthEntityId].components.text.value = ECS.player.components.health.amount;
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
      self.pause();
      $('#game-over-screen').show();
    };

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
        scoreEntity.addComponent(new ECS.Components.Text(self.score, {staticText: 'SCORE:', color: 'blue'}));
        scoreEntity.addComponent(new ECS.Components.Position({ x: 0, y: 30 }));

        entities[scoreEntity.id] = scoreEntity;
        //for reference to the score entity
        self.scoreEntityId = scoreEntity.id;

        var healthEntity = new ECS.Entity();
        healthEntity.addComponent(new ECS.Components.Appearance());
        healthEntity.addComponent(new ECS.Components.Text(player.components.health.amount, {staticText: 'HEALTH:', color: 'green'}));
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
