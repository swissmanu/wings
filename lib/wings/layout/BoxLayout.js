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
	 *     (BoxLayout.ORIENTATION) orientation - Orientation for laying out the
	 *                                           <Widget>s. Optional, Default = BoxLayout.ORIENTATION.LEFT
	 *     (int) horizontalMargin - Define the horizontal margin between
	 *                              layoutted <Widget>s. Optional, Default = 5
	 */
	var BoxLayout = function BoxLayout(orientation, horizontalMargin) {
		var _self = this;
		var _orientation = (orientation !== undefined) ? orientation : BoxLayout.ORIENTATION.LEFT;
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
	
	/** Enum: ORIENTATION
	 * Constants for telling <BoxLayout> which orientation it should use when
	 * laying out a <Widget>s children.
	 *
	 * LEFT - Lay out left to right
	 * RIGHT -  Lay out right to left
	 */
	BoxLayout.ORIENTATION = {
		LEFT: 0
		,RIGHT: 1
	};
	
	BoxLayout.prototype = Object.create(LayoutManager.prototype);
	BoxLayout.prototype.constructor = BoxLayout;
	
	return BoxLayout;
});