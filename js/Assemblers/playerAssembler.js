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
