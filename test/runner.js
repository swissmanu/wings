var fs = require('fs');
var wrench = require('wrench');
var path = require('path');
var requirejs = require('requirejs');
var should = require('should');
var Mocha = require('mocha');

requirejs.config({
	nodeRequire: require
	,baseUrl: __dirname
	,paths: {
		widgetery: '../lib/widgetery'
		,helpers: '../lib/helpers'
	}
});

global.define = require('requirejs');


var mocha = new Mocha({
	ui: 'bdd'
	,reporter: 'progress'
});

wrench.readdirSyncRecursive(__dirname+'/spec').filter(function(file) {
	return (file.substr(-3) === '.js')
}).forEach(function(file) {
	mocha.addFile(path.join(__dirname+'/spec',file))
});

mocha.run();