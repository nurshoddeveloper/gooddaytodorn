const AmpersandState = require('ampersand-state');
const Moment = require('moment');

const gdDateDataType = {
    // set called every time someone tried to set a property of this datatype
    set : function(newVal){
        if(newVal instanceof Moment){
            // console.log("is GDAmpersandTypeDate class val",newVal);
            return {
                val : newVal,
                type : 'gd-date'
            };
        } else {
            // console.log("not GDAmpersandTypeDate class val so need creating new class", newVal);
            return {
                val : (newVal)?Moment(newVal):null,
                type : 'gd-date'
            };
        }
    },

    // get: function() {
    //   console.log("get");
    // },

    compare : function(currentVal, newVal, attributeName){

        // console.log("compare",arguments);

        // Should return true if oldVal and newVal are equal.

        if (!currentVal) {
            if (!newVal) return true;
            else return false;
        }

        if (!newVal) {
            if (!currentVal) return true;
            else return false;
        }

        return currentVal.isSame(newVal,'days'); // equals(newVal);
    }
};

const gdDatetimeDataType = {

    set : function(newVal){
        if(newVal instanceof Moment){
            return {
                val : newVal,
                type : 'gd-datetime'
            };
        } else {
            return {
                val : (newVal)?Moment.utc(newVal).local():null,
                type : 'gd-datetime'
            };
        }
    },

    compare : function(currentVal, newVal, attributeName){
        if (!currentVal) {
            if (!newVal) return true;
            else return false;
        }

        if (!newVal) {
            if (!currentVal) return true;
            else return false;
        }

        return currentVal.isSame(newVal);
    }
};

const AmpersandStateExtended = AmpersandState.extend({

    dataTypes : {
        'gd-date' : gdDateDataType,
        'gd-datetime': gdDatetimeDataType
    }

});

module.exports = AmpersandStateExtended;