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
    this.params = params || {};
    
    this.image = null;
    this.width = this.params.width || 0;
    this.height = this.params.height || 0;
    
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

/**
 * Component to identify entity as Cat
 * also has a speed that increases
 * for each cat, and spx and spy that is for direction
 */
ECS.Components.Cat = function ComponentCat() {
    this.speed = 3 + ECS.Components.Cat.prototype.amount * 0.5;
    //speedx, speedy
    //set zero..will use this as an example for
    //assembler
    this.spx = 0;
    this.spy = 0;
    this.started = true;
}
ECS.Components.Cat.prototype.name = 'cat';
ECS.Components.Cat.prototype.amount = 0;
