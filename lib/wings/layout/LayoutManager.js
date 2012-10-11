/** Class: LayoutManager
 * A <LayoutManager> is a helper for setting positions of various <Widget>s
 * inside another, parent <Widget>.
 * Extend this class to implement your own layout behaviours.
 *
 * See also:
 *     - <BoxLayout>
 */
define(function(require, exports, module) {
	
	/** Constructor: LayoutManager()
	 * Creates a new instance of <LayoutManager>
	 */
	var LayoutManager = function LayoutManager() {
		var _self = this;
		
		/** Function: layoutWidgets(parent, widgets)
		 * Takes an array of <Widget>s and positions them inside parents bounds.
		 * Override this method inside your own <LayoutManager>.
		 *
		 * Parameters:
		 *     (Widget) parent
		 *     (Array) widgtes - An Array containing parents children
		 */
		_self.layoutWidgets = function layoutWidgets(parent, widgets) {
			throw new Error('Implement layoutWidgets!');
		}
		
	};
	
	return LayoutManager;
});