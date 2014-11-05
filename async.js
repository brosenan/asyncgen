"use strict";
exports.thunkify = function(func) {
    return function() {
	var args = Array.prototype.slice.call(arguments);
	return function(cb) {
	    return func.apply(this, args.concat([cb]));
	};
    };
};

exports.run = function(func, cb) {
    var gen = func();
    next();

    function next(err, val) {
	try {
	    if(err) gen.throw(err);

	    var iter = gen.next(val);
	    if(iter.done) return cb(undefined, iter.value);
	
	    iter.value.call(this, next);
	} catch(e) {
	    return cb(e);
	}
    }
};

