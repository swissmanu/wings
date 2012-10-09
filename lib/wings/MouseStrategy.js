/** Class: MouseStrategy
 * A <MouseStrategy> picks native mouse events from a <CanvasWrapper> and
 * translates them into Wings internal events.
 *
 * See also:
 *     - <DefaultStrategy>
 *     - <DragAndDropStrategy>
 *
 * Inherits from:
 *     - <Emitter>
 */
define(function(require, exports, module) {
	
	var Emitter = require('helpers/Emitter');
	
	
	/** Constructor: MouseStrategy()
	 * Creates a new instance of <MouseStrategy>
	 */
	var MouseStrategy = function MouseStrategy(canvasWrapper) {
		var _self = this;
		var _canvasWrapper = canvasWrapper;
		
		Emitter.call(this);
		
		/** Function: mouseMoved(absolutePosition)
		 * The <CanvasWrapper> calls this method when the cursor was moved on
		 * the canvas.
		 *
		 * Parameters:
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */
		_self.mouseMoved = function mouseMoved(absolutePosition) {
			throw new Error('Implement mouseMoved!');
		}
		
		/** Function: mouseButtonPressed(button, absolutePosition)
		 * Called from the <CanvasWrapper> to delegate processing of a pressed
		 * mouse button.
		 *
		 * Parameters:
		 *     (int) button - Number of the pressed button
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */
		_self.mouseButtonPressed = function mouseButtonPressed(button, absolutePosition) {
			throw new Error('Implement mouseButtonPressed!');
		};

		/** Function: mouseButtonReleased(button, absolutePosition)
		 * Called from the <CanvasWrapper> to delegate processing of a released
		 * mouse button.
		 *
		 * Parameters:
		 *     (int) button - Number of the released button
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */		
		_self.mouseButtonReleased = function mouseButtonReleased(button, absolutePosition) {
			throw new Error('Implement mouseButtonReleased!');
		};
		
		/** Function: mouseButtonClicked(button, absolutePosition)
		 * Called from the <CanvasWrapper> when the mouse clicked somewhere on
		 * the canvas.
		 *
		 * Parameters:
		 *     (int) button - Number of the clicked button
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */
		_self.mouseButtonClicked = function mouseButtonClicked(button, absolutePosition) {
			throw new Error('Implement mouseButtonClicked!');
		};
			
		/** Function: getCanvasWrapper()
		 * Returns the <CanvasWrapper> which is in controll of this
		 * <MouseStrategy>.
		 *
		 * Returns:
		 *     (CanvasWrapper) - <CanvasWrapper> instance
		 */
		_self.getCanvasWrapper = function getCanvasWrapper() {
			return _canvasWrapper;
		};
		
	};
	
	MouseStrategy.prototype = Object.create(Emitter.prototype);
	MouseStrategy.prototype.constructor = MouseStrategy;
	
	return MouseStrategy;
});