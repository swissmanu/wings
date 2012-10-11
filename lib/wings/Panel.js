/** Class: Panel
 *
 * Inherits from:
 *     - <Widget>
 */
define(function(require, exports, module) {
	
	var Widget = require('./Widget');
	
	/** Constructor: Panel(text)
	 * Creates a new instance of <Panel>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the Panel (optional)
	 */
	var Panel = function Panel(text) {
		var _self = this;
		var _backgroundColor = 'none';
		var _borderColor = 'none';
		
		
		Widget.call(this);	
		
		/** Event Handler: widget:backgroundcolorchanged
		 * If the <Widget> changes is position or size, a drawRequest event is
		 * emitted by calling <Widget.redraw()>.
		 */
		_self.on(['widget:backgroundcolorchanged','widget:bordercolorchanged'],
			function(event) {
				event.stopBubbling();
				_self.redraw();
		});
		
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
			
			ctx.strokeStyle = _borderColor;
			ctx.fillStyle = _backgroundColor;
			ctx.fillRect(0,0,width,height);
			ctx.strokeRect(0,0,width,height);
		}
		
		_self.getBackgroundColor = function getBackgroundColor() {
			return _backgroundColor;
		}
		
		_self.setBackgroundColor = function setBackgroundColor(newColor) {
			var oldColor = _backgroundColor;
			_backgroundColor = newColor;
			
			if(oldColor !== newColor) {
				_self.dispatchEvent('widget:backgroundcolorchanged', {oldColor:oldColor, newColor:newColor, widget:_self});
			}
		}
		
		_self.getBorderColor = function getBorderColor() {
			return _borderColor;
		}
		
		_self.setBorderColor = function setBorderColor(newColor) {
			var oldColor = _borderColor;
			_borderColor = newColor;
			
			if(oldColor !== newColor) {
				_self.dispatchEvent('widget:bordercolorchanged', {oldColor:oldColor, newColor:newColor, widget:_self});
			}
		}
		
		
	};
	
	Panel.prototype = Object.create(Widget.prototype);
	Panel.prototype.constructor = Panel;
	
	return Panel;
});