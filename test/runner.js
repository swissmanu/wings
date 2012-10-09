var fs = require('fs');
var path = require('path');
var requirejs = require('requirejs');
var Mocha = require('mocha');
var chai = require('chai');

/* Code Coverage Report? */
var libPath = path.join('..', 'lib');
var reporter = 'progress';

process.argv.forEach(function(value, index, array) {
	if(value === '--coverage') {
		libPath = './coverage-tmp/';
		reporter = 'html-cov';
	}
});

/* Setup: */
requirejs.config({
	nodeRequire: require
	,baseUrl: __dirname
	,paths: {
		wings: path.join(libPath, 'wings')
		,helpers: path.join(libPath, 'helpers')
	}
});

var mocha = new Mocha({
	ui: 'bdd'
	,reporter: reporter
});

global.define = require('requirejs');
global.assert = chai.assert;
global.expect = chai.expect;
global.should = chai.should();

/* Look for the files: */
directoryWalker(__dirname+'/spec')
	.filter(function(file) { return (file.substr(-3) === '.js') })
	.forEach(function(file) { mocha.addFile(file); });
	
/* Run Tests: */
mocha.run();




/** Function: directoryWalker(root)
 * Lists all files of a specific root directory recursivly.
 *
 * Parameters:
 *     (String) root - Path to the root directory you want to list
 *
 * Returns:
 *     (Array) of files
 */
function directoryWalker(root) {
	var files = [];
	var currentFiles;
	var nextDirs;
	var isDir = function(directoryname){
		return fs.statSync(path.join(root, directoryname)).isDirectory();
	};
	var prependRoot = function(directoryname){
		return path.join(root, directoryname);
	};

	currentFiles = fs.readdirSync(root);
	nextDirs = currentFiles.filter(isDir);
	currentFiles = currentFiles.map(prependRoot);

	files = files.concat(currentFiles);

	while(nextDirs.length) {
		files = files.concat(directoryWalker(path.join(root, nextDirs.shift())));
	}

	return files;
}