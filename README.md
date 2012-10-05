# Widgetery
This is a complete GUI framework which uses a 2D context of an HTML canvas DOM
element.

## Jake
Widgetery uses `jake` for building distributables, documentation and running tests.

	jake docs       # Create Documentation using NaturalDocs  
	jake test       # Run Tests  
	jake dist       # Build Widgetery Distributable
	
## Tests
Test specifications are implemented using *mocha* and *Chai Assertion Library*.
Please use [should](http://chaijs.com/guide/styles/#styles) assertions.

## Demo
A short demonstration of Widgetery's features is implemented in `demo/demo.js`.
You can run this demo in two different ways. Load one of the following files in
your browser:

* `demo/dev.html` loads each module from its own file dynamically. Perfect for
  trying out your latest code modifications.
* `demo/dist.html` fetchs the distributable version of Widgetery for running
  the demo. Make sure you run `jake dist` before you open this demonstration.