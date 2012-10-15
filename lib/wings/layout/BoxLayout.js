/** Class: BoxLayout
 * The <BoxLayout> places each child of a <Widget> in a row. By passing an
 * orientation on creation you can tell <BoxLayout> if it should either begin
 * laying out the children from left or right. With a second margin argument
 * you can specify how much space should be added between each placed <Widget>.
 *
 * See also:
 *     <BoxLayout.ORIENTATION>
 *
 * Inherits from:
 *     - <LayoutManager>
 */
define(function(require, exports, module) {
	
	var LayoutManager = require('./LayoutManager');
	
	
	/** Constructor: BoxLayout()
	 * Creates a new instance of <BoxLayout>. Pass optional parameters for
	 * customizing how <BoxLayout> places <Widget>s.
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
		 * Lays out the passed <Widget>s inside of parent.
		 * 
		 * Parameters:
		 *     (Widget) parent
		 *     (Array) widgtes - An Array containing parents children
		 */
		_self.layoutWidgets = function layoutWidgets(parent, widgets) {
			if(_orientation === BoxLayout.ORIENTATION.RIGHT) {
				layoutRightToLeft(parent, widgets);
			} else {
				layoutLeftToRight(parent, widgets);
			}
		}
		
		/** Function: getOrientation()
		 * Returns the orientation which the <BoxLayout> uses to lay out the
		 * <Widget>s.
		 *
		 * Returns:
		 *     (BoxLayout.ORIENTATION)
		 */
		_self.getOrientation = function getOrientation() {
			return _orientation;
		}
		
		/** PrivateFunction: layoutLeftToRight(parent, widgets)
		 * Places the <Widget> beginning from the left.
		 *
		 * See also:
		 *     <BoxLayout.ORIENTATION>
		 * 
		 * Parameters:
		 *     (Widget) parent
		 *     (Array) widgtes - An Array containing parents children
		 */
		function layoutLeftToRight(parent, widgets) {
			var left = 0;
			
			for(var i=0, l=widgets.length; i<l; i++) {
				widgets[i].setPosition(left,0);
				left += widgets[i].getSize().width + _horizontalMargin;
			}
		}
		
		/** PrivateFunction: layoutRightToLeft(parent, widgets)
		 * Places the <Widget> beginning from the right.
		 *
		 * See also:
		 *     <BoxLayout.ORIENTATION>
		 * 
		 * Parameters:
		 *     (Widget) parent
		 *     (Array) widgtes - An Array containing parents children
		 */
		function layoutRightToLeft(parent, widgets) {
			var size = parent.getSize();
			var left = size.width;
			
			for(var i=0, l=widgets.length; i<l; i++) {
				var widgetSize = widgets[i].getSize();
				left -= widgetSize.width;
				widgets[i].setPosition(left,0);
				left -= _horizontalMargin;
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