# Widgetery
This is a complete GUI framework which uses a 2D context of an HTML canvas DOM
element.

## Requirments & Dependencies
### Development
Following npm modules should be installed if you want to use unit testing and
CI:

* jake
* mochajs
* should
* requirejs

Just install all required packages using `npm install` after cloning the 
repository.

## Docoumentation
Create a browsable documentation with: 

	jake docs

Make sure you have `naturaldocs` installed on your system. Building the
documentation will fail otherwise. (Easiest way on OS X: `brew install naturaldocs`)

### Documentation templates
Following a few templates how to document code fragments.

Please notice that the subtopics like "Emitted events", "See" etc are free to
use for all fragments (maybe an "Inherits from" is not needed for every class,
but you probably want to reference another method when describing one specific,
so just add a "See" topic there).

#### Class
	/** Class: MyClass
	 * This is the description
	 *
	 * Inherits from:
	 *     - <MyParentClass>
	 *
	 * See:
	 *     - <LookAtMeToo>
	 */

#### Public method
	/** Function: publicFunction(param1)
	 * This is the description
	 *
	 * Parameters:
	 *     (MyClass) param1 - <MyClass> instance to use
	 *
	 * Returns:
	 *     (String) - a string
	 */

#### Private method
	/** PrivateFunction: privateFunction(param1, param2)
	 * This is the description
	 *
	 * Parameters:
	 *     (MyClass) param1 - <MyClass> instance to use
	 *
	 * Returns:
	 *     (String) - a string
	 */

#### Event handler
When creating a "class-wide" event handler, use this style of documentation to
add comments:

	/** Event Handler: eventName
	 * Handles eventName ... etc
	 */	 
	 
	 
## Unit Tests
Unit tests are available using `mocha.js` and `should`. Run with:

	jake test


### Test Template
To create a new test file, use the following template to make it runnable with
node.js:

	var requirejs = require('requirejs');
	requirejs.config({ baseUrl: __dirname + '/../../lib' });  // path to lib-root
	requirejs(['ModuleXY'], function (ModuleXY) {
		
		describe('xy', function() {
			
		});
		
	});

## 3rd Party Files
* `Emitter` powered by [UIKit](https://github.com/visionmedia/uikit)