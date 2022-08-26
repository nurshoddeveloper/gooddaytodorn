const ModulesReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

ModulesReset.prototype.validate = function(){
    return true;
};

ModulesReset.prototype.process = function(){
    gd.session.modules.reset(this.data,{parse:true});
};

module.exports = ModulesReset;
