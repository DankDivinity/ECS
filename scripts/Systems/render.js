/**
 * render
 * note Systems are more like functions that do
 */

ECS.systems.render = function systemRender(entities) {
    var scale = ECS.systems.render.prototype.scale;
    var lastScale = ECS.systems.render.prototype.lastScale;
    if(lastScale != scale){
        $(ECS.canvas).width()
    }
    clearScreen();
    //just a variable to be used
    var curEntity;

    //iterate through entities
    for (var entityId in entities) {
        curEntity = entities[entityId];

        //entity needs an appearance and position
        if (curEntity.components.appearance && curEntity.components.position) {
            if (curEntity.components.appearance.image) {
                ECS.context.drawImage(curEntity.components.appearance.image,
                    curEntity.components.position.x,
                    curEntity.components.position.y,
                    curEntity.components.appearance.width,
                    curEntity.components.appearance.height);
            } else {
                ECS.context.beginPath();
                ECS.context.arc(curEntity.components.position.x,
                    curEntity.components.position.y,
                    curEntity.components.appearance.params.radius,
                    0, 2 * Math.PI);
                ECS.context.stroke();
            }

        }
    }
    
}
ECS.systems.render.prototype.scale = 3;
ECS.systems.render.prototype.lastScale = 0;


function clearScreen() {
    ECS.context.clearRect(0, 0, ECS.canvas.width, ECS.canvas.height);
}
