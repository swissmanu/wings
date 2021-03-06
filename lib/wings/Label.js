/** Class: Label
 *
 * Inherits from:
 *     - <Widget>
 *
 * Mixes with:
 *     - <Stylable>
 */
define(function(require, exports, module) {
	
	var Widget = require('./Widget');
	var Stylable = require('./mixin/Stylable');
	
	/** Constructor: Label(text)
	 * Creates a new instance of <Label>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the Label (optional)
	 */
	var Label = function Label(text) {
		var _self = this;
		var _text = text || '';
		
		Widget.call(this);
		Stylable.call(this);
		
		/** Event Handler: textChanged
		 * Triggers a redraw as soon as the text of this <Label> was changed.
		 */
		_self.on(['label:textchanged'], function(oldValue, newValue, widget) {
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
			
			ctx.save();
			ctx.fillStyle = _self.getBackgroundColor();
			ctx.fillRect(0,0,width,height);
			ctx.strokeStyle = _self.getBorderColor();
			ctx.strokeRect(0,0,width,height);
			ctx.restore();
			
			if(_text && _text.length > 0) {
				var textWidth = ctx.measureText(_text).width;
				ctx.fillStyle = 'black';
				ctx.textBaseline = 'middle';
				ctx.font = "10px Verdana";
				ctx.fillText(_text, ((width-textWidth)/2), height/2);
			}
		}
		
		/** Function: setText(newText)
		 * Sets the text which is displayed on this <Label>.
		 *
		 * Emitted events:
		 *     textChanged - Triggered when the <Label>s text was changed.
		 *                   Parameters: [(String) oldText, (String) newText,
		 *                   (Widget) widget]
		 */
		_self.setText = function setText(newText) {
			var oldText = _text;
			_text = newText;
			_self.dispatchEvent('label:textchanged', {oldText:oldText, newText:newText, widget:_self});
		}
		
		/** Function: getText()
		 * Returns the <Label>s current text.
		 *
		 * Returns:
		 *     (String)
		 */
		_self.getText = function getText() {
			return _text;
		}
		
	};
	
	Label.prototype = Object.create(Widget.prototype);
	Label.prototype.constructor = Label;
	
	return Label;
});