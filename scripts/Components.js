/** 
 * Components are just data. Should not do anything on their own.
 * That is for Systems to handle
 */


/**
 * Voice
 * something to output
 */
ECS.Components.Voice = function ComponentVoice( message ){
    this.message = message || "sound";
    this.deathMessage;
    return this;
}
ECS.Components.Voice.prototype.name = 'voice';

/**
 * Appearance
 */
ECS.Components.Appearance = function ComponentAppearance( image, params ){
    //params for whatever appearance related data
    params = params || {};
    
    this.image = null;
    this.width = params.width || 0;
    this.height = params.height || 0;
    
    //if paramter image is given
    if(image){
        console.log('w:'+ image.width , 'h:'+image.height);
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }
    return this;
}
ECS.Components.Appearance.prototype.name = 'appearance';

/**
 * Position
 */
ECS.Components.Position = function ComponentPosition (params){
    params = params || {};
    
    this.x = params.x || 0;
    this.y = params.y || 0;
    
    return this;
}
ECS.Components.Position.prototype.name = 'position';

/**
 * if entity is player controlled
 * provide array of functions to do for keys
 */
ECS.Components.PlayerControlled = function ComponentPlayerControlled(keyFunctions){
    this.keyFunctions = keyFunctions || [];
    
    //keyFunctions is an array that is indexed by keyCodes
    //ex: keyFunctions[23] is a function tied to a key with the keyCode 23
};
ECS.Components.PlayerControlled.prototype.name = 'playerControlled';