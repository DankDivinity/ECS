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

      if(curEntity.components.position.x >= ECS.game.width ||
         curEntity.components.position.x < 0 ||
         curEntity.components.position.y >= ECS.game.height ||
         curEntity.components.position.y < 0){
           console.log('deleted');
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
