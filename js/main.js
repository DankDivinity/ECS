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
