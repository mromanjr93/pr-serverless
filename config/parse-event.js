module.exports.extractBody = function(event){
    return JSON.parse(event.body);
}

module.exports.extractParams = function(event){
    return event.queryStringParams;
}