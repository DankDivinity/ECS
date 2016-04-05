/**
 * render
 * note Systems are more like functions that do
 */
ECS.systems.render = function systemRender(entities) {
    //just a variable to be used
    var curEntity;

    //iterate through entities
    for (var entityId in entities) {
        curEntity = entities[entityId];

        //entity needs an appearance and position
        if (curEntity.components.appearance && curEntity.components.position) {
            var scale = ECS.systems.render.prototype.scale;

            //draw the image if it has one
            if (curEntity.appearance.image) {
                ECS.context.drawImage(curEntity.components.appearance.image,
                    curEntity.components.position.x * scale,
                    curEntity.components.position.y * scale,
                    curEntity.components.appearance.width * scale,
                    curEntity.components.appearance.height * scale);
            }
        }
    }
}
ECS.systems.render.prototype.scale = 3;