/**
 * render
 * note Systems are more like functions that do
 */

ECS.systems.render = function systemRender(entities) {
    var scale = ECS.systems.render.prototype.scale;
    var lastScale = ECS.systems.render.prototype.lastScale;
    if (lastScale != scale) {
        ECS.systems.render.prototype.lastScale = scale;
        $(ECS.canvas).width(ECS.game.width * scale);
        console.log('SCALED by', scale, 'RESIZED to', ECS.game.width, ECS.Game);
    }
    clearScreen();
    //just a variable to be used
    var curEntity;
    //iterate through entities
    for (var entityId in entities) {
        curEntity = entities[entityId];

        //entity needs an appearance and position
        if (curEntity.components.appearance && curEntity.components.position) {
            if (curEntity.components.appearance.image != null) {
                drawImage(curEntity.components.appearance.image,
                    curEntity.components.position.x,
                    curEntity.components.position.y,
                    curEntity.components.appearance.width,
                    curEntity.components.appearance.height);
            } else if (curEntity.components.text) {
                ECS.context.font = "30px Arial";
                if (curEntity.components.appearance.params.color) {
                    ECS.context.fillStyle = curEntity.components.appearance.params.color;
                } else {
                    ECS.context.fillStyle = 'black';
                }

                var staticText = ''
                    /* curEntity.components.text.params.staticText;
                                    if(!staticText)
                                      staticText = '';*/
                ECS.context.fillText(staticText + curEntity.components.text,
                    curEntity.components.position.x,
                    curEntity.components.position.y)
            }

        }
    }

}
ECS.systems.render.prototype.scale = 3;
ECS.systems.render.prototype.lastScale = 0;


function clearScreen() {
    ECS.context.clearRect(0, 0, ECS.canvas.width, ECS.canvas.height);
}

//to center drawing
function drawImage(image, x, y, w, h) {
    ECS.context.drawImage(image, x - w / 2, y - h / 2, w, h);
}
