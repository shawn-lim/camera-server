function Database(){
    this.name = "this is a name";

    function defaultBehavior(){
        throw "Function not implemented";
    }

    var images = {};

    images.create= defaultBehavior;
    images.find = defaultBehavior;

    return {
        images: images
    };
}

module.exports = Database;
