# Widgetery
This is a complete GUI framework which uses a 2D context of an HTML canvas DOM
element.

## Jake
Widgetery uses [jake](https://github.com/mde/jake) for building distributables,
documentation and running tests.

	jake docs            # Create Documentation using NaturalDocs  
	jake test            # Run all tests  
	jake test-coverage   # Run all tests and create a code coverage report under test/coverage.html  
	jake dist            # Build Widgetery Distributable
	
## Tests
Test specifications are implemented using [mocha](http://visionmedia.github.com/mocha/)
and [Chai](http://chaijs.com/).
Please use [should](http://chaijs.com/guide/styles/#styles) assertions.

### Code Coverage
If you have [jscoverage](http://siliconforks.com/jscoverage/) installed on your
machine, you can create detailed test code coverage reports using the `test-coverage`
Jake task.
	
This will create an HTML file under `test/coverage.html` containing the report.

One of the most simple ways to install `jscoverage` is using [Homebrew](http://mxcl.github.com/homebrew/):

	brew install jscoverage

## Demo
A short demonstration of Widgetery's features is implemented in `demo/demo.js`.
You can run this demo in two different ways. Load one of the following files in
your browser:

* `demo/dev.html` loads each module from its own file dynamically. Perfect for
  trying out your latest code modifications.
* `demo/dist.html` fetchs the distributable version of Widgetery for running
  the demo. Make sure you run `jake dist` before you open this demonstration.