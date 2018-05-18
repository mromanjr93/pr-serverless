module.exports.response = function (callback, bodyResponse) {
    let response = {}
    response.statusCode = bodyResponse.statusCode || 200;
    response.headers = {
        "Access-Control-Allow-Origin": "*",       
    };
    response.body = bodyResponse ? JSON.stringify(bodyResponse) : "{}";
    return callback(null, response);
}

