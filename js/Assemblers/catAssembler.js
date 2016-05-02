/**
 * Assembler for cats..
 * assmebler just nicer way to
 * organize and make entities that
 * are the same
 */

ECS.assemblers.cat = function catAssembler(entity, spawnWidth, spawnHeight){
    var cat = entity;

    var x = 0, y = 0;

    //spawn or edge of screen randomly
    if(Math.random() < .5){
        x = Math.random() * spawnWidth;
        y = Math.round(Math.random()) * spawnHeight;
    }else{
        y = Math.random() * spawnHeight;
        x = Math.round(Math.random()) * spawnWidth;
    }

    cat.addComponent(new ECS.Components.Appearance($('#cat')[0]));
    cat.addComponent(new ECS.Components.Position({x:x,y:y}));
    cat.addComponent(new ECS.Components.Cat());
    cat.addComponent(new ECS.Components.Collidable());

    return cat;
}
