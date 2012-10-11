/** Class: BoxLayout
 *
 * Inherits from:
 *     - <LayoutManager>
 */
define(function(require, exports, module) {
	
	var LayoutManager = require('./LayoutManager');
	
	
	/** Constructor: Label(text)
	 * Creates a new instance of <Label>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the Label (optional)
	 */
	var BoxLayout = function BoxLayout() {
		var _self = this;
		
		LayoutManager.call(this);
		
		/** Function: layoutWidgets(parent, widgets)
		 * Takes an array of <Widget>s and positions them inside parents bounds.
		 *
		 * Parameters:
		 *     (Widget) parent
		 *     (Array) widgtes - An Array containing parents children
		 */
		_self.layoutWidgets = function layoutWidgets(parent, widgets) {
			var size = parent.getSize();
			var left = 0;
			
			for(var i=0, l=widgets.length; i<l; i++) {
				widgets[i].setPosition(left,0);
				left += widgets[i].getSize().width;
			}
			
		}
		
	};
	
	BoxLayout.prototype = Object.create(LayoutManager.prototype);
	BoxLayout.prototype.constructor = BoxLayout;
	
	return BoxLayout;
});