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
After building using `jake dist`, a short demonstration how to use Widgetery
is available under `demo/inline.html`.