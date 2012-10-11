/** Class: BoxLayout
 *
 * Inherits from:
 *     - <LayoutManager>
 */
define(function(require, exports, module) {
	
	var LayoutManager = require('./LayoutManager');
	
	
	/** Constructor: BoxLayout()
	 * Creates a new instance of <BoxLayout>
	 *
	 * Parameters:
	 *     (int) horizontalMargin - Define the horizontal margin between
	 *                              layoutted <Widgets>s. Optional, Default = 5
	 */
	var BoxLayout = function BoxLayout(horizontalMargin) {
		var _self = this;
		var _horizontalMargin = (horizontalMargin !== undefined) ? horizontalMargin : 5;
		
		LayoutManager.call(this);
		
		/** Function: layoutWidgets(parent, widgets)
		 *
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
				left += widgets[i].getSize().width + _horizontalMargin;
			}
		}
		
	};
	
	BoxLayout.prototype = Object.create(LayoutManager.prototype);
	BoxLayout.prototype.constructor = BoxLayout;
	
	return BoxLayout;
});