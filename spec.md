# TOC
   - [async](#async)
     - [.async(genfunc)](#async-asyncgenfunc)
   - [yield](#yield)
<a name=""></a>
 
<a name="async"></a>
# async
should allow "standard" functions to be yielded.

```js
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
```

should propagate errors to the generator function.

```js
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
```

should propagate exceptions unhandled by the generator function to the run callback.

```js
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
```

should propagate exceptions unhandled by the generator function to the run callback.

```js
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
```

<a name="async-asyncgenfunc"></a>
## .async(genfunc)
should return an asynchronous function executing the generator.

```js
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
```

<a name="yield"></a>
# yield
should support es6 generators.

```js
function* fib() {
    var prev = 0;
    var curr = 1;
    while(true) {
	yield curr;
	var tmp = curr + prev;
	prev = curr;
	curr = tmp;
    }
}
var n;
for(n of fib()) {
    if(n > 100) break;
}
assert.equal(n, 144);
```

