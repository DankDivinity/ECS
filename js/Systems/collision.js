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
