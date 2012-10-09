// see a complete list of options here:
// https://github.com/jrburke/r.js/blob/master/build/example.build.js
({
	out: './dist/wings.js'
	
	,baseUrl: './lib'
	,include: ['wings']

	,wrap: {
		start: '(function(global, define) {\n'+
			   // check for amd loader on global namespace
			   '  var globalDefine = global.define;\n'

		,end:  '  var library = require(\'wings\');\n'+
			   '  if(typeof module !== \'undefined\' && module.exports) {\n'+
			   // export library for node
			   '    module.exports = library;\n'+
			   '  } else if(globalDefine) {\n'+
			   // define library for global amd loader that is already present
			   '    (function (define) {\n'+
			   '      define(function () { return library; });\n'+
			   '    }(globalDefine));\n'+
			   '  } else {\n'+
			   // define library on global namespace for inline script loading
			   '    global[\'wings\'] = library;\n'+
			   '  }\n'+
			   '}(this));\n'
	}
	
	,name: '../node_modules/almond/almond'
	,optimize: 'none'
})