ECS.Game = function Game() {
    var self = this;

    var entities = {};
    var entity;

    for (var i = 0; i < 1; i++) {
        entity = new ECS.Entity();
        entity.addComponent(new ECS.Components.Appearance($("#ball")[0]));
        entity.addComponent(new ECS.Components.Position());

        entities[entity.id] = entity;
    }

    ECS.entities = entities;

    var systems = [
        ECS.systems.render
    ];

    function gameLoop() {
        for (var i = 0; i < systems.length; i++) {
            systems[i](ECS.entities);
        }

        if (self._running !== false) {
            requestAnimationFrame(gameLoop);
        }
    }

    requestAnimationFrame(gameLoop);

    this._running = true;
    this.endGame = function endGame() {
        self._running = false;
    };

    return this;
}

$(document).ready(function () {
    var spritesloaded = 0;
    var spriteAmt = $('.sprite').length;
    $('.sprite').on('load', function () {
        spritesloaded++;
        startGame();
    });

    function startGame(){
        if (spritesloaded >= spriteAmt) {
            ECS.context = $("#main-canvas")[0].getContext("2d");
            ECS.context.imageSmoothingEnabled= false
            ECS.game = new ECS.Game();
        }
    }

});