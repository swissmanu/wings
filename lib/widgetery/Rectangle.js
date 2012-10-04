/** Class: Rectangle
 *
 * Inherits from:
 *     - <MouseWidget>
 */
define(function(require, exports, module) {
	
	var MouseWidget = require('./MouseWidget');
		
	/** Constructor: Rectangle(text)
	 * Creates a new instance of <Rectangle>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the Rectangle (optional)
	 */
	var Rectangle = function Rectangle(text) {
		var _self = this;
		
		MouseWidget.call(this);
		
		
		/** Function: drawWidget(ctx)
		 *
		 * Overrides:
		 *     - <Widget.draw(ctx)>
		 * 
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw instance
		 */
		_self.drawWidget = function drawWidget(ctx) {
			var width = _self.getWidth();
			var height = _self.getHeight();
			var background = 'lightgray';
			
			ctx.strokeStyle = 'black';
			ctx.fillStyle = background;
			ctx.fillRect(0,0,width,height);
			ctx.strokeRect(0,0,width,height);
		}
		
	};
	
	Rectangle.prototype = Object.create(MouseWidget.prototype);
	Rectangle.prototype.constructor = Rectangle;
	
	return Rectangle;
});