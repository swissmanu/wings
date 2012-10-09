# Wings
This is a complete GUI framework which uses a 2D context of an HTML canvas DOM
element.

## *Disclaimer*
*Wings is under development. For the moment, the drawing system is fully functional.
Currently the completion of the event engine is my main task.*

## Integration
### RequireJS Project
The most effective way to integrate Wings is using the source directly by linking
it into your RequireJS environment.

To do so, add Wings as dependency to your `package.json`:

````javascript
"dependencies" : {
	"wings": "git://github.com/swissmanu/wings.git"
}
````

Run `npm install` in your projects root directory to fetch the latest version
of Wings. Only one step left: Add Wings to the `paths` section of RequireJS:

````javascript
requirejs.config({
	paths: {
		wings: '../node_modules/Wings/lib/wings'
	}
});
````
	
Thats it! RequireJS should now be able to include any of Wings modules:

````javascript
var CanvasWrapper = require('wings/CanvasWrapper');
var canvasWrapper = new CanvasWrapper(document.getElementById('view'));
````
	
### Standalone Library
In case you are not using a sophisticated RequireJS ecosystem, you can use the
built version of Wings. It includes the [almond](https://github.com/jrburke/almond)
module loader and provides a global object which you can use to access Wings'
modules.

1. Clone the Wings repository to your local machine
2. Install all dependencies using `cd Wings && npm install`
3. Build your version of Wings with `jake dist`
4. Pick up `dist/wings.js` and integrate it as any other javascript file into
   your webpage

````html
<head>
	<script type="text/javascript" src="js/wings.js"></script>
</head>
````

5. You have access to Wings' modules using the global available `wings` object:

````javascript
var canvasWrapper = new wings.CanvasWrapper(ocument.getElementById('view'));
````



## Jake
Wings uses [jake](https://github.com/mde/jake) for building distributables,
documentation and running tests.

	jake docs            # Create Documentation using NaturalDocs  
	jake test            # Run all tests  
	jake test-coverage   # Run all tests and create a code coverage report under test/coverage.html  
	jake dist            # Build Wings Distributable
	
## Tests
Test specifications are implemented using [mocha](http://visionmedia.github.com/mocha/)
and [Chai](http://chaijs.com/).
Please use [should](http://chaijs.com/guide/styles/#styles) assertions.

### Code Coverage
If you have [jscoverage](http://siliconforks.com/jscoverage/) installed on your
machine, you can create detailed test code coverage reports using the `test-coverage`
Jake task.
This will create an HTML file under `test/coverage.html` containing the report.

The most simple way to install `jscoverage` works via [Homebrew](http://mxcl.github.com/homebrew/):

	brew install jscoverage

## Demo & Development
A short demonstration of Wings's features is implemented in `demo/demo.js`.
`demo/dev.html` loads each module from its own file dynamically. Perfect for 
trying out your latest code modifications.