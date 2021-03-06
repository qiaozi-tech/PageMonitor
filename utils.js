let toString = Object.prototype.toString;
let _ = module.exports = {};
/**
 * is
 * @param {*} source
 * @param {string} type
 * @returns {boolean}
 */
_.is = function(source, type){
    return toString.call(source) === '[object ' + type + ']';
};
/**
 * walk object and merge
 * @param {Object} obj
 * @param {Function} callback
 * @param {Object} merge
 */
_.map = function(obj, callback, merge){
    var index = 0;
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            if(merge){
                callback[key] = obj[key];
            } else if(callback(key, obj[key], index++)) {
                break;
            }
        }
    }
};
/**
 * merge target into source
 * @param {*} source
 * @param {*} target
 * @returns {*}
 */
_.merge = function(source, target){
    if(_.is(source, 'Object') && _.is(target, 'Object')){
        _.map(target, function(key, value){
            source[key] = _.merge(source[key], value);
        });
    } else {
        source = target;
    }
    return source;
};

/**
 * log type
 * @type {{DEBUG: string, WARNING: string, INFO: string, ERROR: string, NOTICE: string}}
 */
_.log = {
    DEBUG: '<[debug]>',
    WARNING: '<[warning]>',
    INFO: '<[info]>',
    ERROR: '<[error]>',
    NOTICE: '<[notice]>'
};
