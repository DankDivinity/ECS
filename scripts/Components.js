/*
Components are just data. Should not do anything on their own. That
is for Systems to handle
*/

//Voice
//something to output

ECS.Components.Voice = function ComponentVoice( message ){
    this.message = message || "sound";
    this.deathMessage;
    return this;
}
ECS.Components.Voice.prototype.name = 'voice';

//Appearance
ECS.Components.Appearance = function ComponentAppearance( image, params ){
    params = params || {};
    
    this.image = null;
    this.width = 0;
    this.height = 0;
    if(image){
        console.log('w:'+ image.width , 'h:'+image.height);
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }
    return this;
}
ECS.Components.Appearance.prototype.name = 'appearance';

ECS.Components.Position = function ComponentPosition (params){
    params = params || {};
    
    this.x = params.x || 10;
    this.y = params.y || 10;
    
    return this;
}
ECS.Components.Position.prototype.name = 'position';