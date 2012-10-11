/** Class: Stylable
 * The <Stylable> Mixin enables <Widget>s to maintain styling properties like
 * background color, border colors and more.
 *
 * See also:
 *     <Widget>
 */
define(function(require, exports, module) {
	
	/** Constructor: Stylable()
	 * Creates a new <Stylable> Mixin.
	 */
	var Stylable = function Stylable() {
		var _self = this;
		var _backgroundColor = 'none';
		var _borderColor = 'none';
		
		/** Function: getBackgroundColor()
		 * Returns the background color.
		 *
		 * Returns:
		 *     (String) CSS compliant color
		 */
		_self.getBackgroundColor = function getBackgroundColor() {
			return _backgroundColor;
		};
		
		/** Function: setBackgroundColor(newColor)
		 * Sets the background color.
		 * 
		 * Parameters:
		 *     (String) newColor - CSS compliant color
		 */
		_self.setBackgroundColor = function setBackgroundColor(newColor) {
			var oldColor = _backgroundColor;
			_backgroundColor = newColor;
			
			if(oldColor !== newColor) {
				_self.dispatchEvent('widget:backgroundcolorchanged', {oldColor:oldColor, newColor:newColor, widget:_self});
			}
		};
		
		/** Function: getBorderColor()
		 * Returns the border color.
		 *
		 * Returns:
		 *     (String) CSS compliant color
		 */
		_self.getBorderColor = function getBorderColor() {
			return _borderColor;
		};
		
		/** Function: setBorderColor(newColor)
		 * Sets the border color.
		 * 
		 * Parameters:
		 *     (String) newColor - CSS compliant color
		 */
		_self.setBorderColor = function setBorderColor(newColor) {
			var oldColor = _borderColor;
			_borderColor = newColor;
			
			if(oldColor !== newColor) {
				_self.dispatchEvent('widget:bordercolorchanged', {oldColor:oldColor, newColor:newColor, widget:_self});
			}
		};
		
	};
	
	return Stylable;
});