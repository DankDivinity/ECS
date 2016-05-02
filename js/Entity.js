/**
 * The entity class
 */
ECS.Entity = function(){
    /**random number in hex plus a counter */
    this.id = ECS.Entity.prototype._count  + '' + (Math.random()*10000).toString(16);

    //add to counter
    ECS.Entity.prototype._count++;

    /** this is where the components for each entity go  */
    this.components = {};

    //just returning it so it can
    return this;
};

/**
 * these are using to prototype so its easier to see
 * what is class based and not object based
 */
ECS.Entity.prototype._count = 0;

/** add component and get entity returned for chaining */
ECS.Entity.prototype.addComponent = function addComponent( component ){
    this.components[component.name] = component;
    return this
};

/**
 * delete component from entity. pass string in, if it is actually
 * class/function then use prototype to get name
 */
ECS.Entity.prototype.removeComponent = function removeComponent( componentName ){
    var name = componentName;

    if(typeof componentName === 'function'){
        // get the name from the prototype of the passed component function
        name = componentName.prototype.name;
    }

    delete this.components[name];
    return this;
}
