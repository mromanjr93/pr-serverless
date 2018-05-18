module.exports.validate = function(data){
    let valid = true;
    let messages = [];
    if(!data.token){
        valid = false;
        messages.push('Token do dispositivo obrigatório');
    }

    if(!data.os){
        valid = false;
        messages.push('Sistema operacional do dispositivo obrigatório');
    }

    if(!data.newsletters || !data.newsletters.length){
        valid = false;
        messages.push('Informe ao menos uma newsletter');
    }

    return {
        valid: valid,
        messages: messages
    };
}