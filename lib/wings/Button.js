/** Class: Button
 *
 * Emitted events:
 *     textChanged - Triggered when the <Button>s text was changed.
 *                   Parameters: [(String) oldText, (String) newText,
 *                   (Widget) widget]
 *     iconChanged - Triggered when the <Button>s icon was changed.
 *                   Parameters: [(Function) oldIcon, (Function) newIcon,
 *                   (Widget) widget]
 *
 * Inherits from:
 *     - <Widget>
 */
define(function(require, exports, module) {
	
	var Widget = require('./Widget');
		
	/** Constructor: Button(text)
	 * Creates a new instance of <Button>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the button (optional)
	 */
	var Button = function Button(text) {
		var _self = this;
		var _text = text || '';
		var _icon;
		var _iconPadding = 5;
		
		Widget.call(this);
		
		/** Event Handler: textChanged, iconChanged
		 * Triggers a redraw as soon as the text or the icon of this <Button>
		 * was changed.
		 */
		_self.on(['button:textchanged','button:iconchanged'], function(oldValue, newValue, widget) {
			_self.redraw();
		});
		
		
		/** Function: drawWidget(ctx)
		 * Draws the <Level>, currently present in "_level".
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

			if(!_self.getState()) {
				background = 'darkgray';
			}
			
			ctx.strokeStyle = 'black';
			ctx.fillStyle = background;
			ctx.fillRect(0,0,width,height);
			ctx.strokeRect(0,0,width,height);
			
			if(_icon) {
				var iconWidth = width-_iconPadding*2;
				var iconHeight = height-_iconPadding*2;
				ctx.save();
				ctx.translate(_iconPadding, _iconPadding);
				ctx.rect(0,0,iconWidth,iconHeight);
				ctx.clip();
				_icon(ctx, iconWidth, iconHeight);
				ctx.restore();
			} else if(_text && _text.length > 0) {
				var textWidth = ctx.measureText(_text).width;
				ctx.fillStyle = 'black';
				ctx.textBaseline = 'middle';
				ctx.fillText(_text, (width-textWidth)/2, height/2);
			}
		}
		
		/** Function: setText(newText)
		 * Sets the text which is displayed on this <Button>.
		 *
		 * Emitted events:
		 *     textChanged - Triggered when the <Button>s text was changed.
		 *                   Parameters: [(String) oldText, (String) newText,
		 *                   (Widget) widget]
		 */
		_self.setText = function setText(newText) {
			var oldText = _text;
			_text = newText;
			_self.dispatchEvent('button:textchanged', {oldText:oldText, newText:newText});
		}
		
		/** Function: getText()
		 * Returns the <Button>s current text.
		 *
		 * Returns:
		 *     (String)
		 */
		_self.getText = function getText() {
			return _text;
		}
		
		/** Function: setIcon(icon)
		 * Sets the icon of this <Button>.
		 *
		 * Emitted events:
		 *     iconChanged - Triggered when the <Button>s icon was changed.
		 *                   Parameters: [(Function) oldIcon, (Function)
		 *                   newIcon, (Widget) widget]
		 *
		 * Parameters:
		 *     (Function) icon - A function which draws an icon in given
		 *                       context with specified width and height.
		 *                       Parameters: [(Context) ctx, (int) width,
		 *                       (int) height]
		 */ 
		_self.setIcon = function setIcon(newIcon) {
			var oldIcon = _icon;
			_icon = newIcon;
			_self.dispatchEvent('button:iconchanged', {oldIcon:oldIcon, newIcon:newIcon});
		}
		
		/** Function: getIcon()
		 * Returns the current icon of this <Button>.
		 *
		 * Returns:
		 *     (Function|undefined) - icon draw function
		 */
		_self.getIcon = function getIcon() {
			return _icon;
		}
		
	};
	
	Button.prototype = Object.create(Widget.prototype);
	Button.prototype.constructor = Button;
	
	return Button;
});