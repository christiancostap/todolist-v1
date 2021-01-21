//jshint esversion:6


exports.getDate = function(){
    const options = {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long'
};
    return new Date().toLocaleDateString('pt-BR', options);;
};

exports.getDay = function(){
    const options = {
        day: 'numeric', 
    }; 
    return new Date().toLocaleDateString('pt-BR', options);
};


