// This comment is at the beginning of this file
var assert = require('assert');

var async = require('../async');

describe('async', function(){
    it('should allow "standard" functions to be yielded', function(done){
	var fs = require('fs');
	var readFile = async.thunkify(fs.readFile);
	async.run(function*() {
	    var content = yield readFile(__dirname + '/async-test.js', 'utf-8');
	    return content.split('\n')[0];
	}, function(err, res) {
	    assert.ifError(err);
	    assert.equal(res, '// This comment is at the beginning of this file');
	    done();
	});
    });
    it('should propagate errors to the generator function', function(done){
	var fs = require('fs');
	var readFile = async.thunkify(fs.readFile);
	async.run(function*() {
	    try {
		var content = yield readFile('fileThatDoesNotExist.txt');
		assert(false, 'We should not be here');
	    } catch(e) {
		assert.equal(e.message, "ENOENT, open 'fileThatDoesNotExist.txt'");
	    }
	}, done);
    });
    it('should propagate exceptions unhandled by the generator function to the run callback', function(done){
	var fs = require('fs');
	var readFile = async.thunkify(fs.readFile);
	async.run(function*() {
	    throw Error('foo');
	}, function(err, content) {
	    try {
		assert.equal(err.message, "foo");
		done();
	    } catch(e) {
		done(e);
	    }
	});
    });

    it('should propagate exceptions unhandled by the generator function to the run callback', function(done){
	var fs = require('fs');
	var readFile = async.thunkify(fs.readFile);
	async.run(function*() {
	    try{
		var content = yield readFile('fileThatDoesNotExist.txt', 'utf-8');
	    } catch(e) {
		throw e;
	    }
	}, function(err, content) {
	    try {
		assert.equal(err.message, "ENOENT, open 'fileThatDoesNotExist.txt'");
		done();
	    } catch(e) {
		done(e);
	    }
	});
    });

    describe('.async(genfunc)', function(){
	it('should return an asynchronous function executing the generator', function(done){
	    var fs = require('fs');
	    var readFile = async.thunkify(fs.readFile);
	    function* readFirstLine() {
		var content = yield readFile(__dirname + '/async-test.js', 'utf-8');
		return content.split('\n')[0];
	    }
	    var readFirstLineAsync = async.async(readFirstLine);
	    readFirstLineAsync(function(err, line) {
		assert.ifError(err);
		assert.equal(line, '// This comment is at the beginning of this file');
		done();
	    })
	});

    });


});
