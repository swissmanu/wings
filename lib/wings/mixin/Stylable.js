/** Class: Stylable
 *
 */
define(function(require, exports, module) {
	
	/** Constructor: Stylable()
	 */
	var Stylable = function Stylable() {
		var _self = this;
		var _backgroundColor = 'none';
		var _borderColor = 'none';
		
		
		_self.getBackgroundColor = function getBackgroundColor() {
			return _backgroundColor;
		};
		
		_self.setBackgroundColor = function setBackgroundColor(newColor) {
			var oldColor = _backgroundColor;
			_backgroundColor = newColor;
			
			if(oldColor !== newColor) {
				_self.dispatchEvent('widget:backgroundcolorchanged', {oldColor:oldColor, newColor:newColor, widget:_self});
			}
		};
		
		_self.getBorderColor = function getBorderColor() {
			return _borderColor;
		};
		
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