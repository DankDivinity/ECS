/**
 * render
 * note Systems are more like functions that do
 */
ECS.systems.render = function systemRender(entities) {
    clearScreen();
    //just a variable to be used
    var curEntity;

    //iterate through entities
    for (var entityId in entities) {
        curEntity = entities[entityId];

        //entity needs an appearance and position
        if (curEntity.components.appearance && curEntity.components.position) {
            var scale = ECS.systems.render.prototype.scale;

            //draw the image if it has one
            if (curEntity.components.appearance.image) {
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

function clearScreen(){
    ECS.context.clearRect(0, 0, ECS.canvas.width, ECS.canvas.height);
}