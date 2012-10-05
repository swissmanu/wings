# Templates

## Test Specification

	define(['dependencyX'], function (DependencyX) {
		describe('xy', function() {
			
		});
	});

## Documentation
Following a few templates how to document code fragments.

Please notice that the subtopics like "Emitted events", "See" etc are free to
use for all fragments (maybe an "Inherits from" is not needed for every class,
but you probably want to reference another method when describing one specific,
so just add a "See" topic there).

### Class
	/** Class: MyClass
	 * This is the description
	 *
	 * Inherits from:
	 *     - <MyParentClass>
	 *
	 * See:
	 *     - <LookAtMeToo>
	 */

### Public method
	/** Function: publicFunction(param1)
	 * This is the description
	 *
	 * Parameters:
	 *     (MyClass) param1 - <MyClass> instance to use
	 *
	 * Returns:
	 *     (String) - a string
	 */

### Private method
	/** PrivateFunction: privateFunction(param1, param2)
	 * This is the description
	 *
	 * Parameters:
	 *     (MyClass) param1 - <MyClass> instance to use
	 *
	 * Returns:
	 *     (String) - a string
	 */

### Event handler
When creating a "class-wide" event handler, use this style of documentation to
add comments:

	/** Event Handler: eventName
	 * Handles eventName ... etc
	 */