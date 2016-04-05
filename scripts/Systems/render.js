var scale = 3;

ECS.systems.render = function systemRender ( entities ){
    var  curEntity;
    

    for( var entityId in entities){
        
        curEntity = entities[entityId];

        if( curEntity.components.appearance && curEntity.components.position ){
            
            
            ECS.context.drawImage(curEntity.components.appearance.image,
                                  curEntity.components.position.x * scale,
                                  curEntity.components.position.y * scale,
                                  curEntity.components.appearance.width * scale,
                                  curEntity.components.appearance.height * scale );
                                  
            //console.log(curEntity.components.appearance.height)
                                  
        }
    }
}