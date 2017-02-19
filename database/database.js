
function Database(){

}

function defaultBehavior(){
    throw "Function not implemented";
}

Database.prototype.images.create = defaultBehavior;
Database.prototype.images.find = defaultBehavior;

module.exports = Database;
